/**
 * TF MULTI-ANALYST SCANNER — CLOUDFLARE DEVICE API REV332 TOKEN GATE + NO MOBILE APPROVAL + REMOTE-ONLY PC TOGGLE
 *
 * Worker Variables / Secrets:
 * - APPS_SCRIPT_URL        : URL deployment Google Apps Script /exec
 * - SERVER_SHARED_SECRET   : sama dengan Script Property di Apps Script
 * - SESSION_SECRET         : random secret panjang, minimal 32 karakter
 * - ALLOWED_EXTENSION_ID   : opsional; isi ecmcgemakncajgbglkggibjgmochancm
 * - TURN_KEY_ID            : Cloudflare Realtime TURN key ID (opsional tapi direkomendasikan)
 * - TURN_KEY_API_TOKEN     : secret token dari TURN key, simpan sebagai Worker Secret
 */

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const PENDING_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const requestPath = requestUrl.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return cors(
        new Response(null, {
          status: 204
        })
      );
    }

    // REV266 premium fast lane: authenticated WebSocket connections are routed
    // to one Durable Object room per license. Mobile and Desktop therefore keep
    // one persistent bidirectional connection instead of waiting for polling.
    if (request.method === 'GET' && requestPath === '/remote/fast-ws') {
      try {
        assertConfig(env);
        return await remoteFastWebSocket(request, env);
      } catch (error) {
        return json({
          ok:false, valid:false,
          code:error && error.code ? error.code : 'REMOTE_FAST_WS_ERROR',
          message:error && error.message ? error.message : String(error)
        }, error && error.status ? error.status : 500);
      }
    }

    if (request.method === 'GET') {
      return json({
        ok: true,
        service: 'TF Device API',
        revision: 'REV367-LOW-USAGE-EXACT-EXPIRY',
        fastRemote: !!env.REMOTE_FAST_ROOM,
        fastProtocol: env.REMOTE_FAST_ROOM ? 'WS-STICKY+WEBRTC+DRIVE-RELAY+TOKEN-GATED-MOBILE-REV332' : 'HTTP+DRIVE-RELAY+TOKEN-GATED-MOBILE-REV332',
        turnConfigured: !!(env.TURN_KEY_ID && env.TURN_KEY_API_TOKEN),
        serverTime: new Date().toISOString()
      });
    }

    if (request.method !== 'POST') {
      return json({
        ok: false,
        code: 'METHOD_NOT_ALLOWED',
        message: 'Gunakan POST.'
      }, 405);
    }

    try {
      assertConfig(env);

      const body = await request.json();

      if (
        env.ALLOWED_EXTENSION_ID &&
        body.extensionId &&
        body.extensionId !== env.ALLOWED_EXTENSION_ID
      ) {
        return json({
          ok: false,
          valid: false,
          code: 'EXTENSION_NOT_ALLOWED',
          message: 'Extension ID tidak diizinkan.'
        }, 403);
      }

      const path = requestPath;

      switch (path) {
        case '/license-check':
          return json(
            await licenseCheck(body, env)
          );

        // REV332: Android/iOS/Web require token login before app access; no Mobile device approval.
        // It validates email + token but does NOT bind a Mobile device slot.
        case '/mobile/login':
          return json(await mobilePortableLogin(body, env));

        case '/mobile/logout':
          return json(await mobilePortableLogout(body, env));

        case '/device-challenge':
          if (normalizeDeviceType(body) === 'MOBILE') return json(mobileDeviceLockRetiredResponse());
          return json(await deviceChallenge(body, env));

        case '/bind-device':
          if (normalizeDeviceType(body) === 'MOBILE') return json(mobileDeviceLockRetiredResponse());
          return json(await bindDevice(body, env));

        case '/session-challenge':
          if (normalizeDeviceType(body) === 'MOBILE') return json(mobileDeviceLockRetiredResponse());
          return json(await sessionChallenge(body, env));

        case '/session-validate':
          if (normalizeDeviceType(body) === 'MOBILE') return json(mobileDeviceLockRetiredResponse());
          return json(await sessionValidate(body, env));

        case '/device-request-decision':
          if (normalizeDeviceType(body) === 'MOBILE') return json(mobileDeviceLockRetiredResponse());
          return json(await deviceRequestDecision(body, env));

        case '/remote/desktop-sync':
          return json(await remoteDesktopSync(body, env));

        case '/remote/desktop-ack':
          return json(await remoteDesktopAck(body, env));

        case '/remote/mobile-status':
          return json(await remoteMobileStatus(body, env));

        // REV332: side-effect-free gate check used ONLY when the user opens Remote UI.
        // Login/dashboard do not depend on this; only the Remote button does.
        case '/remote/availability':
          return json(await remoteAvailability(body, env));

        case '/remote/mobile-command':
          return json(await remoteMobileCommand(body, env));

        case '/remote/mobile-disconnect':
          return json(await remoteMobileDisconnect(body, env));

        case '/remote/fast-ticket':
          return json(await remoteFastTicket(body, env));

        case '/remote/ice-config':
          return json(await remoteIceConfig(body, env));

        case '/remote/import-stage-put':
          return json(await remoteImportStagePut(body, env));

        case '/remote/import-stage-get':
          return json(await remoteImportStageGet(body, env));

        case '/remote/import-stage-clear':
          return json(await remoteImportStageClear(body, env));

        case '/remote/drive-stage-put':
          return json(await remoteDriveStagePut(body, env));

        case '/remote/drive-stage-get':
          return json(await remoteDriveStageGet(body, env));

        case '/remote/drive-stage-clear':
          return json(await remoteDriveStageClear(body, env));

        default:
          return json({
            ok: false,
            valid: false,
            code: 'NOT_FOUND',
            message: 'Endpoint tidak ditemukan.'
          }, 404);
      }
    } catch (error) {
      return json({
        ok: false,
        valid: false,
        code:
          error && error.code
            ? error.code
            : 'DEVICE_API_ERROR',
        message:
          error && error.message
            ? error.message
            : String(error),
        serverTime: new Date().toISOString()
      }, error && error.status ? error.status : 500);
    }
  }
};

function assertConfig(env) {
  if (!env.APPS_SCRIPT_URL) {
    throw appError(
      'CONFIG_MISSING',
      'APPS_SCRIPT_URL belum diatur.',
      500
    );
  }

  if (!env.SERVER_SHARED_SECRET) {
    throw appError(
      'CONFIG_MISSING',
      'SERVER_SHARED_SECRET belum diatur.',
      500
    );
  }

  if (
    !env.SESSION_SECRET ||
    String(env.SESSION_SECRET).length < 32
  ) {
    throw appError(
      'CONFIG_MISSING',
      'SESSION_SECRET minimal 32 karakter.',
      500
    );
  }
}

function cors(response) {
  const headers = new Headers(response.headers);

  headers.set(
    'Access-Control-Allow-Origin',
    '*'
  );

  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,OPTIONS'
  );

  headers.set(
    'Cache-Control',
    'no-store'
  );

  return new Response(response.body, {
    status: response.status,
    headers
  });
}

function json(data, status = 200) {
  return cors(
    new Response(
      JSON.stringify(data || {}),
      {
        status,
        headers: {
          'Content-Type':
            'application/json;charset=UTF-8'
        }
      }
    )
  );
}

function appError(
  code,
  message,
  status = 400
) {
  const error = new Error(message);

  error.code = code;
  error.status = status;

  return error;
}

function cleanEmail(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(
      /[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g,
      ''
    )
    .replace(/\s+/g, '')
    .trim();
}

function cleanToken(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(
      /[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g,
      ''
    )
    .replace(
      /[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g,
      '-'
    )
    .replace(/\s+/g, '')
    .trim();
}

function normalizeDeviceType(body) {
  const raw = String(
    body && (body.deviceType || body.clientType || body.platform) || 'DESKTOP'
  ).trim().toUpperCase();
  return raw === 'MOBILE' || raw === 'ANDROID' || raw === 'IOS' || raw === 'IOS_PWA'
    ? 'MOBILE'
    : 'DESKTOP';
}

function credentialPayload(body) {
  return {
    email: cleanEmail(body.email),
    token: cleanToken(body.token),
    licenseId: String(
      body.licenseId || ''
    ).trim().toUpperCase(),
    deviceType: normalizeDeviceType(body)
  };
}

function projectLicenseSlot(source, deviceType) {
  const mobile = String(deviceType || '').toUpperCase() === 'MOBILE';
  const out = { ...source, deviceType: mobile ? 'MOBILE' : 'DESKTOP' };
  if (mobile) {
    out.activeDeviceId = String(source.mobileActiveDeviceId || '').trim();
    out.activePublicKey = String(source.mobileActivePublicKey || '').trim();
    out.activeSessionId = String(source.mobileActiveSessionId || '').trim();
    out.deviceName = String(source.mobileDeviceName || '').trim();
    out.pendingRequestId = String(source.mobilePendingRequestId || '').trim().toUpperCase();
    out.pendingDeviceId = String(source.mobilePendingDeviceId || '').trim();
    out.pendingPublicKey = String(source.mobilePendingPublicKey || '').trim();
    out.pendingFcmId = String(source.mobilePendingFcmId || '').trim();
    out.pendingStatus = String(source.mobilePendingStatus || '').trim().toUpperCase();
    out.pendingRequestedAt = String(source.mobilePendingRequestedAt || '').trim();
  }
  out.desktopDeviceBound = Boolean(String(source.activeDeviceId || '').trim());
  out.mobileDeviceBound = Boolean(String(source.mobileActiveDeviceId || '').trim());
  return out;
}

const APPS_CALL_RETRY_DELAYS_MS = [450, 900];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shouldRetryAppsHttpStatus(status) {
  return status === 408 ||
    status === 425 ||
    status === 429 ||
    status >= 500;
}

function safeBodyPreview(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

// REV248: Apps Script calls use an operation-specific policy. Heartbeats must
// fail fast and recover silently instead of piling up retries, while actual
// import/license mutations get a wider cold-start window.
function appsCallPolicy(operation) {
  const op = String(operation || '').toLowerCase();
  if (op === 'remote-desktop-sync' || op === 'remote-mobile-status' || op === 'remote-mobile-read') {
    return { attempts: 1, timeouts: [10000], retryDelays: [] };
  }
  if (op === 'remote-import-stage-put' || op === 'remote-import-stage-get' || op === 'remote-import-stage-clear') {
    return { attempts: 2, timeouts: [28000, 22000], retryDelays: [650] };
  }
  if (op === 'remote-drive-stage-put' || op === 'remote-drive-stage-get' || op === 'remote-drive-stage-clear') {
    // REV289 large-file relay: one Apps Script/Drive operation replaces dozens
    // of command-queue chunk ACK round trips. Give Drive cold-start a wider window.
    return { attempts: 2, timeouts: [55000, 40000], retryDelays: [700] };
  }
  if (op === 'remote-mobile-command' || op === 'remote-desktop-ack') {
    // Avoid duplicate command/ACK mutations caused by retrying after a response
    // timeout. Client/desktop will retry with the same remote state instead.
    return { attempts: 1, timeouts: [22000], retryDelays: [] };
  }
  return { attempts: 2, timeouts: [20000, 15000], retryDelays: [550] };
}

async function appsCall(env, operation, payload) {
  let lastError = null;
  const policy = appsCallPolicy(operation);
  const maxAttempts = Math.max(1, Number(policy.attempts || 1));

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const timeoutMs = Number(policy.timeouts[attempt - 1] || policy.timeouts[0] || 12000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(env.APPS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Accept': 'application/json,text/plain;q=0.9,*/*;q=0.1'
        },
        body: JSON.stringify({
          action: 'server',
          secret: env.SERVER_SHARED_SECRET,
          operation,
          payload
        })
      });

      const text = await response.text();
      const contentType = String(response.headers.get('content-type') || '');
      let parsed = null;
      let parseFailed = false;
      try { parsed = JSON.parse(text); } catch (_) { parseFailed = true; }

      if (!response.ok) {
        const retryable = shouldRetryAppsHttpStatus(response.status);
        console.warn('[TF Device API] Apps Script HTTP error', JSON.stringify({
          operation, attempt, maxAttempts, timeoutMs, status: response.status,
          contentType, finalUrl: response.url, bodyPreview: safeBodyPreview(text), retryable
        }));
        lastError = appError('APPS_SCRIPT_HTTP_ERROR', 'Apps Script HTTP ' + response.status, 502);
        if (retryable && attempt < maxAttempts) {
          await sleep(Number(policy.retryDelays[attempt - 1] || APPS_CALL_RETRY_DELAYS_MS[attempt - 1] || 700));
          continue;
        }
        throw lastError;
      }

      if (parseFailed) {
        console.warn('[TF Device API] Apps Script non-JSON response', JSON.stringify({
          operation, attempt, maxAttempts, timeoutMs, status: response.status,
          contentType, finalUrl: response.url, bodyPreview: safeBodyPreview(text),
          retryable: attempt < maxAttempts
        }));
        lastError = appError('APPS_SCRIPT_INVALID_RESPONSE', 'Respons Apps Script bukan JSON setelah ' + attempt + ' percobaan.', 502);
        if (attempt < maxAttempts) {
          await sleep(Number(policy.retryDelays[attempt - 1] || APPS_CALL_RETRY_DELAYS_MS[attempt - 1] || 700));
          continue;
        }
        throw lastError;
      }

      if (attempt > 1) {
        console.log('[TF Device API] Apps Script recovered after retry', JSON.stringify({operation, attempt, status: response.status}));
      }
      return parsed || {};
    } catch (error) {
      const isAbort = error && error.name === 'AbortError';
      const isKnownAppError = error && (
        error.code === 'APPS_SCRIPT_INVALID_RESPONSE' ||
        error.code === 'APPS_SCRIPT_HTTP_ERROR'
      );
      if (isKnownAppError) throw error;

      lastError = appError(
        isAbort ? 'APPS_SCRIPT_TIMEOUT' : 'APPS_SCRIPT_NETWORK_ERROR',
        isAbort ? 'Apps Script timeout.' : 'Gagal menghubungi Apps Script.',
        502
      );
      console.warn('[TF Device API] Apps Script fetch failed', JSON.stringify({
        operation, attempt, maxAttempts, timeoutMs,
        type: isAbort ? 'timeout' : 'network',
        error: error && error.message ? error.message : String(error),
        retryable: attempt < maxAttempts
      }));
      if (attempt < maxAttempts) {
        await sleep(Number(policy.retryDelays[attempt - 1] || APPS_CALL_RETRY_DELAYS_MS[attempt - 1] || 700));
        continue;
      }
      throw lastError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || appError('APPS_SCRIPT_ERROR', 'Apps Script tidak merespons.', 502);
}

async function lookup(body, env) {
  const credentials = credentialPayload(body);

  if (
    !credentials.email ||
    !credentials.token
  ) {
    return {
      ok: true,
      valid: false,
      code: 'LICENSE_NOT_FOUND',
      message: 'Email dan token wajib diisi.'
    };
  }

  const result = await appsCall(
    env,
    'lookup',
    credentials
  );

  return projectLicenseSlot({
    ...result,
    credentials
  }, credentials.deviceType);
}

function publicLicense(source) {
  const keys = [
    'email',
    'status',
    'duration',
    'activatedAt',
    'expiresAt',
    'serverTime',
    'remainingSeconds',
    'isTrial',
    'isPermanent',
    'licenseId',
    'license',
    'deviceType',
    'desktopDeviceBound',
    'mobileDeviceBound',
    'deviceName',
    'pendingRequestId',
    'pendingDeviceId',
    'pendingStatus',
    'pendingRequestedAt',
    'pendingExpiresAt',
    'presenceEndpoint',
    'presenceProtocol',
    'isignalUsersAccessKnown',
    'isignalUsersAccess',
    'isignalUsersIncluded',
    'isignalUsersAddonRequired',
    'isignalUsersPlan',
    'isignalUsersExpiresAt',
    'isignalUsersRemainingSeconds',
    'isignalUsersAccessReason'
  ];

  const output = {};

  for (const key of keys) {
    if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }

  return output;
}

function requireValidLicense(license) {
  if (
    license &&
    license.valid === true
  ) {
    return;
  }

  throw appError(
    String(
      license &&
      license.code ||
      'LICENSE_NOT_FOUND'
    ),
    String(
      license &&
      license.message ||
      'Lisensi tidak valid.'
    ),
    200
  );
}

async function licenseCheck(body, env) {
  const license = await lookup(body, env);

  if (license.valid !== true) {
    return license;
  }

  const pendingExpired =
    license.pendingRequestedAt &&
    Date.now() >
      Date.parse(license.pendingRequestedAt) +
      PENDING_TTL_MS;

  if (pendingExpired) {
    // A read must not erase a newer pending request created concurrently.
    // bindDevice already checks pendingFresh before accepting approvals.
    license.pendingStatus = 'EXPIRED';
  }

  return {
    ok: true,
    valid: true,
    code: 'LICENSE_VALID',
    message: 'Lisensi valid.',
    ...publicLicense(license)
  };
}


// ============================================================
// REV332 — MOBILE/WEB TOKEN GATE; LEGACY MOBILE DEVICE APPROVAL RETIRED
// ============================================================

function mobileDeviceLockRetiredResponse() {
  return {
    ok: true,
    valid: false,
    sessionValid: false,
    code: 'MOBILE_PORTABLE_LOGIN_REQUIRED',
    message: 'Mobile/Web sekarang memakai login Email + Token tanpa Device Lock/approval HP. Gunakan /mobile/login.'
  };
}

async function clearLegacyMobilePendingApproval(license, env) {
  try {
    await appsCall(env, 'clear-pending', {
      ...(license.credentials || {}),
      licenseId: license.licenseId,
      deviceType: 'MOBILE',
      clientType: 'MOBILE'
    });
  } catch (_) {}
}


const MOBILE_PORTABLE_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function mobilePortableLogin(body, env) {
  const scoped = { ...body, deviceType: 'MOBILE', clientType: 'MOBILE' };
  const license = await lookup(scoped, env);
  if (license.valid !== true) return license;

  const sessionId = randomId('MOB');
  const now = Date.now();
  const exp = now + MOBILE_PORTABLE_SESSION_TTL_MS;
  const sessionToken = await signEnvelope(env, 'tfm1', {
    kind: 'mobile_portable',
    licenseId: license.licenseId,
    deviceType: 'MOBILE',
    sessionId,
    iat: now,
    exp
  });

  // Remove any stale Mobile approval/pending state created by older builds.
  // This prevents the retired "HP baru diizinkan / transfer slot Mobile" flow
  // from reappearing after the user migrates to REV332.
  await clearLegacyMobilePendingApproval(license, env);

  // Keep Mobile ONLINE bookkeeping compatible, but never write any
  // device/public-key/session binding into a Mobile device slot.
  try {
    await appsCall(env, 'touch', {
      ...(license.credentials || credentialPayload(scoped)),
      licenseId: license.licenseId,
      deviceType: 'MOBILE'
    });
  } catch (_) {}

  const publicData = publicLicense(license);
  for (const key of [
    'deviceName','pendingRequestId','pendingDeviceId','pendingStatus',
    'pendingRequestedAt','pendingExpiresAt','mobileDeviceBound'
  ]) delete publicData[key];

  return {
    ok: true,
    valid: true,
    sessionValid: true,
    portableSession: true,
    tokenGate: true,
    noDeviceLimit: true,
    mobileApprovalRequired: false,
    code: 'MOBILE_TOKEN_LOGIN_OK',
    message: 'Token valid. Akses TF Analyzer diberikan tanpa approval/transfer slot Mobile.',
    sessionToken,
    sessionId,
    sessionExpiresAt: exp,
    ...publicData
  };
}

async function mobilePortableLogout(body, env) {
  // Portable sessions are stateless signed envelopes. Logout intentionally
  // clears the browser/app copy; the client closes realtime sockets first.
  // A future login can happen from any device using the same email + token.
  let license = null;
  try {
    license = await lookup({ ...body, deviceType:'MOBILE', clientType:'MOBILE' }, env);
  } catch (_) {}
  if (license && license.valid === true) {
    try {
      await appsCall(env, 'remote-mobile-disconnect', {
        ...remoteCredentials(license, body),
        deviceType:'MOBILE'
      });
    } catch (_) {}
  }
  return {
    ok:true,
    valid:true,
    loggedOut:true,
    code:'MOBILE_PORTABLE_LOGOUT_OK',
    message:'Session lokal boleh dibersihkan.'
  };
}

async function validateMobilePortableSessionToken(token, license, env) {
  try {
    const payload = await verifyEnvelope(env, String(token || ''), 'tfm1');
    if (
      payload.kind !== 'mobile_portable' ||
      payload.licenseId !== license.licenseId ||
      String(payload.deviceType || '') !== 'MOBILE' ||
      !payload.sessionId
    ) throw new Error('portable');
    return { ok:true, payload, portable:true };
  } catch (_) {
    return {
      ok:false,
      result:{
        ok:true,
        valid:false,
        sessionValid:false,
        code:'MOBILE_PORTABLE_SESSION_INVALID',
        message:'Session login Mobile/Website tidak valid atau sudah kedaluwarsa.'
      }
    };
  }
}

async function deviceChallenge(body, env) {
  const license = await lookup(body, env);

  if (license.valid !== true) {
    return license;
  }

  const requestId = randomId('REQ');

  const challenge = await signEnvelope(
    env,
    'tfch1',
    {
      kind: 'bind',
      requestId,
      licenseId: license.licenseId,
      deviceType: license.deviceType || normalizeDeviceType(body),
      iat: Date.now(),
      exp:
        Date.now() +
        CHALLENGE_TTL_MS
    }
  );

  return {
    ok: true,
    valid: true,
    code: 'LICENSE_VALID',
    message: 'Challenge perangkat dibuat.',
    requestId,
    challenge,
    ...publicLicense(license)
  };
}

async function bindDevice(body, env) {
  const license = await lookup(body, env);

  if (license.valid !== true) {
    return license;
  }

  const challengeData =
    await verifyEnvelope(
      env,
      String(body.challenge || ''),
      'tfch1'
    );

  if (
    challengeData.kind !== 'bind' ||
    challengeData.licenseId !==
      license.licenseId ||
    String(challengeData.deviceType || 'DESKTOP') !==
      String(license.deviceType || 'DESKTOP')
  ) {
    return {
      ok: true,
      valid: false,
      code: 'DEVICE_CHALLENGE_INVALID',
      message:
        'Challenge perangkat tidak cocok.'
    };
  }

  if (
    String(
      body.requestId || ''
    ).toUpperCase() !==
    String(
      challengeData.requestId || ''
    ).toUpperCase()
  ) {
    return {
      ok: true,
      valid: false,
      code: 'DEVICE_CHALLENGE_INVALID',
      message:
        'Request ID challenge tidak cocok.'
    };
  }

  const publicKeySpki = String(
    body.publicKeySpki || ''
  ).trim();

  const signatureBase64 = String(
    body.signatureBase64 || ''
  ).trim();

  if (
    !publicKeySpki ||
    !signatureBase64
  ) {
    return {
      ok: true,
      valid: false,
      code: 'DEVICE_PROOF_MISSING',
      message:
        'Public key atau signature perangkat tidak tersedia.'
    };
  }

  const signatureValid =
    await verifyDeviceSignature(
      publicKeySpki,
      String(body.challenge || ''),
      signatureBase64
    );

  if (!signatureValid) {
    return {
      ok: true,
      valid: false,
      code: 'DEVICE_SIGNATURE_INVALID',
      message:
        'Tanda tangan perangkat tidak valid.'
    };
  }

  const deviceId =
    await deviceIdFromPublicKey(
      publicKeySpki
    );

  const activeDeviceId = String(
    license.activeDeviceId || ''
  ).trim();

  const activePublicKey = String(
    license.activePublicKey || ''
  ).trim();

  const pendingStatus = String(
    license.pendingStatus || ''
  ).trim().toUpperCase();

  const pendingFresh =
    license.pendingRequestedAt &&
    Date.now() <=
      Date.parse(
        license.pendingRequestedAt
      ) +
      PENDING_TTL_MS;

  const samePendingDevice =
    pendingFresh &&
    String(
      license.pendingDeviceId || ''
    ) === deviceId &&
    String(
      license.pendingPublicKey || ''
    ) === publicKeySpki;

  const sameActiveDevice =
    activeDeviceId === deviceId &&
    (
      !activePublicKey ||
      activePublicKey === publicKeySpki
    );

  const canBind =
    !activeDeviceId ||
    sameActiveDevice ||
    (
      samePendingDevice &&
      pendingStatus === 'APPROVED'
    );

  if (!canBind) {
    const isMobile =
      String(license.deviceType || 'DESKTOP') === 'MOBILE';

    if (
      samePendingDevice &&
      pendingStatus === 'DECLINED'
    ) {
      return {
        ok: true,
        valid: true,
        bound: false,
        code: isMobile
          ? 'MOBILE_DEVICE_REQUEST_DECLINED'
          : 'DEVICE_REQUEST_DECLINED',
        message: isMobile
          ? 'Permintaan aktivasi HP ini ditolak oleh perangkat mobile yang sedang aktif.'
          : 'Permintaan perangkat ditolak.',
        requestId:
          license.pendingRequestId,
        approvalTarget: isMobile ? 'MOBILE' : 'DESKTOP'
      };
    }

    if (
      samePendingDevice &&
      pendingStatus === 'PENDING'
    ) {
      return {
        ok: true,
        valid: true,
        bound: false,
        code: isMobile
          ? 'MOBILE_DEVICE_APPROVAL_REQUIRED'
          : 'DEVICE_APPROVAL_REQUIRED',
        message: isMobile
          ? 'Menunggu persetujuan dari perangkat mobile yang sedang aktif.'
          : 'Menunggu persetujuan perangkat utama.',
        requestId:
          license.pendingRequestId,
        pendingDeviceId: deviceId,
        approvalTarget: isMobile ? 'MOBILE' : 'DESKTOP'
      };
    }

    const pendingRequestId =
      String(
        challengeData.requestId ||
        randomId('REQ')
      ).toUpperCase();

    const pendingReceipt = projectLicenseSlot(await appsCall(
      env,
      'set-pending',
      {
        ...license.credentials,
        licenseId: license.licenseId,
        pendingRequestId,
        pendingDeviceId: deviceId,
        pendingPublicKey:
          publicKeySpki,
        pendingFcmId: String(
          body.fcmRegistrationId || ''
        )
      }
    ), license.deviceType);

    if (!pendingReceipt || pendingReceipt.valid !== true) {
      return pendingReceipt || { ok: false, valid: false, code: 'PENDING_SAVE_FAILED', message: 'Server belum menyimpan permintaan perangkat.' };
    }
    if (String(pendingReceipt.pendingRequestId || '').toUpperCase() !== pendingRequestId ||
        String(pendingReceipt.pendingDeviceId || '') !== deviceId ||
        String(pendingReceipt.pendingStatus || '').toUpperCase() !== 'PENDING') {
      return { ok: false, valid: true, bound: false, code: 'PENDING_SAVE_UNCONFIRMED',
        message: 'Server belum mengonfirmasi penyimpanan permintaan. Periksa koneksi Apps Script lalu coba lagi.' };
    }

    return {
      ok: true,
      valid: true,
      bound: false,
      code: isMobile
        ? 'MOBILE_DEVICE_APPROVAL_REQUIRED'
        : 'DEVICE_APPROVAL_REQUIRED',
      message: isMobile
        ? 'HP baru meminta akses. Buka TF Analyzer pada perangkat mobile yang sedang aktif lalu pilih Izinkan atau Tolak.'
        : 'Persetujuan perangkat utama diperlukan.',
      requestId: pendingRequestId,
      pendingDeviceId: deviceId,
      approvalTarget: isMobile ? 'MOBILE' : 'DESKTOP'
    };
  }

  const sessionId = randomId('SES');

  const sessionToken =
    await signEnvelope(
      env,
      'tfs1',
      {
        kind: 'session',
        licenseId: license.licenseId,
        deviceType: license.deviceType || normalizeDeviceType(body),
        deviceId,
        sessionId,
        iat: Date.now(),
        exp:
          Date.now() +
          SESSION_TTL_MS
      }
    );

  const updated = await appsCall(
    env,
    'bind',
    {
      ...license.credentials,
      licenseId: license.licenseId,
      activeDeviceId: deviceId,
      activePublicKey:
        publicKeySpki,
      activeSessionId: sessionId,
      fcmRegistrationId: String(
        body.fcmRegistrationId || ''
      ),
      deviceName: String(
        body.deviceName || 'Chrome'
      )
    }
  );

  if (updated.valid !== true) {
    return updated;
  }

  if (String(updated.activeDeviceId || '') !== deviceId ||
      String(updated.activeSessionId || '') !== sessionId ||
      String(updated.activePublicKey || '') !== publicKeySpki) {
    return { ok: false, valid: true, bound: false, code: 'DEVICE_BIND_UNCONFIRMED',
      message: 'Server belum mengonfirmasi session baru. Coba periksa kembali.' };
  }

  return {
    ok: true,
    valid: true,
    bound: true,
    code: 'DEVICE_BOUND',
    message:
      activeDeviceId &&
      activeDeviceId !== deviceId
        ? 'Lisensi berhasil dipindahkan ke perangkat baru.'
        : 'Perangkat berhasil diaktifkan.',
    sessionToken,
    deviceName:
      updated.deviceName ||
      body.deviceName ||
      '',
    ...publicLicense(updated)
  };
}

async function sessionChallenge(body, env) {
  const license = await lookup(body, env);

  if (license.valid !== true) {
    return license;
  }

  const session =
    await validateSessionToken(
      body.sessionToken,
      license,
      env
    );

  if (!session.ok) {
    return session.result;
  }

  // REV231: a valid Mobile session challenge is also the Mobile presence heartbeat.
  // Apps Script throttles actual sheet writes, so the 10-second in-app monitor
  // can safely keep ONLINE_STATUS_MOBILE fresh without affecting PC presence.
  if (String(license.deviceType || normalizeDeviceType(body)).toUpperCase() === 'MOBILE') {
    try {
      await appsCall(env, 'touch', {
        ...(license.credentials || credentialPayload(body)),
        licenseId: license.licenseId || body.licenseId || '',
        deviceType: 'MOBILE'
      });
    } catch (touchError) {
      console.warn('[TF Device API] mobile touch failed', touchError && touchError.message ? touchError.message : String(touchError));
    }
  }

  const requestId = randomId('REQ');

  const challenge = await signEnvelope(
    env,
    'tfch1',
    {
      kind: 'session',
      requestId,
      licenseId: license.licenseId,
      deviceType: license.deviceType || normalizeDeviceType(body),
      deviceId:
        session.payload.deviceId,
      sessionId:
        session.payload.sessionId,
      iat: Date.now(),
      exp:
        Date.now() +
        CHALLENGE_TTL_MS
    }
  );

  return {
    ok: true,
    valid: true,
    sessionValid: true,
    code: 'DEVICE_SESSION_VALID',
    message:
      'Session challenge dibuat.',
    requestId,
    challenge,
    ...publicLicense(license)
  };
}

async function sessionValidate(body, env) {
  const license = await lookup(body, env);

  if (license.valid !== true) {
    return license;
  }

  const session =
    await validateSessionToken(
      body.sessionToken,
      license,
      env
    );

  if (!session.ok) {
    return session.result;
  }

  if (String(license.deviceType || normalizeDeviceType(body)).toUpperCase() === 'MOBILE') {
    try {
      await appsCall(env, 'touch', {
        ...(license.credentials || credentialPayload(body)),
        licenseId: license.licenseId || body.licenseId || '',
        deviceType: 'MOBILE'
      });
    } catch (touchError) {}
  }

  const challenge =
    await verifyEnvelope(
      env,
      String(body.challenge || ''),
      'tfch1'
    );

  if (
    challenge.kind !== 'session' ||
    challenge.licenseId !==
      license.licenseId ||
    String(challenge.deviceType || 'DESKTOP') !== String(license.deviceType || 'DESKTOP') ||
    challenge.sessionId !==
      session.payload.sessionId
  ) {
    return {
      ok: true,
      valid: false,
      sessionValid: false,
      code: 'DEVICE_SESSION_INVALID',
      message:
        'Session challenge tidak cocok.'
    };
  }

  if (
    String(
      body.requestId || ''
    ).toUpperCase() !==
    String(
      challenge.requestId || ''
    ).toUpperCase()
  ) {
    return {
      ok: true,
      valid: false,
      sessionValid: false,
      code: 'DEVICE_SESSION_INVALID',
      message:
        'Request ID session tidak cocok.'
    };
  }

  const publicKeySpki = String(
    body.publicKeySpki || ''
  ).trim();

  if (
    publicKeySpki !==
    String(
      license.activePublicKey || ''
    ).trim()
  ) {
    return {
      ok: true,
      valid: false,
      sessionValid: false,
      code: 'DEVICE_SESSION_CHANGED',
      message:
        'Public key perangkat berubah.'
    };
  }

  const validSignature =
    await verifyDeviceSignature(
      publicKeySpki,
      String(body.challenge || ''),
      String(
        body.signatureBase64 || ''
      )
    );

  if (!validSignature) {
    return {
      ok: true,
      valid: false,
      sessionValid: false,
      code: 'DEVICE_SIGNATURE_INVALID',
      message:
        'Tanda tangan session tidak valid.'
    };
  }

  return {
    ok: true,
    valid: true,
    sessionValid: true,
    code: 'DEVICE_SESSION_VALID',
    message:
      'Session perangkat valid.',
    deviceName:
      license.deviceName || '',
    ...publicLicense(license)
  };
}

async function deviceRequestDecision(
  body,
  env
) {
  const decisionDeviceType = normalizeDeviceType(body);
  const license = await lookup({ ...body, deviceType: decisionDeviceType }, env);

  if (license.valid !== true) {
    return license;
  }

  const session =
    await validateSessionToken(
      body.sessionToken,
      license,
      env
    );

  if (!session.ok) {
    return session.result;
  }

  const challenge =
    await verifyEnvelope(
      env,
      String(body.challenge || ''),
      'tfch1'
    );

  if (
    challenge.kind !== 'session' ||
    challenge.sessionId !==
      session.payload.sessionId ||
    String(challenge.deviceType || 'DESKTOP') !==
      String(license.deviceType || 'DESKTOP')
  ) {
    return {
      ok: true,
      valid: false,
      decisionApplied: false,
      code: 'DEVICE_SESSION_INVALID',
      message:
        'Challenge keputusan tidak valid.'
    };
  }

  if (
    String(
      body.requestId || ''
    ).trim().toUpperCase() !==
    String(
      challenge.requestId || ''
    ).trim().toUpperCase()
  ) {
    return {
      ok: true,
      valid: false,
      decisionApplied: false,
      code: 'DEVICE_SESSION_INVALID',
      message:
        'Request ID keputusan tidak cocok.'
    };
  }

  const publicKeySpki = String(
    body.publicKeySpki || ''
  ).trim();

  if (
    publicKeySpki !==
    String(
      license.activePublicKey || ''
    ).trim()
  ) {
    return {
      ok: true,
      valid: false,
      decisionApplied: false,
      code: 'DEVICE_SESSION_CHANGED',
      message:
        'Public key perangkat utama berubah.'
    };
  }

  const decisionSignatureValid =
    await verifyDeviceSignature(
      publicKeySpki,
      String(body.challenge || ''),
      String(
        body.signatureBase64 || ''
      )
    );

  if (!decisionSignatureValid) {
    return {
      ok: true,
      valid: false,
      decisionApplied: false,
      code: 'DEVICE_SIGNATURE_INVALID',
      message:
        'Tanda tangan keputusan tidak valid.'
    };
  }

  const pendingRequestId = String(
    body.pendingRequestId || ''
  ).trim().toUpperCase();

  if (
    !pendingRequestId ||
    pendingRequestId !==
      String(
        license.pendingRequestId || ''
      ).trim().toUpperCase()
  ) {
    return {
      ok: true,
      valid: true,
      decisionApplied: false,
      code: 'DEVICE_REQUEST_NOT_FOUND',
      message:
        'Pending Request ID tidak ditemukan.'
    };
  }

  const decision = String(
    body.decision || ''
  ).trim().toUpperCase();

  const updated = await appsCall(
    env,
    'set-decision',
    {
      ...license.credentials,
      licenseId:
        license.licenseId,
      pendingRequestId,
      decision
    }
  );

  if (updated.decisionApplied === false) {
    return updated;
  }

  return {
    ok: true,
    valid: true,
    decisionApplied: true,
    code:
      String(license.deviceType || 'DESKTOP') === 'MOBILE'
        ? (
            decision === 'APPROVE'
              ? 'MOBILE_DEVICE_REQUEST_APPROVED'
              : 'MOBILE_DEVICE_REQUEST_DECLINED'
          )
        : (
            decision === 'APPROVE'
              ? 'DEVICE_REQUEST_APPROVED'
              : 'DEVICE_REQUEST_DECLINED'
          ),
    message:
      String(license.deviceType || 'DESKTOP') === 'MOBILE'
        ? (
            decision === 'APPROVE'
              ? 'HP baru diizinkan. Akses Mobile akan berpindah setelah HP baru menyelesaikan aktivasi.'
              : 'Permintaan HP baru ditolak.'
          )
        : (
            decision === 'APPROVE'
              ? 'Perangkat baru diizinkan.'
              : 'Permintaan perangkat ditolak.'
          ),
    pendingRequestId,
    pendingStatus:
      decision === 'APPROVE'
        ? 'APPROVED'
        : 'DECLINED'
  };
}

async function validateSessionToken(
  token,
  license,
  env
) {
  try {
    const payload =
      await verifyEnvelope(
        env,
        String(token || ''),
        'tfs1'
      );

    if (
      payload.kind !== 'session' ||
      payload.licenseId !==
        license.licenseId
    ) {
      throw new Error('license');
    }

    if (
      String(payload.deviceType || 'DESKTOP') !== String(license.deviceType || 'DESKTOP')
    ) {
      throw new Error('device_type');
    }

    if (
      payload.sessionId !==
      String(
        license.activeSessionId || ''
      )
    ) {
      throw new Error('session');
    }

    if (
      payload.deviceId !==
      String(
        license.activeDeviceId || ''
      )
    ) {
      throw new Error('device');
    }

    return {
      ok: true,
      payload
    };
  } catch (_) {
    return {
      ok: false,
      result: {
        ok: true,
        valid: false,
        sessionValid: false,
        code: 'DEVICE_SESSION_INVALID',
        message:
          'Session perangkat tidak valid.'
      }
    };
  }
}

async function signEnvelope(
  env,
  prefix,
  payload
) {
  const encoded = base64UrlEncode(
    encoder.encode(
      JSON.stringify(payload)
    )
  );

  const signature = await hmac(
    env.SESSION_SECRET,
    prefix + '.' + encoded
  );

  return (
    prefix +
    '.' +
    encoded +
    '.' +
    base64UrlEncode(signature)
  );
}

async function verifyEnvelope(
  env,
  token,
  expectedPrefix
) {
  const parts = String(
    token || ''
  ).split('.');

  if (
    parts.length !== 3 ||
    parts[0] !== expectedPrefix
  ) {
    throw appError(
      'SIGNED_TOKEN_INVALID',
      'Token server tidak valid.'
    );
  }

  const expected = await hmac(
    env.SESSION_SECRET,
    parts[0] + '.' + parts[1]
  );

  const actual = base64UrlDecode(
    parts[2]
  );

  if (
    !constantTimeEqual(
      expected,
      actual
    )
  ) {
    throw appError(
      'SIGNED_TOKEN_INVALID',
      'Signature token server tidak valid.'
    );
  }

  const payload = JSON.parse(
    decoder.decode(
      base64UrlDecode(parts[1])
    )
  );

  if (
    !payload.exp ||
    Date.now() > Number(payload.exp)
  ) {
    throw appError(
      'SIGNED_TOKEN_EXPIRED',
      'Token server kedaluwarsa.'
    );
  }

  return payload;
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(secret)),
    {
      name: 'HMAC',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  return new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(value)
    )
  );
}

async function verifyDeviceSignature(
  publicKeySpki,
  challenge,
  signatureBase64
) {
  try {
    const key =
      await crypto.subtle.importKey(
        'spki',
        base64Decode(publicKeySpki),
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        false,
        ['verify']
      );

    let signature =
      base64Decode(signatureBase64);

    if (signature.length !== 64) {
      signature = derToRawP256(
        signature
      );
    }

    return await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      key,
      signature,
      encoder.encode(challenge)
    );
  } catch (_) {
    return false;
  }
}

async function deviceIdFromPublicKey(
  publicKeySpki
) {
  const digest = new Uint8Array(
    await crypto.subtle.digest(
      'SHA-256',
      base64Decode(publicKeySpki)
    )
  );

  return (
    'TFDEV-' +
    Array.from(
      digest,
      function (byte) {
        return byte
          .toString(16)
          .padStart(2, '0');
      }
    ).join('').toUpperCase()
  );
}

function derToRawP256(bytes) {
  const data =
    bytes instanceof Uint8Array
      ? bytes
      : new Uint8Array(bytes);

  if (data[0] !== 0x30) {
    throw new Error('DER invalid');
  }

  let offset = 2;

  if (data[1] & 0x80) {
    offset =
      2 +
      (data[1] & 0x7f);
  }

  if (data[offset++] !== 0x02) {
    throw new Error('DER R invalid');
  }

  const rLength = data[offset++];

  let r = data.slice(
    offset,
    offset + rLength
  );

  offset += rLength;

  if (data[offset++] !== 0x02) {
    throw new Error('DER S invalid');
  }

  const sLength = data[offset++];

  let s = data.slice(
    offset,
    offset + sLength
  );

  while (
    r.length > 32 &&
    r[0] === 0
  ) {
    r = r.slice(1);
  }

  while (
    s.length > 32 &&
    s[0] === 0
  ) {
    s = s.slice(1);
  }

  const output = new Uint8Array(64);

  output.set(
    r,
    32 - r.length
  );

  output.set(
    s,
    64 - s.length
  );

  return output;
}

function randomId(prefix) {
  return (
    prefix +
    '-' +
    crypto.randomUUID()
      .replace(/-/g, '')
      .toUpperCase()
  );
}

function base64Decode(value) {
  const binary = atob(
    String(value || '')
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  );

  const output =
    new Uint8Array(binary.length);

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    output[index] =
      binary.charCodeAt(index);
  }

  return output;
}

function base64UrlDecode(value) {
  let text = String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  while (text.length % 4) {
    text += '=';
  }

  return base64Decode(text);
}

function base64UrlEncode(bytes) {
  let binary = '';

  const data =
    bytes instanceof Uint8Array
      ? bytes
      : new Uint8Array(bytes);

  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array)) {
    a = new Uint8Array(a || []);
  }

  if (!(b instanceof Uint8Array)) {
    b = new Uint8Array(b || []);
  }

  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;

  for (
    let index = 0;
    index < a.length;
    index += 1
  ) {
    difference |= a[index] ^ b[index];
  }

  return difference === 0;
}

// ============================================================================
// REV233 — PREMIUM REMOTE CONTROL
// ============================================================================
const REMOTE_ALLOWED_ACTIONS_V233 = new Set([
  'update',
  'refresh',
  'batch_toggle',
  'scan_channel',
  'scan_from_isignal',
  'open_dashboard',
  'export_data',
  'add_analyst',
  'set_time_range',
  'set_scan_pair',
  'set_all_analyst_pairs',
  'set_analysts',
  // REV279: accept both the canonical row mutation and older explicit aliases.
  // Mobile REV279 uses set_analysts/mode=remove for backward compatibility,
  // while these aliases keep future realtime and HTTP clients interoperable.
  'remove_analyst',
  'remove_analyst_row',
  'patch_analyst',
  'patch_analyst_row',
  'set_analyst_row',
  'set_remember_links',
  'clear_scan_log',
  'clear_power_log',
  'import_bundle_begin',
  'import_bundle_chunk',
  'import_bundle_commit',
  'export_bundle_prepare',
  'export_bundle_chunk',
  'export_bundle_finish'
]);


// REV236: Remote heartbeat requests arrive every few seconds. REV235 performed
// a full Apps Script license lookup for every heartbeat from both PC and
// Mobile. Keep a very short per-isolate cache of the already projected license
// so normal polling does not repeatedly wake Apps Script. The cache is only 8s;
// reset/revocation therefore still takes effect quickly.
const REMOTE_LICENSE_CACHE_TTL_MS_V236 = 45000; // REV260: avoid repeated Apps Script license lookups during active Remote
const REMOTE_LICENSE_CACHE_MAX_V236 = 160;
const REMOTE_LICENSE_CACHE_V236 = new Map();

function remoteLicenseCacheKeyV236(body, type) {
  return [
    type,
    cleanEmail(body && body.email),
    cleanToken(body && body.token),
    String(body && body.licenseId || '').trim().toUpperCase()
  ].join('|');
}

function remoteLicenseCacheGetV236(key) {
  const hit = REMOTE_LICENSE_CACHE_V236.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > REMOTE_LICENSE_CACHE_TTL_MS_V236) {
    REMOTE_LICENSE_CACHE_V236.delete(key);
    return null;
  }
  return hit.license || null;
}

function remoteLicenseCachePutV236(key, license) {
  if (!license || license.valid !== true) return;
  if (REMOTE_LICENSE_CACHE_V236.size >= REMOTE_LICENSE_CACHE_MAX_V236) {
    const first = REMOTE_LICENSE_CACHE_V236.keys().next();
    if (!first.done) REMOTE_LICENSE_CACHE_V236.delete(first.value);
  }
  REMOTE_LICENSE_CACHE_V236.set(key, { at: Date.now(), license });
}

async function remoteRequireSession(body, env, expectedType) {
  const type = expectedType === 'MOBILE' ? 'MOBILE' : 'DESKTOP';
  const scopedBody = { ...body, deviceType: type, clientType: type };
  const cacheKey = remoteLicenseCacheKeyV236(scopedBody, type);
  let license = remoteLicenseCacheGetV236(cacheKey);

  if (!license) {
    license = await lookup(scopedBody, env);
    if (license.valid !== true) return { ok: false, result: license };
    remoteLicenseCachePutV236(cacheKey, license);
  }

  if (license.isTrial === true) {
    return {
      ok: false,
      result: {
        ok: true,
        valid: false,
        code: 'REMOTE_PREMIUM_REQUIRED',
        message: 'Fitur Remote tersedia untuk lisensi berbayar / premium.'
      }
    };
  }

  // REV332: Mobile/Website accepts the portable signed login token first.
  // Legacy bound Mobile sessions remain valid as fallback so older APK/PWA
  // builds are not broken during rollout. Desktop remains strict Device Lock.
  let session = type === 'MOBILE'
    ? await validateMobilePortableSessionToken(body.sessionToken, license, env)
    : await validateSessionToken(body.sessionToken, license, env);

  if (!session.ok && type === 'MOBILE') {
    session = await validateSessionToken(body.sessionToken, license, env);
  }

  if (!session.ok) {
    REMOTE_LICENSE_CACHE_V236.delete(cacheKey);
    const fresh = await lookup(scopedBody, env);
    if (fresh.valid !== true) return { ok: false, result: fresh };
    remoteLicenseCachePutV236(cacheKey, fresh);

    let freshSession = type === 'MOBILE'
      ? await validateMobilePortableSessionToken(body.sessionToken, fresh, env)
      : await validateSessionToken(body.sessionToken, fresh, env);
    if (!freshSession.ok && type === 'MOBILE') {
      freshSession = await validateSessionToken(body.sessionToken, fresh, env);
    }
    if (!freshSession.ok) return { ok: false, result: freshSession.result };
    license = fresh;
    const actualFreshType = String(freshSession.payload && freshSession.payload.deviceType || license.deviceType || '').toUpperCase();
    if (actualFreshType !== type) {
      return { ok:false, result:{ ok:true, valid:false, sessionValid:false, code:'REMOTE_DEVICE_TYPE_MISMATCH', message:'Remote session device type tidak cocok.' } };
    }
    return { ok: true, license, session: freshSession };
  }

  const actualType = String(session.payload && session.payload.deviceType || license.deviceType || '').toUpperCase();
  if (actualType !== type) {
    return {
      ok: false,
      result: {
        ok: true,
        valid: false,
        sessionValid: false,
        code: 'REMOTE_DEVICE_TYPE_MISMATCH',
        message: 'Remote session device type tidak cocok.'
      }
    };
  }
  return { ok: true, license, session };
}

function remoteCredentials(license, body) {
  return {
    ...(license.credentials || credentialPayload(body)),
    licenseId: license.licenseId || body.licenseId || ''
  };
}

function remoteSafeSnapshot(value) {
  if (!value || typeof value !== 'object') return {};
  let text = '{}';
  try { text = JSON.stringify(value); } catch (_) {}
  if (text.length > 42000) throw appError('REMOTE_SNAPSHOT_TOO_LARGE','Remote snapshot terlalu besar.',413);
  try { return JSON.parse(text); } catch (_) { return {}; }
}

function remoteSafeCommand(value) {
  if (!value || typeof value !== 'object') throw appError('REMOTE_INVALID_COMMAND','Remote command tidak valid.',400);
  const action = String(value.action || '').trim().toLowerCase();
  if (!REMOTE_ALLOWED_ACTIONS_V233.has(action)) {
    throw appError('REMOTE_ACTION_NOT_ALLOWED','Remote action tidak diizinkan.',400);
  }
  const payload = value.payload && typeof value.payload === 'object' ? value.payload : {};
  let serialized = '';
  try { serialized = JSON.stringify({ action, payload }); } catch (_) {
    throw appError('REMOTE_INVALID_COMMAND','Remote command tidak dapat diserialisasi.',400);
  }
  if (serialized.length > 36000) {
    throw appError('REMOTE_COMMAND_TOO_LARGE','Remote command terlalu besar. Maksimum sekitar 36 KB.',413);
  }
  return { action, payload };
}

async function remoteDesktopSync(body, env) {
  const auth = await remoteRequireSession(body, env, 'DESKTOP');
  if (!auth.ok) return auth.result;
  try {
    const result = await appsCall(env, 'remote-desktop-sync', {
      ...remoteCredentials(auth.license, body),
      deviceType: 'DESKTOP',
      snapshot: remoteSafeSnapshot(body.snapshot),
      snapshotSig: String(body.snapshotSig || '').slice(0,80),
      extensionVersion: String(body.extensionVersion || '').slice(0,64)
    });
    return { ...result, code: result.code || 'REMOTE_DESKTOP_SYNC' };
  } catch (e) {
    if (e && (e.code === 'APPS_SCRIPT_TIMEOUT' || e.code === 'APPS_SCRIPT_NETWORK_ERROR')) {
      return { ok:true, valid:true, retry:true, code:'REMOTE_BACKEND_RETRY', message:'Relay Remote sedang warming/reconnect. State desktop tetap dipertahankan.', revision:'REV248' };
    }
    throw e;
  }
}

async function remoteDesktopAck(body, env) {
  const auth = await remoteRequireSession(body, env, 'DESKTOP');
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-desktop-ack', {
    ...remoteCredentials(auth.license, body),
    deviceType: 'DESKTOP',
    commandId: String(body.commandId || '').slice(0,80),
    success: body.success === true,
    result: body.result && typeof body.result === 'object' ? body.result : {}
  });
  return { ...result, code: result.code || 'REMOTE_DESKTOP_ACK' };
}

async function remoteMobileStatus(body, env) {
  // REV260: cold Remote open used to perform TWO Apps Script round-trips in
  // sequence: license lookup, then mobile-status. When the Worker auth cache is
  // cold, run a side-effect-free snapshot read in PARALLEL with auth lookup.
  // Nothing from the speculative read is returned unless session validation
  // succeeds and the requested licenseId matches the authenticated license.
  const requestedLicenseId = String(body && body.licenseId || '').trim();
  const scopedBody = { ...body, deviceType:'MOBILE', clientType:'MOBILE' };
  const cacheKey = remoteLicenseCacheKeyV236(scopedBody, 'MOBILE');
  const hadWarmLicense = !!remoteLicenseCacheGetV236(cacheKey);
  let bootstrapPromise = null;
  if (!hadWarmLicense && requestedLicenseId) {
    bootstrapPromise = appsCall(env, 'remote-mobile-read', {
      ...credentialPayload(body),
      licenseId: requestedLicenseId,
      deviceType: 'MOBILE'
    }).catch(() => null);
  }

  const auth = await remoteRequireSession(body, env, 'MOBILE');
  if (!auth.ok) return auth.result;
  try {
    if (bootstrapPromise && String(auth.license && auth.license.licenseId || '') === requestedLicenseId) {
      const fast = await bootstrapPromise;
      if (fast && fast.valid !== false) {
        return { ...fast, mobileRemoteOnline:true, bootstrapCold:true, code: fast.code || 'REMOTE_MOBILE_STATUS_FAST', revision:'REV260' };
      }
    }
    const result = await appsCall(env, 'remote-mobile-status', {
      ...remoteCredentials(auth.license, body),
      deviceType: 'MOBILE'
    });
    return { ...result, code: result.code || 'REMOTE_MOBILE_STATUS', revision:'REV260' };
  } catch (e) {
    if (e && (e.code === 'APPS_SCRIPT_TIMEOUT' || e.code === 'APPS_SCRIPT_NETWORK_ERROR')) {
      return { ok:true, valid:true, retry:true, code:'REMOTE_BACKEND_RETRY', message:'Relay Remote sedang warming/reconnect. Gunakan state terakhir sementara.', revision:'REV260' };
    }
    throw e;
  }
}

async function remoteAvailability(body, env) {
  const auth = await remoteRequireSession(body, env, 'MOBILE');
  if (!auth.ok) return auth.result;
  if (!env.REMOTE_FAST_ROOM) {
    return {
      ok:true, valid:true, remoteEnabled:false, desktopRemoteOnline:false,
      desktopTransportOnline:false, desktopExecutorOnline:false,
      code:'REMOTE_AVAILABILITY_UNSUPPORTED',
      message:'Realtime Remote room belum dikonfigurasi.'
    };
  }
  const licenseId = String(auth.license && auth.license.licenseId || body.licenseId || '').trim();
  if (!licenseId) throw appError('REMOTE_FAST_LICENSE_MISSING','License Remote tidak tersedia.',400);
  const id = env.REMOTE_FAST_ROOM.idFromName('license:' + licenseId);
  const stub = env.REMOTE_FAST_ROOM.get(id);
  const r = await stub.fetch(new Request('https://tf-internal/availability', {
    method:'GET',
    headers:{'x-tf-internal':'remote-availability-v332'}
  }));
  let data={};
  try { data=await r.json(); } catch (_) {}
  return {
    ok:true,
    valid:true,
    remoteEnabled:data.desktopRemoteOnline===true,
    desktopRemoteOnline:data.desktopRemoteOnline===true,
    desktopTransportOnline:data.desktopTransportOnline===true,
    desktopExecutorOnline:data.desktopExecutorOnline===true,
    desktopRemoteDisabled:data.desktopRemoteDisabled===true,
    code:'REMOTE_AVAILABILITY',
    revision:'REV367',
    serverTime:new Date().toISOString()
  };
}

async function remoteMobileCommand(body, env) {
  const auth = await remoteRequireSession(body, env, 'MOBILE');
  if (!auth.ok) return auth.result;
  const command = remoteSafeCommand(body.command);
  const result = await appsCall(env, 'remote-mobile-command', {
    ...remoteCredentials(auth.license, body),
    deviceType: 'MOBILE',
    command
  });
  return { ...result, code: result.code || 'REMOTE_MOBILE_COMMAND' };
}

async function remoteMobileDisconnect(body, env) {
  const auth = await remoteRequireSession(body, env, 'MOBILE');
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-mobile-disconnect', {
    ...remoteCredentials(auth.license, body),
    deviceType: 'MOBILE'
  });
  return { ...result, code: result.code || 'REMOTE_MOBILE_DISCONNECT' };
}


async function remoteFastTicket(body, env) {
  if (!env.REMOTE_FAST_ROOM) {
    return { ok:false, valid:true, fastAvailable:false, code:'REMOTE_FAST_NOT_CONFIGURED', message:'WebSocket Fast Lane belum diaktifkan pada Worker.' };
  }
  const role = String(body && (body.deviceType || body.clientType) || '').toUpperCase() === 'DESKTOP' ? 'DESKTOP' : 'MOBILE';
  const auth = await remoteRequireSession(body, env, role);
  if (!auth.ok) return auth.result;
  const licenseId = String(auth.license && auth.license.licenseId || body.licenseId || '').trim();
  if (!licenseId) throw appError('REMOTE_FAST_LICENSE_MISSING','License Fast Lane tidak tersedia.',400);
  const exp = Date.now() + 15 * 60 * 1000;
  const rawLicenseExpiry = auth.license && auth.license.isPermanent === true ? 0 : (auth.license && auth.license.expiresAt);
  let licenseExpiresAt = 0;
  if (rawLicenseExpiry) {
    const numericExpiry = Number(rawLicenseExpiry);
    const parsedExpiry = Number.isFinite(numericExpiry) && numericExpiry > 1000000000000
      ? numericExpiry
      : Date.parse(String(rawLicenseExpiry));
    if (Number.isFinite(parsedExpiry) && parsedExpiry > 0) licenseExpiresAt = parsedExpiry;
  }
  if (licenseExpiresAt && licenseExpiresAt <= Date.now()) {
    return { ok:true, valid:false, fastAvailable:false, code:'LICENSE_EXPIRED', message:'Masa berlaku lisensi telah berakhir.', expiresAt:auth.license.expiresAt || '' };
  }
  const clientInstanceId = role === 'MOBILE'
    ? String(body.mobileInstanceId || body.clientInstanceId || '').trim().slice(0,120)
    : '';
  const ticket = await signEnvelope(env, 'TFRF1', {
    licenseId,
    role,
    clientInstanceId,
    exp,
    licenseExpiresAt,
    nonce: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  });
  return { ok:true, valid:true, fastAvailable:true, ticket, expiresAt:exp, licenseExpiresAt, role, clientInstanceId, code:'REMOTE_FAST_TICKET' };
}

async function remoteIceConfig(body, env) {
  const role = String(body && (body.deviceType || body.clientType) || '').toUpperCase() === 'DESKTOP' ? 'DESKTOP' : 'MOBILE';
  const auth = await remoteRequireSession(body, env, role);
  if (!auth.ok) return auth.result;
  const fallback = [
    { urls:['stun:stun.cloudflare.com:3478','stun:stun.l.google.com:19302'] }
  ];
  if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) {
    return { ok:true, valid:true, turnAvailable:false, iceServers:fallback, ttl:0, code:'REMOTE_ICE_STUN_ONLY' };
  }
  const ttl = Math.max(3600, Math.min(86400, Number(body && body.ttl || 21600)));
  const url = 'https://rtc.live.cloudflare.com/v1/turn/keys/' + encodeURIComponent(String(env.TURN_KEY_ID)) + '/credentials/generate-ice-servers';
  const ctl = new AbortController();
  const timer = setTimeout(()=>ctl.abort(), 7000);
  try {
    const r = await fetch(url, {
      method:'POST', signal:ctl.signal,
      headers:{'Authorization':'Bearer '+String(env.TURN_KEY_API_TOKEN),'Content-Type':'application/json'},
      body:JSON.stringify({ttl})
    });
    const data = await r.json();
    if (!r.ok || !data || !Array.isArray(data.iceServers)) throw appError('TURN_CREDENTIALS_FAILED','TURN credentials gagal dibuat.',502);
    // Browsers commonly block TURN/STUN alternate port 53. Remove it so ICE
    // does not waste time waiting on a candidate that Chrome cannot use.
    const cleanServers = data.iceServers.map(server=>{
      const x={...server}; const urls=Array.isArray(x.urls)?x.urls:[x.urls];
      x.urls=urls.filter(Boolean).filter(u=>!/:53(?:\?|$)/.test(String(u)));
      return x;
    }).filter(x=>Array.isArray(x.urls)&&x.urls.length);
    return {ok:true,valid:true,turnAvailable:true,iceServers:cleanServers,ttl,expiresAt:Date.now()+ttl*1000,code:'REMOTE_ICE_TURN_READY'};
  } catch (e) {
    if (e && e.code) throw e;
    return {ok:true,valid:true,turnAvailable:false,iceServers:fallback,ttl:0,code:'REMOTE_ICE_TURN_FALLBACK',message:'TURN sementara tidak tersedia; STUN/WebSocket fallback tetap aktif.'};
  } finally { clearTimeout(timer); }
}

async function remoteFastWebSocket(request, env) {
  if (!env.REMOTE_FAST_ROOM) throw appError('REMOTE_FAST_NOT_CONFIGURED','Durable Object REMOTE_FAST_ROOM belum dikonfigurasi.',503);
  if (String(request.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') {
    throw appError('REMOTE_FAST_UPGRADE_REQUIRED','Gunakan WebSocket upgrade.',426);
  }
  const url = new URL(request.url);
  const payload = await verifyEnvelope(env, url.searchParams.get('ticket') || '', 'TFRF1');
  const licenseId = String(payload.licenseId || '').trim();
  const role = String(payload.role || '').toUpperCase();
  if (!licenseId || !['MOBILE','DESKTOP'].includes(role)) throw appError('REMOTE_FAST_TICKET_INVALID','Ticket Fast Lane tidak valid.',403);
  const id = env.REMOTE_FAST_ROOM.idFromName('license:' + licenseId);
  const stub = env.REMOTE_FAST_ROOM.get(id);
  const headers = new Headers(request.headers);
  headers.set('x-tf-fast-role', role);
  headers.set('x-tf-fast-license', licenseId);
  headers.set('x-tf-fast-exp', String(payload.exp || 0));
  headers.set('x-tf-license-exp', String(payload.licenseExpiresAt || 0));
  headers.set('x-tf-fast-instance', String(payload.clientInstanceId || '').slice(0,120));
  return stub.fetch(new Request(request, { headers }));
}

async function remoteImportStagePut(body, env) {
  const auth = await remoteRequireSession(body, env, 'MOBILE');
  if (!auth.ok) return auth.result;
  const data = String(body.data || '');
  const partMode = Number.isInteger(Number(body.partIndex)) && Number(body.totalParts || 0) > 0;
  const maxChars = partMode ? 70000 : 4500000;
  if (!data || data.length > maxChars) throw appError('REMOTE_IMPORT_STAGE_SIZE', partMode ? 'Fast Import part terlalu besar.' : 'Fast Import kosong atau terlalu besar (maks. sekitar 4.5 MB setelah kompresi).',413);
  const result = await appsCall(env, 'remote-import-stage-put', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100),
    fileName: String(body.fileName || '').slice(0,180),
    encoding: String(body.encoding || 'plain').slice(0,20),
    originalChars: Number(body.originalChars || 0),
    partIndex: partMode ? Math.max(0, Number(body.partIndex || 0)) : null,
    totalParts: partMode ? Math.max(1, Math.min(100, Number(body.totalParts || 1))) : null,
    data
  });
  return { ...result, code: result.code || 'REMOTE_IMPORT_STAGE_PUT' };
}

async function remoteImportStageGet(body, env) {
  const auth = await remoteRequireSession(body, env, 'DESKTOP');
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-import-stage-get', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100),
    metaOnly: body.metaOnly === true,
    partIndex: Number.isInteger(Number(body.partIndex)) ? Number(body.partIndex) : null
  });
  return { ...result, code: result.code || 'REMOTE_IMPORT_STAGE_GET' };
}

async function remoteImportStageClear(body, env) {
  const auth = await remoteRequireSession(body, env, 'DESKTOP');
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-import-stage-clear', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100)
  });
  return { ...result, code: result.code || 'REMOTE_IMPORT_STAGE_CLEAR' };
}


// REV289 — private Google Drive large-file relay. The Drive file is never made
// public; Worker session validation happens first and Apps Script reads/writes
// it as the deployment owner. PC->Mobile full bundles therefore need one put +
// one get instead of N export_bundle_chunk commands and N ACK waits.
function remoteDriveRole(body) {
  return String(body && (body.deviceType || body.clientType) || '').toUpperCase() === 'DESKTOP' ? 'DESKTOP' : 'MOBILE';
}

async function remoteDriveStagePut(body, env) {
  const role = remoteDriveRole(body);
  const auth = await remoteRequireSession(body, env, role);
  if (!auth.ok) return auth.result;
  const data = String(body && body.data || '');
  if (!data || data.length > 8500000) {
    throw appError('REMOTE_DRIVE_STAGE_SIZE','Drive relay kosong atau terlalu besar (maks. sekitar 8.5 MB encoded).',413);
  }
  const result = await appsCall(env, 'remote-drive-stage-put', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100),
    fileName: String(body.fileName || 'tf-remote-relay.bin').slice(0,180),
    encoding: String(body.encoding || 'plain').slice(0,20),
    originalChars: Number(body.originalChars || 0),
    direction: String(body.direction || (role === 'DESKTOP' ? 'PC_TO_MOBILE' : 'MOBILE_TO_PC')).slice(0,32),
    sourceRole: role,
    data
  });
  return { ...result, code: result.code || 'REMOTE_DRIVE_STAGE_PUT', relayMode: result.relayMode || 'drive-v1' };
}

async function remoteDriveStageGet(body, env) {
  const role = remoteDriveRole(body);
  const auth = await remoteRequireSession(body, env, role);
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-drive-stage-get', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100),
    requesterRole: role
  });
  return { ...result, code: result.code || 'REMOTE_DRIVE_STAGE_GET', relayMode: result.relayMode || 'drive-v1' };
}

async function remoteDriveStageClear(body, env) {
  const role = remoteDriveRole(body);
  const auth = await remoteRequireSession(body, env, role);
  if (!auth.ok) return auth.result;
  const result = await appsCall(env, 'remote-drive-stage-clear', {
    ...remoteCredentials(auth.license, body),
    transferId: String(body.transferId || '').slice(0,100),
    requesterRole: role
  });
  return { ...result, code: result.code || 'REMOTE_DRIVE_STAGE_CLEAR', relayMode:'drive-v1' };
}



// REV279 — one strongly-coordinated real-time room per license. Hibernatable
// WebSockets keep Mobile <-> Desktop connected without a polling loop.
// Presence is socket/session based, not a short timer TTL: delayed browser
// timers can no longer flip ONLINE -> OFFLINE while the socket is still open.
export class TfRemoteFastRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // REV367: application-level ping/pong is answered by Cloudflare's
    // hibernation auto-response path, so a heartbeat does not wake this DO.
    try {
      if (this.state && typeof this.state.setWebSocketAutoResponse === 'function') {
        this.state.setWebSocketAutoResponse(new WebSocketRequestResponsePair('TF_PING', 'TF_PONG'));
      }
    } catch (_) {}
  }

  async fetch(request) {
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === '/availability' && request.headers.get('x-tf-internal') === 'remote-availability-v331') {
      const desktopSockets = this.socketsFor('DESKTOP');
      const liveDesktop = desktopSockets.filter(ws => this.attachment(ws).remoteEnabled === true);
      const desktopRemoteOnline = liveDesktop.length > 0;
      const desktopTransportOnline = desktopSockets.length > 0;
      const desktopExecutorOnline = liveDesktop.some(ws => this.attachment(ws).executorReady === true);
      const desktopRemoteDisabled = !desktopRemoteOnline && desktopSockets.some(ws => {
        const a=this.attachment(ws);return a.explicitRemoteState===true && a.remoteEnabled===false;
      });
      return new Response(JSON.stringify({
        ok:true,
        desktopRemoteOnline,
        desktopTransportOnline,
        desktopExecutorOnline,
        desktopRemoteDisabled,
        desktopSocketCount:desktopSockets.length,
        revision:'REV332',
        at:Date.now()
      }), {status:200,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'no-store'}});
    }
    if (String(request.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket', { status:426 });
    }
    const role = String(request.headers.get('x-tf-fast-role') || '').toUpperCase();
    const licenseId = String(request.headers.get('x-tf-fast-license') || '');
    const exp = Number(request.headers.get('x-tf-fast-exp') || 0);
    const licenseExpiresAt = Number(request.headers.get('x-tf-license-exp') || 0);
    if (!['MOBILE','DESKTOP'].includes(role) || !licenseId || !exp || Date.now() > exp || (licenseExpiresAt > 0 && Date.now() >= licenseExpiresAt)) {
      return new Response('Invalid Fast Lane ticket', { status:403 });
    }
    const instanceId = String(request.headers.get('x-tf-fast-instance') || '').slice(0,120);
    const existingMobiles = role === 'MOBILE' ? this.socketsFor('MOBILE') : [];
    const differentMobiles = role === 'MOBILE'
      ? existingMobiles.filter(ws => {
          const x=this.attachment(ws);
          const other=String(x.instanceId || '');
          return !instanceId || !other || other !== instanceId;
        })
      : [];
    const sameInstanceMobiles = role === 'MOBILE' && instanceId
      ? existingMobiles.filter(ws => String(this.attachment(ws).instanceId || '') === instanceId)
      : [];

    const pair = new WebSocketPair();
    const sockets = Object.values(pair);
    const client = sockets[0], server = sockets[1];
    server.serializeAttachment({
      role,
      licenseId,
      instanceId,
      licenseExpiresAt,
      mobileAuthorized: role !== 'MOBILE' || differentMobiles.length === 0,
      conflictPending: role === 'MOBILE' && differentMobiles.length > 0,
      connectedAt:Date.now(),
      mobileUiOpen:false,
      mobileUiAt:0,
      executorReady:false,
      executorAt:0,
      remoteEnabled:false,
      explicitRemoteState:false,
      remoteAt:0,
      sessionId:'',
      seq:0
    });
    this.state.acceptWebSocket(server);
    if (licenseExpiresAt > 0) await this.armLicenseExpiry(licenseExpiresAt);
    queueMicrotask(() => {
      // Reconnect from the SAME browser/app instance silently replaces stale
      // sockets. A genuinely different browser/device requires user consent.
      for (const old of sameInstanceMobiles) {
        try { this.safeSend(old,{type:'mobile_replaced',reason:'same-instance-reconnect',at:Date.now()}); old.close(4000,'same-instance-reconnect'); } catch (_) {}
      }
      if (differentMobiles.length > 0) {
        this.safeSend(server,{
          type:'mobile_conflict',
          otherCount:differentMobiles.length,
          message:'Token ini sedang aktif pada browser/ponsel lain. Konfirmasi jika ingin menggunakan perangkat ini dan memutus koneksi yang lama.',
          at:Date.now()
        });
      }
      this.broadcastPresence();
    });
    return new Response(null, { status:101, webSocket:client });
  }

  async armLicenseExpiry(expiryMs) {
    const exp = Number(expiryMs || 0);
    if (!Number.isFinite(exp) || exp <= 0) return;
    try {
      const current = await this.state.storage.getAlarm();
      if (current === null || !Number.isFinite(Number(current)) || exp < Number(current) - 250) {
        await this.state.storage.setAlarm(exp);
      }
    } catch (_) {}
  }

  async alarm() {
    const now = Date.now();
    let nextExpiry = 0;
    for (const ws of this.state.getWebSockets()) {
      const a = this.attachment(ws);
      const exp = Number(a.licenseExpiresAt || 0);
      if (!Number.isFinite(exp) || exp <= 0) continue;
      if (exp <= now + 250) {
        this.safeSend(ws, {
          type:'license_event',
          valid:false,
          code:'LICENSE_EXPIRED',
          message:'Masa berlaku lisensi telah berakhir.',
          expiresAt:new Date(exp).toISOString(),
          at:now
        });
        try { ws.close(4003, 'license-expired'); } catch (_) {}
      } else if (!nextExpiry || exp < nextExpiry) {
        nextExpiry = exp;
      }
    }
    try {
      if (nextExpiry) await this.state.storage.setAlarm(nextExpiry);
      else await this.state.storage.deleteAlarm();
    } catch (_) {}
  }

  attachment(ws) {
    try { return ws.deserializeAttachment() || {}; } catch (_) { return {}; }
  }

  socketsFor(role) {
    return this.state.getWebSockets().filter(ws => {
      const a = this.attachment(ws);
      return !role || a.role === role;
    });
  }

  safeSend(ws, value) {
    try {
      if (ws.readyState === WebSocket.OPEN) ws.send(typeof value === 'string' ? value : JSON.stringify(value));
    } catch (_) {}
  }

  broadcastTo(role, value, except=null) {
    for (const ws of this.socketsFor(role)) {
      if (ws === except) continue;
      const a=this.attachment(ws);
      if (role === 'MOBILE' && a.mobileAuthorized === false) continue;
      this.safeSend(ws, value);
    }
  }

  broadcastPresence() {
    const now = Date.now();
    const allMobileSockets = this.socketsFor('MOBILE');
    const mobileSockets = allMobileSockets.filter(ws => this.attachment(ws).mobileAuthorized !== false);
    const desktopSockets = this.socketsFor('DESKTOP');
    const mobileOnline = mobileSockets.length > 0;
    const desktopTransportOnline = desktopSockets.length > 0;
    // Sticky session state: an open socket remains online until the client
    // explicitly disables/closes it. Timestamp fields are diagnostic only.
    const mobileRemoteOnline = mobileSockets.some(ws => this.attachment(ws).mobileUiOpen === true);
    const liveDesktop = desktopSockets.filter(ws => this.attachment(ws).remoteEnabled === true);
    const desktopRemoteOnline = liveDesktop.length > 0;
    const desktopExecutorOnline = liveDesktop.some(ws => this.attachment(ws).executorReady === true);
    let desktopSessionId='', desktopSeq=0, desktopRemoteDisabled=false;
    for(const ws of desktopSockets){const a=this.attachment(ws);const seq=Number(a.seq||0);if(seq>=desktopSeq&&String(a.sessionId||'')){desktopSeq=seq;desktopSessionId=String(a.sessionId||'');}}
    // An old/parallel socket must never override another enabled desktop.
    desktopRemoteDisabled = !desktopRemoteOnline && desktopSockets.some(ws => {
      const a=this.attachment(ws);return a.explicitRemoteState===true && a.remoteEnabled===false;
    });
    const msg = { type:'presence', mobileOnline, mobileRemoteOnline, mobileConnectionCount:mobileSockets.length, mobilePendingCount:Math.max(0,allMobileSockets.length-mobileSockets.length), desktopOnline:desktopRemoteOnline, desktopTransportOnline, desktopRemoteOnline, desktopRemoteDisabled, desktopExecutorOnline, desktopSessionId, desktopSeq, transport:'websocket', protocol:'REV367-LOW-USAGE-EXACT-EXPIRY', at:now };
    for (const ws of this.state.getWebSockets()) this.safeSend(ws, msg);
  }

  webSocketMessage(ws, message) {
    const a = this.attachment(ws);
    let data;
    try {
      const text = typeof message === 'string' ? message : new TextDecoder().decode(message);
      if (text === 'TF_PING') { this.safeSend(ws, 'TF_PONG'); return; }
      if (text.length > 256000) throw new Error('message too large');
      data = JSON.parse(text);
    } catch (_) {
      this.safeSend(ws, { type:'fast_error', code:'BAD_MESSAGE', message:'Pesan Fast Lane tidak valid.' });
      return;
    }
    const type = String(data && data.type || '');

    // REV330: only one DIFFERENT Mobile/browser instance may control the same
    // token at a time. A second device is connected in pending mode until the
    // user confirms takeover. There is no permanent device limit.
    if (a.role === 'MOBILE' && type === 'mobile_takeover') {
      const currentInstance=String(a.instanceId || '');
      for (const other of this.socketsFor('MOBILE')) {
        if (other === ws) continue;
        const x=this.attachment(other);
        const otherInstance=String(x.instanceId || '');
        if (!currentInstance || !otherInstance || otherInstance !== currentInstance) {
          this.safeSend(other,{type:'mobile_replaced',reason:'confirmed-takeover',at:Date.now()});
          try { other.close(4001,'mobile-takeover'); } catch (_) {}
        }
      }
      const next={...a,mobileAuthorized:true,conflictPending:false};
      try{ws.serializeAttachment(next);}catch(_){}
      this.safeSend(ws,{type:'mobile_conflict_resolved',authorized:true,at:Date.now()});
      this.broadcastPresence();
      return;
    }
    if (a.role === 'MOBILE' && type === 'mobile_conflict_cancel') {
      this.safeSend(ws,{type:'mobile_conflict_resolved',authorized:false,at:Date.now()});
      try { ws.close(4002,'mobile-conflict-cancelled'); } catch (_) {}
      this.broadcastPresence();
      return;
    }

    if (a.role === 'MOBILE' && a.mobileAuthorized === false) {
      // Pending sockets may only answer the conflict prompt / basic ping.
      if (type !== 'ping') {
        this.safeSend(ws,{type:'fast_error',code:'MOBILE_CONFLICT_CONFIRM_REQUIRED',message:'Konfirmasi koneksi ganda terlebih dahulu.'});
        return;
      }
    }

    // REV267 heartbeat: keep the Fast Lane warm through NAT/proxy idle periods.
    // Reply on the same socket; clients may ignore the pong if they only need
    // the keep-alive effect.
    if (type === 'ping') {
      if (a.role === 'DESKTOP') {
        const now=Date.now();
        const hasRemoteState=Object.prototype.hasOwnProperty.call(data,'remoteEnabled');
        const hasExecutorState=Object.prototype.hasOwnProperty.call(data,'executorReady');
        const enabled=hasRemoteState?data.remoteEnabled===true:a.remoteEnabled===true;
        const next={...a,remoteEnabled:enabled,explicitRemoteState:hasRemoteState?true:a.explicitRemoteState===true,remoteAt:enabled?now:Number(a.remoteAt||0),sessionId:String(data.sessionId||a.sessionId||'').slice(0,100),seq:Math.max(Number(a.seq||0),Number(data.seq||0))};
        if(hasExecutorState){next.executorReady=data.executorReady===true;next.executorAt=next.executorReady?now:0;}
        try{ws.serializeAttachment(next);}catch(_){}
        this.safeSend(ws, { type:'pong', role:a.role, echoAt:Number(data.at || 0), seq:Number(data.seq||0), at:now });
        this.broadcastPresence();
        return;
      }
      this.safeSend(ws, { type:'pong', role:a.role, echoAt:Number(data.at || 0), at:Date.now() });
      return;
    }
    // REV275: transport presence and actual Remote/sidebar readiness are different.
    // Mobile keeps a pre-warmed socket even outside the Remote page, so it sends
    // explicit UI presence. Desktop advertises a fresh sidebar executor heartbeat.
    if (a.role === 'MOBILE' && type === 'mobile_ui_presence') {
      const next={...a,mobileUiOpen:data.open===true,mobileUiAt:Date.now()};
      try{ws.serializeAttachment(next);}catch(_){}
      this.broadcastPresence();
      return;
    }
    if (a.role === 'DESKTOP' && type === 'desktop_executor_presence') {
      const now=Date.now(),enabled=data.remoteEnabled!==false;
      const next={...a,remoteEnabled:enabled,explicitRemoteState:true,remoteAt:enabled?now:0,executorReady:data.ready===true,executorAt:data.ready===true?now:0,sessionId:String(data.sessionId||a.sessionId||'').slice(0,100),seq:Math.max(Number(a.seq||0),Number(data.seq||0))};
      try{ws.serializeAttachment(next);}catch(_){}
      this.broadcastPresence();
      return;
    }
    if (a.role === 'DESKTOP' && type === 'desktop_remote_presence') {
      const now=Date.now(),enabled=data.remoteEnabled===true;
      const next={...a,remoteEnabled:enabled,explicitRemoteState:true,remoteAt:enabled?now:0,executorReady:enabled&&data.executorReady===true,executorAt:enabled&&data.executorReady===true?now:0,sessionId:String(data.sessionId||a.sessionId||'').slice(0,100),seq:Math.max(Number(a.seq||0),Number(data.seq||0))};
      try{ws.serializeAttachment(next);}catch(_){}
      this.broadcastPresence();
      return;
    }
    // REV269: WebSocket is also the signaling plane for a direct WebRTC
    // RTCDataChannel. Once ICE succeeds, Remote commands and state travel
    // peer-to-peer and bypass the Worker entirely.
    if (type === 'rtc_signal') {
      const targetRole = a.role === 'MOBILE' ? 'DESKTOP' : 'MOBILE';
      const signal = data && data.signal && typeof data.signal === 'object' ? data.signal : {};
      this.broadcastTo(targetRole, { type:'rtc_signal', fromRole:a.role, signal, at:Date.now() });
      return;
    }
    if (a.role === 'MOBILE' && type === 'command') {
      const clientCommandId = String(data.clientCommandId || '').slice(0,100);
      const now=Date.now();
      const desktopSockets = this.socketsFor('DESKTOP').filter(s=>this.attachment(s).remoteEnabled===true).sort((a,b)=>Number(this.attachment(b).connectedAt||0)-Number(this.attachment(a).connectedAt||0));
      const targets = desktopSockets.length ? [desktopSockets[0]] : [];
      this.safeSend(ws, { type:'fast_accept', clientCommandId, delivered:targets.length > 0, desktopCount:desktopSockets.length, at:Date.now() });
      if (!targets.length) return;
      const envelope = {
        type:'command',
        clientCommandId,
        action:String(data.action || '').slice(0,80),
        payload:data.payload && typeof data.payload === 'object' ? data.payload : {},
        sentAt:Number(data.sentAt || Date.now())
      };
      for (const target of targets) this.safeSend(target, envelope);
      return;
    }
    if (a.role === 'DESKTOP' && type === 'command_started') {
      this.broadcastTo('MOBILE', {
        type:'command_started',
        clientCommandId:String(data.clientCommandId || '').slice(0,100),
        action:String(data.action || '').slice(0,80),
        startedAt:Number(data.startedAt || Date.now())
      });
      return;
    }
    if (a.role === 'DESKTOP' && type === 'state_event') {
      this.broadcastTo('MOBILE', {
        type:'state_event',
        event:String(data.event || '').slice(0,80),
        payload:data.payload && typeof data.payload === 'object' ? data.payload : {},
        at:Number(data.at || Date.now())
      });
      return;
    }
    if (a.role === 'DESKTOP' && type === 'command_result') {
      this.broadcastTo('MOBILE', {
        type:'command_result',
        clientCommandId:String(data.clientCommandId || '').slice(0,100),
        result:data.result && typeof data.result === 'object' ? data.result : {ok:false,message:'Fast Lane result kosong.'},
        finishedAt:Number(data.finishedAt || Date.now())
      });
      return;
    }
    if (a.role === 'DESKTOP' && type === 'desktop_snapshot') {
      this.broadcastTo('MOBILE', {
        type:'desktop_snapshot',
        snapshot:data.snapshot && typeof data.snapshot === 'object' ? data.snapshot : {},
        extensionVersion:String(data.extensionVersion || '').slice(0,80),
        at:Number(data.at || Date.now())
      });
      return;
    }
    if (a.role === 'MOBILE' && type === 'snapshot_request') {
      for(const target of this.socketsFor('DESKTOP')){const x=this.attachment(target);if(x.remoteEnabled===true)this.safeSend(target,{ type:'snapshot_request', at:Date.now() });}
      return;
    }
  }

  webSocketClose(ws, code, reason) {
    try { ws.close(code, reason); } catch (_) {}
    queueMicrotask(() => this.broadcastPresence());
  }

  webSocketError(ws) {
    try { ws.close(1011, 'Fast Lane socket error'); } catch (_) {}
    queueMicrotask(() => this.broadcastPresence());
  }
}
