document.body.innerHTML = "\n  <!-- Scan Animation Overlay (shown before dashboard content while scan is running) -->\n  <div id=\"tf-dashboard-scan-overlay\">\n    <div id=\"tf-dashboard-scan-card\">\n      <div class=\"tf-scan-head\">\n        <div>\n          <div class=\"tf-scan-title\">Scanning sedang berjalan...</div>\n          <div class=\"tf-scan-sub\">Progress di sini sinkron dengan Status Scan Channel (sidebar extension).</div>\n        </div>\n        <button id=\"tf-dashboard-scan-skip\" class=\"tf-scan-btn\" type=\"button\" disabled>Lihat Dashboard</button>\n      </div>\n\n      <div class=\"tf-scan-bar\"><div id=\"tf-dashboard-scan-bar-fill\"></div></div>\n\n      <div class=\"tf-scan-lists\">\n        <div>\n          <div class=\"tf-scan-section-title\">Overall</div>\n          <div class=\"tf-scan-list\" id=\"tf-dashboard-scan-overall\"></div>\n        </div>\n        <div>\n          <div class=\"tf-scan-section-title\">Batch scanning done!/progress...</div>\n          <div class=\"tf-scan-list\" id=\"tf-dashboard-scan-detail\"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"page\" id=\"tf-dashboard-main\">\n    <header class=\"dashboard-header\">\n      <div class=\"profile-row\">\n        <img\n          id=\"dashboard-user-avatar\"\n          class=\"dashboard-avatar\"\n          src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\"\n          alt=\"User avatar\"\n        />\n        <div class=\"profile-main\">\n          <div id=\"dashboard-user-name\" class=\"profile-name\">User belum login</div>\n          <div class=\"profile-status\">\n            <span class=\"status-dot\"></span>\n            <span id=\"dashboard-user-status-text\">Offline</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"title-block\">\n        <h1>TF Multi-Analyst Dashboard</h1>\n        <p class=\"sub-heading\">\n          Data di halaman ini di-load dari hasil scan extension Chrome\n          (<span class=\"mono\">tfMonthlyStats</span> &amp; <span class=\"mono\">tfHistorySignals</span>)\n          dan bisa kamu kombinasikan dengan pengaturan Balance &amp; Risk untuk menghitung Lot &amp; hasil $$.\n        </p>\n      </div>\n    </header>\n\n\n    <!-- ==================== Top Navigator Menu ==================== -->\n    <div class=\"tf-top-nav-wrap\" id=\"tf-top-nav-wrap\">\n      <nav class=\"tf-top-nav\" aria-label=\"Navigator\">\n        <ul>\n          <li class=\"active\">\n            <a class=\"tf-nav-link\" href=\"dashboard.html\" data-tf-url=\"dashboard.html\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-black.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>Beranda</span>\n              </div>\n            </a>\n          </li>\n\n          <li class=\"tf-nav-divider\" aria-hidden=\"true\"></li>\n\n          <li class=\"tf-dropdown\">\n            <a class=\"tf-nav-link\" href=\"#\" data-tf-parent=\"1\" data-tf-url=\"#\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>iSignal <span class=\"tf-caret\">\u25be</span></span>\n              </div>\n            </a>\n            <ul class=\"tf-submenu\" aria-label=\"iSignal submenu\">\n              <li><a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/channels/isignal/\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n              <li><a class=\"tf-nav-link\" href=\"iSignalUsers.html\" data-tf-url=\"iSignalUsers.html\">iSignal Users</a></li>\n            </ul>\n          </li>\n\n          <li class=\"tf-nav-divider\" aria-hidden=\"true\"></li>\n\n          <li class=\"tf-dropdown\">\n            <a class=\"tf-nav-link\" href=\"#\" data-tf-parent=\"1\" data-tf-url=\"#\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>TF Copy Signal <span class=\"tf-caret\">\u25be</span></span>\n              </div>\n            </a>\n            <ul class=\"tf-submenu\" aria-label=\"TF Copy Signal submenu\">\n              <li>\n                <a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/channels/\" data-tf-url=\"https://account.tradersfamily.id/channels/\">\n                  <div class=\"tf-nav-icon\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                    <span>Beranda</span>\n                  </div>\n                </a>\n              </li>\n              <li>\n                <a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/channels/browse/?v=symbol\" data-tf-url=\"https://account.tradersfamily.id/channels/browse/?v=symbol\">\n                  <div class=\"tf-nav-icon\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/search-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                    <span>Browse Channel</span>\n                  </div>\n                </a>\n              </li>\n              <li>\n                <a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/channels/my/\" data-tf-url=\"https://account.tradersfamily.id/channels/my/\">\n                  <div class=\"tf-nav-icon\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                    <img src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                    <span>My Channels</span>\n                  </div>\n                </a>\n              </li>\n            </ul>\n          </li>\n\n          <li class=\"tf-nav-divider\" aria-hidden=\"true\"></li>\n\n          <li>\n            <a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\" data-tf-url=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/user-black.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/user-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/user-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>Profile</span>\n              </div>\n            </a>\n          </li>\n        </ul>\n      </nav>\n    </div>\n    <!-- ==================== End Top Navigator Menu ==================== -->\n\n\n    \n    <section class=\"card\" id=\"section-isignal-analysts\">\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2>Analis di iSignal</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span>Status iSignal</span>\n          </div>\n        </div>\n        <div class=\"section-note\">\n          Nama analis &amp; status diambil dari hasil scan halaman <span class=\"mono\">/channels/isignal/</span> (auto <span class=\"mono\">Load More</span>), menampilkan semua analis: <span class=\"mono\">Aktif</span>, <span class=\"mono\">Belum diaktifkan</span>, dan <span class=\"mono\">Tidak Aktif</span>.\n        </div>\n      </div>\n\n      <div id=\"tf-isignal-analysts-loader\" class=\"tf-users-loader\" style=\"display:none;\">\n        <span class=\"mini-spinner\" aria-hidden=\"true\"></span>\n        <span class=\"tf-users-loader-text\">Scanning iSignal status...</span>\n      </div>\n\n      <div id=\"tf-isignal-analysts-error\" class=\"tf-users-error\" style=\"display:none;\"></div>\n\n      <div class=\"tf-isignal-analyst-grid tf-isignal-analyst-grid-2col\">\n        <table class=\"tf-isignal-analyst-table\" id=\"tf-isignal-analyst-table-1\">\n          <thead>\n            <tr>\n              <th>Nama Analis</th>\n              <th style=\"text-align:left;\">Status</th>\n              <th style=\"text-align:left;\">Subscription end on</th>\n            </tr>\n          </thead>\n          <tbody id=\"tf-isignal-analyst-tbody-1\"></tbody>\n        </table>\n\n        <table class=\"tf-isignal-analyst-table\" id=\"tf-isignal-analyst-table-2\">\n          <thead>\n            <tr>\n              <th>Nama Analis</th>\n              <th style=\"text-align:left;\">Status</th>\n              <th style=\"text-align:left;\">Subscription end on</th>\n            </tr>\n          </thead>\n          <tbody id=\"tf-isignal-analyst-tbody-2\"></tbody>\n        </table>\n      </div>\n    </section>\n\n    <section class=\"card\" id=\"section-summary\">\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2>Table Users and Management</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span>iSignal Broker Accounts</span>\n          </div>\n        </div>\n        <div class=\"section-note\">\n          Data <span class=\"mono\">Metatrader ID</span> diambil otomatis dari halaman Settings &gt; Broker (Platform ID).\n        </div>\n      </div>\n\n      <div id=\"tf-users-mgmt-important-note\" style=\"margin:0 0 10.8px;padding:9px 10.8px;border:1px solid rgba(239,68,68,.72);border-radius:8.1px;background:rgba(127,29,29,.28);color:#fecaca;font-size:10.8px;font-weight:800;line-height:1.5;\">\n        Fitur ini hanya akan aktif jika User sudah mengatur Lot Size di iSignal sebelumnya! Jika belum, silakan connect ke iSignal terlebih dahulu dan mengatur Lot Size secara manual terlebih dahulu!\n      </div>\n\n      <div id=\"tf-users-mgmt-loader\" class=\"tf-users-loader\" style=\"display:none;\">\n        <span class=\"mini-spinner\" aria-hidden=\"true\"></span>\n        <span class=\"tf-users-loader-text\">Getting Users Data...</span>\n      </div>\n\n      <div id=\"tf-users-mgmt-error\" class=\"tf-users-error\" style=\"display:none;\"></div>\n\n      <div class=\"table-wrapper\">\n        <div class=\"table-scroll users-mgmt-noscroll\">\n          <table id=\"tf-users-mgmt-table\">\n            <thead>\n              <tr>\n                <th style=\"width: 8%;\">Action</th>\n                <th style=\"width: 18%;\">Metatrader ID</th>\n                <th style=\"width: 20%;\">Password</th>\n                <th style=\"width: 16%;\">Balance</th>\n                <th style=\"width: 16%;\">Risk %/Trade</th>\n                <th style=\"width: 10%;\">Detail</th>\n              </tr>\n            </thead>\n            <tbody></tbody>\n          </table>\n        </div>\n      </div>\n\n      <p class=\"small-muted\" style=\"margin-top: 9px;\">\n        Catatan: kolom <span class=\"mono\">Set</span> masih kosong (belum ada fungsi). Kolom <span class=\"mono\">Detail</span> bisa di-expand untuk melihat daftar analis.\n      </p>\n    </section>\n\n    <section class=\"card\" id=\"section-set-progress\">\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2>Progress \u2013 Set Lot &amp; Simbol</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span>Automation Log</span>\n          </div>\n        </div>\n        <div class=\"section-note\">\n          Progress muncul di sini ketika kamu klik hyperlink <span class=\"mono\">Set</span> (main row atau detail row). Tidak ada overlay.\n        </div>\n      </div>\n\n      <div id=\"tf-iset-progress-wrap\">\n        <div id=\"tf-iset-progress-head\">\n          <div id=\"tf-iset-progress-status\">Idle.</div>\n          <div id=\"tf-iset-progress-actions\">\n            <button class=\"btn btn-ghost\" type=\"button\" id=\"tf-iset-progress-clear\">Clear</button>\n          </div>\n        </div>\n\n        <div id=\"tf-iset-progress-scroll\">\n          <table id=\"tf-iset-progress-table\">\n            <thead>\n              <tr>\n                <th style=\"text-align:left;\">Time</th>\n                <th style=\"text-align:left;\">Log</th>\n              </tr>\n            </thead>\n            <tbody id=\"tf-iset-progress-tbody\"></tbody>\n          </table>\n        </div>\n      </div>\n    </section>\n\n<section class=\"card\" id=\"section-monthly\">\n\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2>Table 2 \u2013 Statistics \u2013 Rekap Pips &amp; Signals per Bulan</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span>Per Month Overview</span>\n          </div>\n        </div>\n        <div class=\"section-note\">\n          Nilai di bawah bisa otomatis terisi dari hasil scan, dan juga bisa kamu edit manual.\n        </div>\n      </div>\n\n      <div class=\"chip-row\" style=\"margin-bottom: 5.4px;\">\n        <span class=\"chip\">Format isi tiap sel bulan: baris 1 = <span class=\"mono\">Pips</span>, baris 2 = <span class=\"mono\">Signals</span>, baris 3 = <span class=\"mono\">$ (pips \u00d7 lot \u00d7 $/pips)</span>.</span>\n        <span class=\"chip\">Lot diambil dari Table 1 (Balance &amp; Risk yang aktif).</span>\n      </div>\n\n      <!-- Risk Mode (for Table 2 monthly $ calculation) -->\n      <div class=\"controls-row\" style=\"margin-bottom: 9px; align-items: center;\">\n        <div class=\"equity-filter-row\" style=\"margin-top: 0;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"risk-mode-select-monthly\" style=\"min-width: 64.8px;\">Risk Mode:</label>\n            <select id=\"risk-mode-select-monthly\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\">\n              <option value=\"fixed\" selected=\"\">Fixed Lot</option>\n              <option value=\"compound\">Compound %</option>\n            </select>\n          </div>\n        </div>\n        <div class=\"equity-filter-row\" id=\"compound-sub-row-monthly\" style=\"margin-top: 0; display: none;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"compound-months-select-monthly\" style=\"min-width: 99px;\">Compound (%):</label>\n            <select id=\"compound-months-select-monthly\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\"></select>\n          </div>\n        </div>\n      </div>\n\n      \n      <!-- Time Range buttons (sync with Equity Curve & Table 3) -->\n      <div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 7.2px;\">\n        <div class=\"tf-time-range-row\" id=\"tf-time-range-row-monthly\">\n          <span class=\"tf-time-range-label\">Time Range:</span>\n          <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-monthly\"></div>\n        </div>\n      </div>\n\n      <div class=\"controls-row\" id=\"analyst-filter-row-monthly\" style=\"margin-bottom: 9px; justify-content: flex-start; gap: 9px;\">\n        <label style=\"font-size: 10.8px; margin-right: 7.2px;\">Filter:</label>\n        <div id=\"analyst-filter-container-monthly\"></div>\n      </div>\n\n      <div class=\"table-wrapper\">\n        <div class=\"table-scroll monthly-table-scroll\">\n          <table id=\"monthly-table\" class=\"monthly-table\">\n            <thead>\n              <tr>\n                <th class=\"monthly-sticky-col-1\">ACTION</th>\n                <th class=\"monthly-sticky-col-2\">NAMA ANALIS</th>\n                <th class=\"monthly-sticky-col-3\">PAIR</th>\n              </tr>\n            </thead>\n            <tbody id=\"monthly-body\"></tbody>\n          </table>\n        </div>\n      </div>\n\n      <div id=\"income-minmax-range-note\" class=\"section-note\" style=\"margin-top: 5.4px;\">\n        <div id=\"income-minmax-range-text\">min-max income from January 2024 s.d -</div>\n      </div>\n\n      <div class=\"chip-row tf-income-chip-row\" style=\"margin-top: 5.4px;\">\n        <span class=\"chip\"><strong>Income Minimum:</strong> <span id=\"income-min\" class=\"mono\">-</span></span>\n        <span class=\"chip\"><strong>Income Maksimum:</strong> <span id=\"income-max\" class=\"mono\">-</span></span>\n      </div>\n\n    </section>\n\n    <section class=\"card\" id=\"equity-curve-section\">\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2 id=\"equity-curve-title\">Equity Curve \u2013 Akumulasi Pips per Trade</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span id=\"equity-curve-badge-text\">Hover untuk detail $ dan Equity</span>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"section-note\">\n        Grafik ini menggunakan urutan Table 3 (History Signal) + pengaturan <span class=\"mono\">Balance</span> dan\n        <span class=\"mono\">Risk % / Trade</span> saat ini. Geser cursor di garis untuk melihat\n        <span class=\"mono\">Tanggal</span>, <span class=\"mono\">Nama Analis</span>,\n        <span class=\"mono\">$TP / $SL</span>, dan <span class=\"mono\">Equity</span>.\n      </div>\n\n      <div class=\"equity-filter-row\">\n        <div class=\"equity-date-group\">\n          <label for=\"equity-start-date\">Filter tanggal:</label>\n          <input type=\"date\" id=\"equity-start-date\" />\n          <span class=\"equity-date-separator\">sampai</span>\n          <input type=\"date\" id=\"equity-end-date\" />\n          <button class=\"btn btn-ghost\" id=\"equity-apply-filter-btn\" type=\"button\">Apply</button>\n          <button class=\"btn btn-ghost\" id=\"equity-reset-filter-btn\" type=\"button\">Reset</button>\n        </div>\n        <p class=\"small-muted\" style=\"margin: 1.8px 0 0;\">\n          Default: mengikuti tanggal terkecil &amp; terbesar dari data history yang tersedia.\n        </p>\n      </div>\n\n            <!-- Equity curve metric selector + Withdraw controls (sync with Table 1) -->\n      <div class=\"controls-row\" id=\"equity-metric-withdraw-row\" style=\"margin-top: 0; margin-bottom: 9px; align-items: center;\">\n        <div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 0;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"equity-metric-select\" style=\"min-width: 64.8px;\">Filter by:</label>\n            <select id=\"equity-metric-select\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\">\n              <option value=\"pips\">PnL Pips</option>\n              <option value=\"usd\" selected>PnL ($)</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"controls-row\" id=\"withdraw-controls-row-equity\" style=\"margin: 0; gap: 10.8px; align-items: center;\">\n        <div class=\"form-group\" style=\"min-width: 288px;\">\n          <div class=\"equity-date-group tf-withdraw-inline-row\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"withdraw-amount-input-equity\" style=\"min-width: 99px;\">Withdraw ($):</label>\n            <div class=\"tf-withdraw-inline\" style=\"gap: 9px;\">\n              <span class=\"tf-switch\" title=\"Enable Withdraw\">\n                <input id=\"withdraw-enabled-toggle-equity\" type=\"checkbox\" />\n              </span>\n              <input id=\"withdraw-amount-input-equity\" type=\"number\" step=\"1\" min=\"0\" class=\"form-input tf-withdraw-input-equity\" placeholder=\"average : -\" />\n            </div>\n          </div>\n          <div id=\"withdraw-max-warning-equity\" class=\"tf-withdraw-max-warning\" style=\"display:none;\"></div>\n        </div>\n\n        <div class=\"form-group\" style=\"min-width: 153px;\">\n          <select id=\"withdraw-months-select-equity\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\">\n            <option value=\"1\" selected>1 month</option>\n            <option value=\"2\">2 month</option>\n            <option value=\"3\">3 month</option>\n            <option value=\"4\">4 month</option>\n            <option value=\"5\">5 month</option>\n            <option value=\"6\">6 month</option>\n            <option value=\"7\">7 month</option>\n            <option value=\"8\">8 month</option>\n            <option value=\"9\">9 month</option>\n            <option value=\"10\">10 month</option>\n            <option value=\"11\">11 month</option>\n            <option value=\"12\">12 month</option>\n          </select>\n        </div>\n\n        <div class=\"form-group\" style=\"min-width: 162px;\">\n          <button class=\"btn\" id=\"withdraw-submit-btn-equity\" type=\"button\">\n            <span class=\"btn-icon\">$</span>\n            Apply Withdraw\n          </button>\n        </div>\n      </div>\n      </div>\n\n<div class=\"controls-row\" style=\"margin-bottom: 9px; align-items: center;\">\n        <div class=\"equity-filter-row\" style=\"margin-top: 0;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"risk-mode-select\" style=\"min-width: 64.8px;\">Risk Mode:</label>\n            <select id=\"risk-mode-select\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\">\n              <option value=\"fixed\" selected=\"\">Fixed Lot</option>\n              <option value=\"compound\">Compound %</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"equity-filter-row\" id=\"compound-sub-row-equity\" style=\"margin-top: 0; display: none;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <select id=\"compound-months-select-equity\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\"></select>\n          </div>\n        </div>\n      </div>\n\n      <!-- Time Range buttons (sync with Table 3) -->\n      <div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 7.2px;\">\n        <div class=\"tf-time-range-row\" id=\"tf-time-range-row-equity\">\n          <span class=\"tf-time-range-label\">Time Range:</span>\n          <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-equity\"></div>\n        </div>\n      </div>\n\n<div class=\"controls-row\" id=\"analyst-filter-row-equity\" style=\"margin-bottom: 9px; justify-content: flex-start; gap: 9px;\">\n        <label style=\"font-size: 10.8px; margin-right: 7.2px;\">Filter:</label>\n        <div id=\"analyst-filter-container-equity\"></div>\n      </div>\n      <div class=\"equity-curve-wrapper\">\n        <canvas id=\"equity-curve-canvas\"></canvas>\n        <div id=\"equity-empty-note\">\n          Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.\n        </div>\n        <div id=\"equity-tooltip\" class=\"equity-tooltip\" style=\"display: none;\"></div>\n      </div>\n\n      <div id=\"equity-drawdown-summary\" class=\"equity-drawdown-summary\">\n        <div class=\"equity-drawdown-summary-title\">\n          Ringkasan Risiko — Consecutive Loss &amp; Maximum Equity Drawdown\n        </div>\n        <div id=\"equity-drawdown-detail\">\n          Belum ada data drawdown. Tambahkan history di Table 3 atau lakukan Scan terlebih dahulu.\n        </div>\n      </div>\n    </section>\n\n    \n    <section class=\"card\" id=\"section-history\">\n      <div class=\"card-header\">\n        <div class=\"card-title-group\">\n          <h2>Table 3 \u2013 History Signal \u2013 Perhitungan Hasil per Trade</h2>\n          <div class=\"card-badge\">\n            <span class=\"card-badge-dot\"></span>\n            <span>Sorted by Closed Date</span>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"chip-row\">\n        <span class=\"chip\">Pips &amp; $ TP ditampilkan <span class=\"tp\">hijau</span>, Pips &amp; $ SL ditampilkan <span class=\"sl\">merah</span>.</span>\n        <span class=\"chip\">Lot &amp; $$ akan mengikuti Balance &amp; Risk dari Table 1.</span>\n      </div>\n\n      <div class=\"controls-row\" style=\"margin-bottom: 5.4px;\">\n\n        <div class=\"equity-filter-row\" style=\"margin-top: 5.4px;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"risk-mode-select-history\" style=\"min-width: 64.8px;\">Risk Mode:</label>\n            <select id=\"risk-mode-select-history\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\">\n              <option value=\"fixed\" selected=\"\">Fixed Lot</option>\n              <option value=\"compound\">Compound %</option>\n            </select>\n          </div>\n        </div>\n\n        <div class=\"equity-filter-row\" id=\"compound-sub-row-history\" style=\"margin-top: 0; display: none;\">\n          <div class=\"equity-date-group\" style=\"align-items: center; gap: 7.2px;\">\n            <label for=\"compound-months-select-history\" style=\"min-width: 99px;\">Compound (%):</label>\n            <select id=\"compound-months-select-history\" class=\"form-input\" style=\"width: 153px; padding: 5.4px 9px;\"></select>\n          </div>\n        </div>\n\n        <span class=\"small-muted\">\n          Catatan: urutan akan otomatis dari tanggal paling lama ke paling baru.\n        </span>\n      </div>\n\n      <div class=\"controls-row\" style=\"margin-bottom: 9px;\">\n        <button class=\"btn btn-ghost\" id=\"export-history-pdf-btn\" type=\"button\">\n          Export Table 3 ke PDF\n        </button>\n      </div>\n\n      <!-- Time Range buttons (sync with Equity Curve) -->\n      <div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 7.2px;\">\n        <div class=\"tf-time-range-row\" id=\"tf-time-range-row-history\">\n          <span class=\"tf-time-range-label\">Time Range:</span>\n          <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-history\"></div>\n        </div>\n      </div>\n\n      <div class=\"controls-row\" id=\"analyst-filter-row-history\" style=\"margin-bottom: 9px; justify-content: flex-start; gap: 9px;\">\n        <label style=\"font-size: 10.8px; margin-right: 7.2px;\">Filter:</label>\n        <div id=\"analyst-filter-container-history\"></div>\n      </div>\n\n      <div class=\"table-wrapper\">\n        <div class=\"table-scroll\">\n          <table id=\"history-table\">\n            <thead>\n              <tr>\n                <th style=\"width: 18%;\">Tanggal (Created At)</th>\n                <th style=\"width: 18%;\">Tanggal (Closed At)</th>\n                <th style=\"width: 16%;\">Nama Analis</th>\n                <th style=\"width: 14%;\" class=\"text-right\" id=\"history-balance-base-th\">Balance</th>\n                <th style=\"width: 10%;\">Pair</th>\n                <th style=\"width: 9%;\" class=\"text-right\">Lot Size</th>\n                <th style=\"width: 10%;\" class=\"text-right\">PnL (pips)</th>\n                <th style=\"width: 10%;\" class=\"text-right\">PnL ($)</th>\n                <th style=\"width: 8%;\" class=\"text-right\">PnL %</th>\n                <th style=\"width: 13%;\" class=\"text-right\">Balance PnL ($)</th>\n              </tr>\n            </thead>\n            <tbody></tbody>\n          </table>\n        </div>\n      </div>\n\n      <div id=\"drawdown-summary\" style=\"margin-top: 12.6px;\">\n        <h3 style=\"font-size: 11.7px; margin-bottom: 3.6px;\">Drawdown &amp; Consecutive Stats</h3>\n        <p class=\"small-muted\">\n          Dihitung otomatis dari urutan history signal (semua analis), menggunakan lot &amp; $/pips yang sama seperti Table 3.\n        </p>\n        <div class=\"chip-row\" id=\"drawdown-overall-chips\" style=\"margin-top: 5.4px; margin-bottom: 5.4px;\"></div>\n        <div class=\"table-wrapper\">\n          <div class=\"table-scroll drawdown-noscroll\">\n            <table id=\"drawdown-table\">\n              <thead>\n\n                <tr>\n                  <th style=\"width: 4%;\"></th>\n                  <th style=\"width: 16%;\">Nama Analis</th>\n                  <th style=\"width: 12%;\">Max Consec Profit (trades)</th>\n                  <th style=\"width: 8%;\">Count</th>\n                  <th style=\"width: 10%;\">Pips</th>\n                  <th style=\"width: 12%;\">$ Profit <span class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\" aria-hidden=\"true\"></span></th>\n                  <th style=\"width: 12%;\">Max Consec Loss (trades)</th>\n                  <th style=\"width: 8%;\">Count</th>\n                  <th style=\"width: 10%;\">Drawdown Pips</th>\n                  <th style=\"width: 12%;\">Drawdown $ <span class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\" aria-hidden=\"true\"></span></th>\n                </tr>\n              </thead>\n              <tbody></tbody>\n            </table>\n          </div>\n        </div>\n\n        <div style=\"margin-top: 10.8px;\">\n          <h3 style=\"font-size: 11.7px; margin-bottom: 3.6px;\">Consecutive Profit &amp; Loss \u2013 Total Semua Analis</h3>\n          <p class=\"small-muted\" style=\"margin-bottom: 5.4px;\">\n            Tabel ini merangkum streak profit &amp; loss terpanjang secara <strong>gabungan</strong> dari semua analis.\n          </p>\n          <div class=\"table-wrapper\">\n            <div class=\"table-scroll\">\n              <table id=\"drawdown-total-table\">\n                <thead>\n                  <tr>\n                    <th style=\"width: 22%;\">Tipe</th>\n                    <th style=\"width: 18%;\" class=\"text-right\">Trades</th>\n                    <th style=\"width: 18%;\" class=\"text-right\">Pips</th>\n                    <th style=\"width: 18%;\" class=\"text-right\">$ <span class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\" aria-hidden=\"true\"></span></th>\n                  </tr>\n                </thead>\n                <tbody></tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n<footer style=\"margin-top: 16.2px; font-size: 9px; color: #6b7280;\">\n      <p>\n        Catatan: Dashboard ini berjalan sebagai halaman extension. Jika kamu membuka file ini langsung di browser\n        (di luar extension), integrasi dengan <span class=\"mono\">chrome.storage</span> tidak aktif, tetapi fungsi kalkulator tetap bisa dipakai manual.\n      </p>\n    \n    \n  <div class=\"tf-copyright-footer\">\n    <div>\u00a9 2025 <a href=\"mailto:wiliejonathan@gmail.com\">wiliejonathan@gmail.com</a></div>\n    <div>Instagram <a class=\"tf-ig-link\" href=\"https://www.instagram.com/wilie_jonathan/\" target=\"_blank\" rel=\"noopener noreferrer\">Wilie_jonathan</a></div>\n  </div>\n\n</footer>\n  </div>\n\n\n  <div id=\"tf-iset-ok-modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tf-iset-ok-title\">\n    <div class=\"tf-iset-ok-card\">\n      <div id=\"tf-iset-ok-title\" class=\"tf-iset-ok-title\">Perhatian</div>\n      <div id=\"tf-iset-ok-msg\" class=\"tf-iset-ok-msg\"></div>\n      <div class=\"tf-iset-ok-actions\">\n        <button class=\"btn btn-primary\" type=\"button\" id=\"tf-iset-ok-btn\">OK</button>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"tf-iset-connect-modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tf-iset-connect-title\">\n    <div class=\"tf-iset-ok-card\">\n      <div id=\"tf-iset-connect-title\" class=\"tf-iset-ok-title\">Sambungkan akun MetaTrader baru</div>\n      <div id=\"tf-iset-connect-msg\" class=\"tf-iset-ok-msg\"></div>\n      <div class=\"tf-iset-ok-actions\">\n        <button class=\"btn btn-ghost\" type=\"button\" id=\"tf-iset-connect-no\">No</button>\n        <button class=\"btn\" type=\"button\" id=\"tf-iset-connect-yes\">Sambungkan</button>\n      </div>\n    </div>\n  </div>\n\n";
(() => {
'use strict';
const TF_LICENSE_API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
const TF_LICENSE_API_URL = TF_LICENSE_API_BASE + '/license-check';
const TF_LICENSE_HEALTH_URL = TF_LICENSE_API_BASE;
const TF_LICENSE_CREDENTIALS_KEY = 'tfLicenseCredentials';
const TF_LICENSE_DEVICE_KEY = 'tfLicenseDeviceId';
const TF_LICENSE_STATE_KEY = 'tfLicenseState';
const TF_LICENSE_RECHECK_MS = 15 * 60 * 1000;
const TF_LICENSE_OFFLINE_GRACE_MS = 72 * 60 * 60 * 1000;
const TF_LICENSE_REQUEST_TIMEOUT_MS = 30 * 1000;
const TF_LICENSE_REQUEST_ATTEMPTS = 2;
const TF_LICENSE_REQUEST_RETRY_DELAY_MS = 1200;
const TF_LICENSE_PENDING_RETRY_MS = 60 * 1000;
const TF_LICENSE_FAST_GATE_MS = 15 * 60 * 1000;
const TF_LICENSE_FAST_GATE_BACKGROUND_REFRESH_MS = 2 * 60 * 1000;
const TF_LICENSE_GATE_REQUEST_TIMEOUT_MS = 8 * 1000;
const TF_LICENSE_SERVER_HEALTH_KEY = 'tfLicenseServerHealth';
const TF_LICENSE_SERVER_HEALTH_CACHE_MS = 10 * 60 * 1000;
let tfLicenseCheckPromise = null;
let tfLicenseDevicePromise = null;
let tfLicenseRecheckTimer = null;
let tfLicenseQuickRetryTimer = null;
let tfLicenseCountdownTimer = null;
let tfLicenseOfflineGraceTimer = null;
let tfLicenseValid = false;
let tfLicenseResult = null;
let tfLicenseServerOffsetMs = 0;
let tfLicenseFreshServerVerified = false;
let tfLicenseExpiryHandled = false;
function tfStorageGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (result) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(result || {});
});
}
catch (e) {
resolve({});
}
});
}
function tfStorageSet(values) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(values, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function tfCreateDeviceId() {
try {
if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
return globalThis.crypto.randomUUID();
}
}
catch (e) { }
const bytes = new Uint8Array(16);
try {
globalThis.crypto.getRandomValues(bytes);
}
catch (e) {
for (let index = 0; index < bytes.length; index += 1) {
bytes[index] = Math.floor(Math.random() * 256);
}
}
return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}
async function tfGetDeviceId() {
if (tfLicenseDevicePromise)
return tfLicenseDevicePromise;
tfLicenseDevicePromise = (async () => {
const stored = await tfStorageGet([
TF_LICENSE_DEVICE_KEY,
TF_LICENSE_CREDENTIALS_KEY
]);
const directId = String(stored[TF_LICENSE_DEVICE_KEY] || '').trim();
const credentials = stored[TF_LICENSE_CREDENTIALS_KEY] || {};
const legacyId = String(credentials.deviceId || '').trim();
const deviceId = directId || legacyId || tfCreateDeviceId();
await tfStorageSet({ [TF_LICENSE_DEVICE_KEY]: deviceId });
return deviceId;
})();
return tfLicenseDevicePromise;
}
function tfCleanEmail(value) {
let email = String(value || '');
try {
email = email.normalize('NFKC');
}
catch (e) { }
return email
.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
.replace(/\s+/g, '')
.trim();
}
function tfNormalizeEmail(value) {
return tfCleanEmail(value).toLowerCase();
}
function tfBuildEmailCandidates(value) {
const cleaned = tfCleanEmail(value);
if (!cleaned)
return [];
const at = cleaned.lastIndexOf('@');
const domainNormalized = at > 0
? cleaned.slice(0, at) + '@' + cleaned.slice(at + 1).toLowerCase()
: cleaned;
return Array.from(new Set([
cleaned,
domainNormalized,
cleaned.toLowerCase(),
cleaned.toUpperCase()
].filter(Boolean)));
}
function tfNormalizeToken(value) {
let token = String(value || '');
try {
token = token.normalize('NFKC');
}
catch (e) { }
return token
.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
.replace(/\s+/g, '')
.trim();
}
function tfBuildTokenCandidates(value) {
const normalized = tfNormalizeToken(value);
const upper = normalized.toUpperCase();
const lower = normalized.toLowerCase();
const compact = upper.replace(/[^A-Z0-9]/g, '');
const candidates = [normalized, upper, lower, compact];
if (compact.startsWith('TF') && compact.length > 2) {
const body = compact.slice(2);
if (body.length >= 8 && body.length % 4 === 0) {
const groups = body.match(/.{1,4}/g) || [];
candidates.push('TF-' + groups.join('-'));
}
}
return Array.from(new Set(candidates.filter(Boolean)));
}
function tfShouldTryCredentialVariant(result) {
if (!result || result.valid === true)
return false;
const code = String(result.code || '').trim().toUpperCase();
if (['LICENSE_EXPIRED', 'LICENSE_BLOCKED', 'LICENSE_INACTIVE', 'DEVICE_TRANSFERRED'].includes(code))
return false;
const message = String(result.message || '').trim().toUpperCase();
return /TOKEN|EMAIL|CREDENTIAL|LICENSE[_ -]?NOT[_ -]?FOUND|INVALID[_ -]?LICENSE|PERIKSA.*TOKEN|EMAIL.*TOKEN/.test(code + ' ' + message);
}
function tfNormalizeLicenseResult(result) {
const source = result && typeof result === 'object' ? result : {};
return {
valid: source.valid === true,
success: source.success === true,
code: String(source.code || ''),
message: String(source.message || ''),
acceptedEmail: tfCleanEmail(source.acceptedEmail || ''),
acceptedToken: tfNormalizeToken(source.acceptedToken || ''),
email: tfNormalizeEmail(source.email),
status: String(source.status || '').trim().toUpperCase(),
duration: String(source.duration || '').trim().toUpperCase(),
isTrial: source.isTrial === true || String(source.duration || '').trim().toUpperCase() === 'TRIAL (1 HARI)',
isPermanent: source.isPermanent === true || String(source.duration || '').trim().toUpperCase() === 'PERMANENT',
activatedAt: String(source.activatedAt || ''),
expiresAt: String(source.expiresAt || ''),
serverTime: String(source.serverTime || ''),
remainingSeconds: Number.isFinite(Number(source.remainingSeconds))
? Math.max(0, Math.floor(Number(source.remainingSeconds)))
: null,
isOffline: source.isOffline === true || String(source.code || '').toUpperCase() === 'LICENSE_VALID_OFFLINE_GRACE',
verificationPending: source.verificationPending === true ||
['LICENSE_VALID_CACHED_SERVER_UNAVAILABLE', 'LICENSE_VALID_CACHED_PENDING'].includes(String(source.code || '').toUpperCase()),
offlineGraceExpiresAt: String(source.offlineGraceExpiresAt || ''),
offlineGraceRemainingSeconds: Number.isFinite(Number(source.offlineGraceRemainingSeconds))
? Math.max(0, Math.floor(Number(source.offlineGraceRemainingSeconds)))
: null,
serverVerified: source.serverVerified === true,
isignalUsersAccessKnown: source.isignalUsersAccessKnown === true ||
typeof source.isignalUsersAccess === 'boolean' ||
typeof source.isignalUsersIncluded === 'boolean' ||
typeof source.isignalUsersAddonRequired === 'boolean' ||
Boolean(source.isignalUsersAccessReason),
isignalUsersAccess: source.isignalUsersAccess === true,
isignalUsersIncluded: source.isignalUsersIncluded === true,
isignalUsersAddonRequired: source.isignalUsersAddonRequired === true,
isignalUsersPlan: String(source.isignalUsersPlan || '').trim().toUpperCase(),
isignalUsersExpiresAt: String(source.isignalUsersExpiresAt || ''),
isignalUsersRemainingSeconds: Number.isFinite(Number(source.isignalUsersRemainingSeconds))
? Math.max(0, Math.floor(Number(source.isignalUsersRemainingSeconds)))
: null,
isignalUsersAccessReason: String(source.isignalUsersAccessReason || '').trim().toUpperCase()
};
}
function tfWait(milliseconds) {
return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(milliseconds) || 0)));
}
async function tfCallLicenseApi(action, email, token, options) {
const opts = options || {};
const timeoutMs = Math.max(1000, Number(opts.timeoutMs) || TF_LICENSE_REQUEST_TIMEOUT_MS);
const attempts = Math.max(1, Math.floor(Number(opts.attempts) || TF_LICENSE_REQUEST_ATTEMPTS));
const retryDelayMs = Math.max(0, Number(opts.retryDelayMs) || TF_LICENSE_REQUEST_RETRY_DELAY_MS);
const deviceId = await tfGetDeviceId();
const __tfUiPresenceStored = await tfStorageGet(['tfUiPresenceStateV1']);
const __tfUiPresenceState = __tfUiPresenceStored.tfUiPresenceStateV1 || {};
const __tfUiPresenceActive = typeof opts.uiPresenceActive === 'boolean'
? opts.uiPresenceActive
: __tfUiPresenceState.active === true;
const __tfPresenceEvent = String(opts.presenceEvent || '').trim().toUpperCase();
const emailCandidates = tfBuildEmailCandidates(email);
const tokenCandidates = tfBuildTokenCandidates(token);
let lastError = null;
let lastResult = null;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
let networkFailed = false;
let credentialAttempt = 0;
const totalCredentialAttempts = Math.max(1, emailCandidates.length * tokenCandidates.length);
for (const candidateEmail of emailCandidates) {
for (const candidateToken of tokenCandidates) {
credentialAttempt += 1;
const controller = typeof AbortController === 'function'
? new AbortController()
: null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, timeoutMs);
try {
const response = await fetch(TF_LICENSE_API_URL, {
method: 'POST',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined,
headers: {
'Content-Type': 'application/json;charset=UTF-8'
},
body: JSON.stringify({
action: String(action || 'validate'),
email: candidateEmail,
emailCanonical: tfNormalizeEmail(candidateEmail),
token: candidateToken,
deviceId,
extensionId: chrome.runtime.id,
extensionVersion: chrome.runtime.getManifest().version,
uiPresenceActive: __tfUiPresenceActive,
presenceEvent: __tfPresenceEvent,
clientPage: (typeof location !== 'undefined' && location.pathname) ? String(location.pathname) : '',
requestNonce: String(Date.now()) + '-' + attempt + '-' + credentialAttempt + '-' + Math.random().toString(36).slice(2)
})
});
if (!response.ok) {
throw new Error('HTTP ' + response.status);
}
const text = await response.text();
let parsed;
try {
parsed = JSON.parse(text);
}
catch (e) {
throw new Error('Respons server bukan JSON yang valid.');
}
const normalized = tfNormalizeLicenseResult({
...(parsed || {}),
serverVerified: true
});
if (normalized.valid === true) {
normalized.acceptedEmail = candidateEmail;
normalized.acceptedToken = candidateToken;
}
const legacyMessage = String(normalized.message || '').toLowerCase();
if (legacyMessage.includes('device id') || legacyMessage.includes('device_id')) {
normalized.valid = false;
normalized.acceptedEmail = '';
normalized.acceptedToken = '';
normalized.code = 'LEGACY_DEVICE_SERVER';
normalized.message = 'Server lisensi masih memakai script lama yang membatasi Device ID. Perbarui Code.gs lalu Deploy sebagai New version.';
}
lastResult = normalized;
if (normalized.valid === true || !tfShouldTryCredentialVariant(normalized) || credentialAttempt >= totalCredentialAttempts) {
return normalized;
}
}
catch (error) {
lastError = error;
networkFailed = true;
break;
}
finally {
clearTimeout(timeoutId);
}
}
if (networkFailed)
break;
}
if (!networkFailed && lastResult)
return lastResult;
if (attempt < attempts) {
await tfWait(retryDelayMs);
}
}
if (lastResult)
return lastResult;
throw lastError || new Error('Server lisensi belum merespons.');
}

function tfIsPrimaryPopupPage() {
try {
const path = String(location && location.pathname || '').toLowerCase();
return path.endsWith('/popup.html') || path === 'popup.html';
}
catch (e) {
return false;
}
}
function tfEnsureServerGateUi() {
let root = document.getElementById('tf-server-gate');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-server-gate-style';
style.textContent = `
#tf-server-gate {
position: fixed;
inset: 0;
z-index: 2147483646;
display: flex;
align-items: center;
justify-content: center;
padding: 19.8px;
background: #020617;
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-server-gate.tf-server-gate-hidden { display: none !important; }
#tf-server-gate * { box-sizing: border-box; }
#tf-server-gate .tf-server-gate-card {
width: min(324px, calc(100vw - 32.4px));
display: flex;
align-items: center;
gap: 11.7px;
padding: 13.5px 15.3px;
border: 1px solid rgba(148,163,184,.30);
border-radius: 12.6px;
background: rgba(15,23,42,.97);
box-shadow: 0 22px 65px rgba(0,0,0,.48);
}
#tf-server-gate .tf-server-gate-spinner {
width: 25.2px;
height: 25.2px;
flex: 0 0 28px;
border-radius: 899.1px;
border: 3px solid rgba(148,163,184,.25);
border-top-color: #22c55e;
animation: tfServerGateSpin .82s linear infinite;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-spinner {
animation: none;
border-color: rgba(239,68,68,.35);
border-top-color: #ef4444;
}
#tf-server-gate .tf-server-gate-copy {
min-width: 0;
display: flex;
flex-direction: column;
gap: 2.7px;
}
#tf-server-gate .tf-server-gate-title {
color: #f8fafc;
font-size: 11.7px;
font-weight: 800;
line-height: 1.25;
}
#tf-server-gate .tf-server-gate-subtitle {
color: #94a3b8;
font-size: 9.9px;
line-height: 1.4;
white-space: normal;
}
#tf-server-gate .tf-server-gate-retry {
display: none;
width: max-content;
margin-top: 6.3px;
padding: 4.5px 8.1px;
border: 1px solid rgba(56,189,248,.55);
border-radius: 899.1px;
background: rgba(14,165,233,.10);
color: #bae6fd;
cursor: pointer;
font-size: 9px;
font-weight: 750;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-retry { display: inline-flex; }
#tf-server-gate .tf-server-gate-retry:disabled { opacity: .55; cursor: wait; }
@keyframes tfServerGateSpin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-server-gate';
root.className = 'tf-server-gate-hidden';
root.setAttribute('role', 'status');
root.setAttribute('aria-live', 'polite');
root.innerHTML = `
<div class="tf-server-gate-card">
<div class="tf-server-gate-spinner" aria-hidden="true"></div>
<div class="tf-server-gate-copy">
<div class="tf-server-gate-title">Connecting to server...</div>
<div class="tf-server-gate-subtitle">Checking license status</div>
<button class="tf-server-gate-retry" type="button">Coba Lagi</button>
</div>
</div>
`;
document.body.appendChild(root);
const retryButton = root.querySelector('.tf-server-gate-retry');
if (retryButton) {
retryButton.addEventListener('click', async () => {
retryButton.disabled = true;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
try {
if (String(location.pathname || '').toLowerCase().endsWith('/subscribe_plan.html')) {
await tfRequireServerCheckOnly({ force: true });
}
else {
await tfRequireLicense({ force: true });
}
}
finally {
retryButton.disabled = false;
}
});
}
return root;
}
function tfShowServerGate(title, subtitle, locked) {
const root = tfEnsureServerGateUi();
const licenseRoot = document.getElementById('tf-license-root');
if (licenseRoot)
licenseRoot.classList.add('tf-license-hidden');
root.classList.remove('tf-server-gate-hidden');
root.classList.toggle('tf-server-gate-locked', !!locked);
const titleElement = root.querySelector('.tf-server-gate-title');
const subtitleElement = root.querySelector('.tf-server-gate-subtitle');
if (titleElement)
titleElement.textContent = String(title || 'Connecting to server...');
if (subtitleElement)
subtitleElement.textContent = String(subtitle || 'Checking license status');
document.documentElement.setAttribute('data-tf-gate-mode', locked ? 'locked' : 'loading');
document.documentElement.setAttribute('data-tf-license', 'locked');
tfSetServerAuthorization(false);
}
function tfHideServerGate() {
const root = document.getElementById('tf-server-gate');
if (root)
root.classList.add('tf-server-gate-hidden');
document.documentElement.removeAttribute('data-tf-gate-mode');
}
function tfEnsureLicenseUi() {
let root = document.getElementById('tf-license-root');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-license-style';
style.textContent = `
#tf-license-root {
position: fixed;
inset: 0;
z-index: 2147483647;
display: flex;
align-items: center;
justify-content: center;
padding: 19.8px;
overflow: auto;
background: rgba(2, 6, 23, 0.985);
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-license-root.tf-license-hidden { display: none !important; }
#tf-license-root * { box-sizing: border-box; }
#tf-license-root .tf-license-card {
width: min(378px, 100%);
padding: 21.6px;
border: 1px solid rgba(148, 163, 184, 0.28);
border-radius: 14.4px;
background: #0f172a;
box-shadow: 0 24px 70px rgba(0,0,0,.48);
}
#tf-license-root .tf-license-title {
margin: 0 0 7.2px;
font-size: 19.8px;
line-height: 1.25;
color: #f8fafc;
}
#tf-license-root .tf-license-copy {
margin: 0 0 15.3px;
color: #aeb8c8;
font-size: 11.7px;
line-height: 1.55;
}
#tf-license-root .tf-license-label {
display: block;
margin: 9.9px 0 5.4px;
color: #dbe4f0;
font-size: 10.8px;
font-weight: 700;
}
#tf-license-root .tf-license-input {
width: 100%;
min-height: 37.8px;
padding: 9px 10.8px;
border: 1px solid #334155;
border-radius: 8.1px;
outline: none;
background: #020617;
color: #f8fafc;
font-size: 12.6px;
}
#tf-license-root .tf-license-input:focus {
border-color: #38bdf8;
box-shadow: 0 0 0 3px rgba(56,189,248,.15);
}
#tf-license-root .tf-license-button {
width: 100%;
min-height: 38.7px;
margin-top: 14.4px;
padding: 9px 12.6px;
border: 0;
border-radius: 8.1px;
background: #22c55e;
color: #052e16;
cursor: pointer;
font-size: 12.6px;
font-weight: 800;
}
#tf-license-root .tf-license-button:hover { filter: brightness(1.06); }
#tf-license-root .tf-license-button:disabled { opacity: .58; cursor: wait; }
#tf-license-root .tf-license-subscribe-button {
width: 100%;
min-height: 36.9px;
margin-top: 8.1px;
padding: 8.1px 11.7px;
border: 1px solid rgba(56,189,248,.72);
border-radius: 8.1px;
background: rgba(14,165,233,.12);
color: #bae6fd;
cursor: pointer;
font-size: 11.7px;
font-weight: 800;
}
#tf-license-root .tf-license-subscribe-button:hover {
background: rgba(14,165,233,.22);
border-color: #38bdf8;
color: #f0f9ff;
}
#tf-license-root .tf-license-message {
min-height: 18px;
margin-top: 10.8px;
color: #fca5a5;
font-size: 11.7px;
line-height: 1.45;
text-align: center;
}
#tf-license-root .tf-license-message.tf-license-ok { color: #86efac; }
#tf-license-root .tf-license-footnote {
margin: 10.8px 0 0;
color: #64748b;
font-size: 9.9px;
line-height: 1.45;
text-align: center;
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-license-root';
root.className = 'tf-license-hidden';
root.setAttribute('role', 'dialog');
root.setAttribute('aria-modal', 'true');
root.innerHTML = `
<div class="tf-license-card">
<h1 class="tf-license-title">Aktivasi TF Extension</h1>
<p class="tf-license-copy">Masukkan email pembelian dan token aktivasi. Lisensi dapat digunakan selama email, token, status, dan masa berlakunya valid.</p>
<label class="tf-license-label" for="tf-license-email">Email pembelian</label>
<input class="tf-license-input" id="tf-license-email" type="email" autocomplete="email" placeholder="nama@email.com">
<label class="tf-license-label" for="tf-license-token">Token aktivasi</label>
<input class="tf-license-input" id="tf-license-token" type="text" autocomplete="off" spellcheck="false" placeholder="TF / TFA License Token">
<button class="tf-license-button" id="tf-license-activate" type="button">Aktivasi</button>
<button class="tf-license-subscribe-button" id="tf-license-subscribe" type="button">Subscribe Plan</button>
<div class="tf-license-message" id="tf-license-message">Memeriksa lisensi...</div>
<p class="tf-license-footnote">Status lisensi diperiksa melalui server pemilik extension.</p>
</div>
`;
document.body.appendChild(root);
const button = root.querySelector('#tf-license-activate');
const subscribeButton = root.querySelector('#tf-license-subscribe');
const emailInput = root.querySelector('#tf-license-email');
const tokenInput = root.querySelector('#tf-license-token');
const activate = async () => {
const email = tfCleanEmail(emailInput && emailInput.value);
const token = tfNormalizeToken(tokenInput && tokenInput.value);
if (!email || !token) {
tfShowLicenseMessage('Email dan token wajib diisi.', false);
return;
}
if (button) {
button.disabled = true;
button.textContent = 'Memeriksa...';
}
tfShowLicenseMessage('Menghubungkan ke server lisensi...', true);
try {
const result = await tfCallLicenseApi('activate', email, token);
if (!result || result.valid !== true) {
tfApplyLicenseResult(result);
tfShowLicenseMessage((result && result.message) || 'Aktivasi gagal.', false);
return;
}
const now = Date.now();
await tfStorageSet({
[TF_LICENSE_CREDENTIALS_KEY]: {
email: tfCleanEmail(result.acceptedEmail || result.email || email),
emailCanonical: tfNormalizeEmail(result.acceptedEmail || result.email || email),
token: tfNormalizeToken(result.acceptedToken || token),
deviceId: await tfGetDeviceId(),
activatedAt: result.activatedAt || now,
lastValidatedAt: now,
expiresAt: result.expiresAt || '',
duration: result.duration || '',
isTrial: !!result.isTrial,
isPermanent: !!result.isPermanent,
serverTime: result.serverTime || '',
remainingSeconds: result.remainingSeconds
},
[TF_LICENSE_STATE_KEY]: {
...result,
valid: true,
checkedAt: now,
code: String(result.code || 'LICENSE_VALID')
}
});
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfApplyLicenseResult(result);
tfShowLicenseMessage('Aktivasi berhasil. Membuka extension...', true);
setTimeout(() => location.reload(), 450);
}
catch (error) {
tfShowLicenseMessage('Tidak dapat menghubungi server lisensi. Periksa internet lalu coba lagi.', false);
}
finally {
if (button) {
button.disabled = false;
button.textContent = 'Aktivasi';
}
}
};
if (button)
button.addEventListener('click', activate);
if (tokenInput) {
tokenInput.addEventListener('keydown', (event) => {
if (event.key === 'Enter') {
event.preventDefault();
void activate();
}
});
}
if (subscribeButton) {
subscribeButton.addEventListener('click', () => {
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
const currentEmail = tfNormalizeEmail(emailInput && emailInput.value);
if (currentEmail)
subscribeUrl.searchParams.set('email', currentEmail);
try {
chrome.tabs.create({ url: subscribeUrl.toString() });
}
catch (error) {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
});
}
void tfStorageGet([TF_LICENSE_CREDENTIALS_KEY]).then((stored) => {
const credentials = stored[TF_LICENSE_CREDENTIALS_KEY] || {};
if (emailInput && credentials.email)
emailInput.value = String(credentials.email);
if (tokenInput && credentials.token)
tokenInput.value = String(credentials.token);
});
return root;
}
function tfShowLicenseMessage(message, success) {
const root = tfEnsureLicenseUi();
const el = root.querySelector('#tf-license-message');
if (!el)
return;
el.textContent = String(message || '');
el.classList.toggle('tf-license-ok', !!success);
}
function tfSetServerAuthorization(authorized) {
const html = document.documentElement;
if (!html)
return;
if (authorized) {
html.setAttribute('data-tf-server-authorized', '1');
}
else {
html.removeAttribute('data-tf-server-authorized');
}
}
function tfShowLicenseUi(message, success) {
if (!tfIsPrimaryPopupPage()) {
tfShowServerGate('Akses halaman belum tersedia', message || 'Buka popup utama untuk memeriksa status aktivasi.', true);
return;
}
const root = tfEnsureLicenseUi();
tfHideServerGate();
root.classList.remove('tf-license-hidden');
document.documentElement.setAttribute('data-tf-gate-mode', 'activation');
document.documentElement.setAttribute('data-tf-license', 'locked');
tfSetServerAuthorization(false);
tfShowLicenseMessage(message || 'Silakan aktivasi extension.', !!success);
}
function tfHideLicenseUi() {
const root = document.getElementById('tf-license-root');
if (root)
root.classList.add('tf-license-hidden');
tfHideServerGate();
document.documentElement.setAttribute('data-tf-license', 'valid');
if (tfLicenseFreshServerVerified)
tfSetServerAuthorization(true);
}
function tfEnsureStatusStyle() {
if (document.getElementById('tf-license-status-style'))
return;
const style = document.createElement('style');
style.id = 'tf-license-status-style';
style.textContent = `
.tf-login-title-row {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 9px;
margin-bottom: 7.2px;
}
.tf-login-title-row .login-title { margin-bottom: 0 !important; }
.tf-license-login-badge {
flex: 0 0 auto;
max-width: 54%;
padding: 3.6px 6.3px;
border: 1px solid rgba(34,197,94,.38);
border-radius: 899.1px;
background: rgba(34,197,94,.12);
color: #86efac;
font-size: 8.1px;
font-weight: 750;
line-height: 1.15;
text-align: right;
white-space: nowrap;
}
.tf-license-profile-info {
margin-top: 1.8px;
color: #86efac;
font-size: 9px;
font-weight: 650;
line-height: 1.3;
}
.tf-license-profile-info .tf-license-subline {
display: block;
margin-top: 1px;
color: rgba(229,231,235,.68);
font-size: 8.1px;
font-weight: 500;
white-space: nowrap;
}
.tf-license-profile-info .tf-license-time-line {
margin-top: 0;
}
.tf-license-profile-info .tf-license-main-row {
display: flex;
align-items: center;
gap: 3.6px;
width: max-content;
max-width: 100%;
}
.tf-license-profile-info .tf-license-main-label {
min-width: 0;
}
.tf-license-status-refresh {
flex: 0 0 auto;
width: 15.3px;
height: 15.3px;
display: inline-flex;
align-items: center;
justify-content: center;
margin: 0;
padding: 0;
border: 0;
border-radius: 4.5px;
background: transparent;
color: currentColor;
cursor: pointer;
opacity: .78;
}
.tf-license-status-refresh:hover {
background: rgba(148,163,184,.14);
opacity: 1;
}
.tf-license-status-refresh:focus-visible {
outline: 1px solid currentColor;
outline-offset: 1px;
}
.tf-license-status-refresh:disabled {
cursor: wait;
opacity: .55;
}
.tf-license-status-refresh svg {
display: block;
width: 12.6px;
height: 12.6px;
pointer-events: none;
}
.tf-license-status-refresh.tf-license-refreshing svg {
animation: tfLicenseRefreshSpin .8s linear infinite;
}
@keyframes tfLicenseRefreshSpin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
.tf-license-profile-info .tf-license-offline-line {
display: block;
margin-top: 1.8px;
color: #facc15;
font-size: 8.1px;
font-weight: 650;
white-space: nowrap;
}
.tf-license-profile-info .tf-license-offline-subline {
display: block;
margin-top: 1px;
}
.tf-license-login-badge.tf-license-trial {
border-color: rgba(250,204,21,.42);
background: rgba(250,204,21,.12);
color: #fde047;
}
.tf-license-profile-info.tf-license-trial {
border: 0;
background: transparent;
color: #fde047;
padding: 0;
}
.tf-license-upgrade-link {
display: block;
margin-top: 2.7px;
padding: 0;
border: 0;
background: transparent;
color: #93c5fd;
font: inherit;
font-size: 8.1px;
font-weight: 650;
line-height: 1.25;
text-decoration: underline;
text-underline-offset: 2px;
cursor: pointer;
}
.tf-license-upgrade-link:hover {
color: #bfdbfe;
}
.tf-license-login-badge.tf-license-expired,
.tf-license-profile-info.tf-license-expired,
.tf-license-login-badge.tf-license-blocked,
.tf-license-profile-info.tf-license-blocked {
border-color: rgba(239,68,68,.45);
background: rgba(239,68,68,.12);
color: #fca5a5;
}
.tf-license-profile-info.tf-license-expired,
.tf-license-profile-info.tf-license-blocked {
padding: 1.8px 0;
background: transparent;
border: 0;
}
`;
document.head.appendChild(style);
}
function tfEnsureStatusTargets() {
tfEnsureStatusStyle();
const loginTitle = document.querySelector('#login-container .login-title');
if (loginTitle && !document.getElementById('tf-login-license-status')) {
let row = loginTitle.parentElement;
if (!row || !row.classList.contains('tf-login-title-row')) {
row = document.createElement('div');
row.className = 'tf-login-title-row';
loginTitle.parentNode.insertBefore(row, loginTitle);
row.appendChild(loginTitle);
}
const badge = document.createElement('div');
badge.id = 'tf-login-license-status';
badge.className = 'tf-license-login-badge';
badge.textContent = 'Memeriksa lisensi...';
row.appendChild(badge);
}
const profileTargets = [
['popup-user-status-text', 'tf-popup-license-status'],
['masuk-user-status-text', 'tf-masuk-license-status']
];
profileTargets.forEach(([statusId, infoId]) => {
const statusText = document.getElementById(statusId);
if (!statusText || document.getElementById(infoId))
return;
const statusRow = statusText.closest('.profile-status') || statusText.parentElement;
const profileMain = statusRow && statusRow.parentElement;
if (!profileMain)
return;
const info = document.createElement('div');
info.id = infoId;
info.className = 'tf-license-profile-info';
info.textContent = 'Memeriksa lisensi...';
statusRow.insertAdjacentElement('afterend', info);
});
}
function tfFormatCountdown(totalSeconds) {
const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
const hours = Math.floor(safe / 3600);
const minutes = Math.floor((safe % 3600) / 60);
const seconds = safe % 60;
return [hours, minutes, seconds]
.map((value) => String(value).padStart(2, '0'))
.join(':');
}
function tfFormatExpiryDate(value, includeTime) {
const date = new Date(String(value || ''));
if (Number.isNaN(date.getTime()))
return '-';
try {
return new Intl.DateTimeFormat('id-ID', {
day: '2-digit',
month: 'short',
year: 'numeric',
...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
}).format(date);
}
catch (e) {
return date.toLocaleString();
}
}
function tfFormatExpiryTime(value) {
const date = new Date(String(value || ''));
if (Number.isNaN(date.getTime()))
return '-';
try {
return new Intl.DateTimeFormat('id-ID', {
hour: '2-digit',
minute: '2-digit'
}).format(date);
}
catch (e) {
return date.toLocaleTimeString();
}
}
function tfGetRemainingSeconds(result) {
const source = result || tfLicenseResult || {};
if (source.isPermanent)
return null;
const expiryMs = Date.parse(String(source.expiresAt || ''));
if (Number.isFinite(expiryMs)) {
const serverNow = Date.now() + tfLicenseServerOffsetMs;
return Math.max(0, Math.ceil((expiryMs - serverNow) / 1000));
}
return Number.isFinite(Number(source.remainingSeconds))
? Math.max(0, Math.floor(Number(source.remainingSeconds)))
: null;
}
function tfStatusKind(result, remainingSeconds) {
const source = result || {};
const code = String(source.code || '').toUpperCase();
if (code === 'OFFLINE_GRACE_EXPIRED')
return 'offline-expired';
if (code === 'LICENSE_BLOCKED' || code === 'LICENSE_INACTIVE')
return 'blocked';
if (code === 'LICENSE_EXPIRED' || (remainingSeconds !== null && remainingSeconds <= 0 && !source.isPermanent))
return 'expired';
if (source.isTrial)
return 'trial';
return 'active';
}
async function tfOpenUpgradePlan() {
const stored = await tfStorageGet([TF_LICENSE_CREDENTIALS_KEY]);
const credentials = stored[TF_LICENSE_CREDENTIALS_KEY] || {};
const email = tfNormalizeEmail(credentials.email || (tfLicenseResult && tfLicenseResult.email) || '');
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
if (email)
subscribeUrl.searchParams.set('email', email);
try {
chrome.tabs.create({ url: subscribeUrl.toString() });
}
catch (error) {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
}
function tfLicenseRefreshIconHtml() {
return '<button type="button" class="tf-license-status-refresh" title="Refresh status aktivasi" aria-label="Refresh status aktivasi">' +
'<svg fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
'<path d="M6.81 8.04V4.33H3.1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path>' +
'<path d="M19.19 17.95v3.71h3.71" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path>' +
'<path d="M10.52 2.77A10.53 10.53 0 0 1 23.01 9.74a10.53 10.53 0 0 1-3.82 11.77" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path>' +
'<path d="M15.48 23.23A10.53 10.53 0 0 1 6.81 4.49" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path>' +
'</svg>' +
'</button>';
}
function tfRenderLicenseStatus() {
tfEnsureStatusTargets();
const result = tfLicenseResult || {};
const remainingSeconds = tfGetRemainingSeconds(result);
const kind = tfStatusKind(result, remainingSeconds);
// REV367: expiry time is already known locally. Lock immediately when the
// server-aligned countdown reaches zero instead of waiting for another poll.
if (result.valid === true && result.isPermanent !== true && Number.isFinite(Number(remainingSeconds)) && Number(remainingSeconds) <= 0 && !tfLicenseExpiryHandled) {
setTimeout(() => { try { void tfHandleLicenseExpired(); } catch (e) { } }, 0);
}
const duration = String(result.duration || '').trim().toUpperCase();
const loginBadge = document.getElementById('tf-login-license-status');
const profileEls = [
document.getElementById('tf-popup-license-status'),
document.getElementById('tf-masuk-license-status')
].filter(Boolean);
try {
document.querySelectorAll('[data-tf-upgrade-plan="1"], #login-upgrade-plan-btn').forEach((el) => {
if (!el)
return;
if (!el.dataset.tfUpgradeDisplay) {
el.dataset.tfUpgradeDisplay = el.style.display || 'flex';
}
el.hidden = false;
el.style.display = el.dataset.tfUpgradeDisplay || 'flex';
});
}
catch (e) { }
let loginText = 'Lisensi belum aktif';
let profileMainText = 'Lisensi belum aktif';
let profileDetailsHtml = '';
if (kind === 'offline-expired') {
loginText = 'Verifikasi diperlukan';
profileMainText = 'Sambungkan internet';
profileDetailsHtml = '<span class="tf-license-subline">Verifikasi lisensi diperlukan</span>';
}
else if (kind === 'blocked') {
loginText = 'Lisensi diblokir';
profileMainText = 'Lisensi diblokir';
}
else if (kind === 'expired') {
loginText = result.isTrial ? 'Trial Expired' : 'Lisensi Expired';
profileMainText = result.isTrial ? 'Trial telah berakhir' : 'Lisensi telah berakhir';
}
else if (result.isPermanent) {
loginText = 'Permanent';
profileMainText = 'Lisensi PERMANENT';
}
else if (result.isTrial) {
const timer = tfFormatCountdown(remainingSeconds);
loginText = 'Trial ' + timer;
profileMainText = 'Lisensi TRIAL';
profileDetailsHtml = '<span class="tf-license-subline">Sisa waktu:</span>' +
'<span class="tf-license-subline tf-license-time-line">' + timer + '</span>';
}
else if (result.valid) {
const shortDate = tfFormatExpiryDate(result.expiresAt, false);
const expiryTime = tfFormatExpiryTime(result.expiresAt);
loginText = shortDate === '-' ? (duration || 'Lisensi aktif') : 'Exp. ' + shortDate;
profileMainText = 'Lisensi ' + (duration || 'AKTIF');
profileDetailsHtml = '<span class="tf-license-subline">Berakhir: ' + shortDate + '</span>' +
'<span class="tf-license-subline tf-license-time-line">Pukul: ' + expiryTime + '</span>';
}
else if (result.message) {
loginText = 'Lisensi tidak valid';
profileMainText = String(result.message);
}
let profileHtml = '<span class="tf-license-main-row">' +
'<span class="tf-license-main-label">' + profileMainText + '</span>' +
tfLicenseRefreshIconHtml() +
'</span>' + profileDetailsHtml;
if (result.isOffline && result.valid === true) {
profileHtml += '<span class="tf-license-offline-line">Offline — verifikasi tertunda</span>';
}
else if (result.verificationPending && result.valid === true) {
profileHtml += '<span class="tf-license-offline-line">Server lisensi belum merespons<span class="tf-license-offline-subline">Memakai data terakhir</span></span>';
}
if (loginBadge) {
loginBadge.textContent = loginText;
loginBadge.classList.remove('tf-license-trial', 'tf-license-expired', 'tf-license-blocked');
if (kind === 'trial')
loginBadge.classList.add('tf-license-trial');
if (kind === 'expired')
loginBadge.classList.add('tf-license-expired');
if (kind === 'blocked' || kind === 'offline-expired')
loginBadge.classList.add('tf-license-blocked');
loginBadge.title = result.expiresAt ? 'Berakhir: ' + tfFormatExpiryDate(result.expiresAt, true) : loginText;
if (result.isOffline && result.valid === true) {
loginBadge.title += ' • Offline — verifikasi tertunda';
}
else if (result.verificationPending && result.valid === true) {
loginBadge.title += ' • Server lisensi belum merespons; memakai data terakhir';
}
}
const showUpgradeLink = kind !== 'blocked' && kind !== 'offline-expired';
if (showUpgradeLink) {
profileHtml += '<button type="button" class="tf-license-upgrade-link">Upgrade Plan / Check Status</button>';
}
profileEls.forEach((el) => {
el.innerHTML = profileHtml;
el.classList.remove('tf-license-trial', 'tf-license-expired', 'tf-license-blocked');
if (kind === 'trial')
el.classList.add('tf-license-trial');
if (kind === 'expired')
el.classList.add('tf-license-expired');
if (kind === 'blocked' || kind === 'offline-expired')
el.classList.add('tf-license-blocked');
const refreshButton = el.querySelector('.tf-license-status-refresh');
if (refreshButton) {
refreshButton.addEventListener('click', async (event) => {
event.preventDefault();
event.stopPropagation();
if (refreshButton.disabled)
return;
refreshButton.disabled = true;
refreshButton.classList.add('tf-license-refreshing');
refreshButton.title = 'Memeriksa status aktivasi...';
try {
await tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: false
});
}
catch (e) {
}
finally {
try {
refreshButton.disabled = false;
refreshButton.classList.remove('tf-license-refreshing');
refreshButton.title = 'Refresh status aktivasi';
}
catch (e) { }
}
});
}
const upgradeLink = el.querySelector('.tf-license-upgrade-link');
if (upgradeLink) {
upgradeLink.addEventListener('click', (event) => {
event.preventDefault();
event.stopPropagation();
void tfOpenUpgradePlan();
});
}
});
if (kind === 'expired' && result.valid === true) {
// Tampilkan status expiry, tetapi jangan memutus pekerjaan yang sedang berjalan.
// Status terminal akan diterapkan pada pembukaan halaman berikutnya.
}
}
function tfEstimateServerNowMs(result, checkedAt) {
const source = result || {};
const serverMs = Date.parse(String(source.serverTime || ''));
const checkedMs = Number(checkedAt);
if (Number.isFinite(serverMs) && Number.isFinite(checkedMs) && checkedMs > 0) {
return serverMs + Math.max(0, Date.now() - checkedMs);
}
return Date.now();
}
function tfApplyLicenseResult(result, checkedAt) {
const normalized = tfNormalizeLicenseResult(result);
if (normalized.serverVerified === true) {
tfLicenseFreshServerVerified = true;
}
const browserReportsOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
if (!browserReportsOffline && normalized.isOffline) {
normalized.isOffline = false;
normalized.verificationPending = true;
normalized.code = 'LICENSE_VALID_CACHED_PENDING';
normalized.message = 'Server lisensi belum merespons. Menggunakan data lisensi terakhir.';
}
tfLicenseResult = normalized;
tfLicenseExpiryHandled = false;
const serverMs = Date.parse(normalized.serverTime || '');
const checkedMs = Number(checkedAt);
if (Number.isFinite(serverMs)) {
tfLicenseServerOffsetMs = serverMs -
(Number.isFinite(checkedMs) && checkedMs > 0 ? checkedMs : Date.now());
}
else {
tfLicenseServerOffsetMs = 0;
}
if (tfLicenseCountdownTimer)
clearInterval(tfLicenseCountdownTimer);
if (tfLicenseOfflineGraceTimer)
clearTimeout(tfLicenseOfflineGraceTimer);
tfRenderLicenseStatus();
if (normalized.valid && !normalized.isPermanent && normalized.expiresAt) {
tfLicenseCountdownTimer = setInterval(tfRenderLicenseStatus, 1000);
}
// Tidak menjadwalkan penguncian offline di tengah sesi aktif.
// Device Lock akan melakukan validasi server lagi saat halaman dibuka ulang.
}
async function tfReadStoredLicense() {
const stored = await tfStorageGet([
TF_LICENSE_CREDENTIALS_KEY,
TF_LICENSE_STATE_KEY
]);
const credentials = stored[TF_LICENSE_CREDENTIALS_KEY] || {};
const rawState = stored[TF_LICENSE_STATE_KEY] || {};
const result = tfNormalizeLicenseResult(rawState);
const checkedAt = Number(rawState.checkedAt || credentials.lastValidatedAt || 0);
return {
credentials,
result,
checkedAt,
rawState
};
}
function tfEvaluateStoredLicense(snapshot) {
const snap = snapshot || {};
const credentials = snap.credentials || {};
const result = snap.result || {};
const email = tfNormalizeEmail(credentials.email);
const token = tfNormalizeToken(credentials.token);
if (!email || !token || result.valid !== true) {
return { usable: false, reason: 'invalid', graceRemainingMs: 0 };
}
const code = String(result.code || '').toUpperCase();
if (code === 'LICENSE_EXPIRED' ||
code === 'LICENSE_BLOCKED' ||
code === 'LICENSE_INACTIVE' ||
code === 'OFFLINE_GRACE_EXPIRED') {
return { usable: false, reason: 'invalid', graceRemainingMs: 0 };
}
const estimatedServerNow = tfEstimateServerNowMs(result, snap.checkedAt);
if (!result.isPermanent) {
const expiryMs = Date.parse(String(result.expiresAt || ''));
if (!Number.isFinite(expiryMs)) {
return { usable: false, reason: 'invalid', graceRemainingMs: 0 };
}
if (expiryMs <= estimatedServerNow) {
return { usable: false, reason: 'expired', graceRemainingMs: 0 };
}
}
if (result.isTrial) {
return { usable: true, reason: 'trial', graceRemainingMs: null };
}
const lastOnlineValidatedAt = Number(credentials.lastValidatedAt || snap.checkedAt || 0);
if (!Number.isFinite(lastOnlineValidatedAt) || lastOnlineValidatedAt <= 0) {
return { usable: false, reason: 'grace_expired', graceRemainingMs: 0 };
}
const graceExpiresAt = lastOnlineValidatedAt + TF_LICENSE_OFFLINE_GRACE_MS;
const graceRemainingMs = Math.max(0, graceExpiresAt - Date.now());
if (graceRemainingMs <= 0) {
return {
usable: false,
reason: 'grace_expired',
graceRemainingMs: 0,
graceExpiresAt
};
}
return {
usable: true,
reason: 'paid',
graceRemainingMs,
graceExpiresAt
};
}
function tfStoredLicenseIsUsable(snapshot) {
return tfEvaluateStoredLicense(snapshot).usable;
}
function tfBuildExpiredFromSnapshot(snapshot) {
const result = tfNormalizeLicenseResult({
...((snapshot && snapshot.result) || {}),
valid: false,
code: 'LICENSE_EXPIRED',
message: snapshot && snapshot.result && snapshot.result.isTrial
? 'Masa trial telah berakhir.'
: 'Masa berlaku lisensi telah berakhir.',
remainingSeconds: 0
});
return result;
}
async function tfRecordLicenseState(valid, result) {
const normalized = tfNormalizeLicenseResult(result);
await tfStorageSet({
[TF_LICENSE_STATE_KEY]: {
...normalized,
valid: !!valid,
checkedAt: Date.now(),
code: normalized.code || (valid ? 'LICENSE_VALID' : 'LICENSE_INVALID'),
message: normalized.message || ''
}
});
}
async function tfSaveValidLicense(result, existingCredentials) {
const credentials = existingCredentials || {};
const cleanCredentials = { ...credentials };
const now = Date.now();
await tfStorageSet({
[TF_LICENSE_CREDENTIALS_KEY]: {
...cleanCredentials,
email: tfCleanEmail(result.acceptedEmail || result.email || credentials.email),
emailCanonical: tfNormalizeEmail(result.acceptedEmail || result.email || credentials.email),
token: tfNormalizeToken(result.acceptedToken || credentials.token),
lastValidatedAt: now,
activatedAt: result.activatedAt || credentials.activatedAt || '',
expiresAt: result.expiresAt || '',
duration: result.duration || '',
isTrial: !!result.isTrial,
isPermanent: !!result.isPermanent,
serverTime: result.serverTime || '',
remainingSeconds: result.remainingSeconds
}
});
await tfRecordLicenseState(true, result);
}
function tfIsTerminalLicenseCode(value) {
const code = String(value || '').trim().toUpperCase();
return [
'LICENSE_EXPIRED',
'LICENSE_BLOCKED',
'LICENSE_INACTIVE',
'DEVICE_TRANSFERRED'
].includes(code);
}
async function tfValidateSavedLicense(options) {
const opts = options || {};
const snapshot = await tfReadStoredLicense();
const credentials = snapshot.credentials || {};
const email = tfNormalizeEmail(credentials.email);
const token = tfNormalizeToken(credentials.token);
if (!email || !token) {
const result = tfNormalizeLicenseResult({
valid: false,
code: 'NO_SAVED_LICENSE',
message: 'Masukkan email dan token untuk mengaktifkan extension.'
});
await tfRecordLicenseState(false, result);
return result;
}
try {
const result = await tfCallLicenseApi('validate', email, token, opts.quick === true
? { timeoutMs: TF_LICENSE_GATE_REQUEST_TIMEOUT_MS, attempts: 1, retryDelayMs: 0 }
: undefined);
if (result && result.valid === true) {
result.email = result.email || email;
await tfSaveValidLicense(result, {
...credentials,
email,
token
});
}
else if (tfIsTerminalLicenseCode(result && result.code)) {
// Hanya status terminal yang boleh mengganti session valid yang sudah aktif.
// Respons sementara/legacy tidak boleh memaksa aktivasi ulang di tengah proses.
await tfRecordLicenseState(false, result);
}
return result || tfNormalizeLicenseResult({
valid: false,
message: 'Respons server kosong.'
});
}
catch (error) {
const browserReportsOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
if (opts.requireFreshServer === true && opts.allowStoredFallback !== true) {
return tfNormalizeLicenseResult({
valid: false,
success: false,
code: browserReportsOffline
? 'FRESH_SERVER_CHECK_OFFLINE'
: 'FRESH_SERVER_CHECK_REQUIRED',
message: browserReportsOffline
? 'Halaman dikunci. Sambungkan internet untuk memeriksa lisensi ke server.'
: 'Halaman dikunci karena server lisensi belum merespons. Coba beberapa saat lagi.',
isOffline: browserReportsOffline,
verificationPending: !browserReportsOffline
});
}
const evaluation = tfEvaluateStoredLicense(snapshot);
if (evaluation.usable) {
const estimatedServerNow = tfEstimateServerNowMs(snapshot.result, snapshot.checkedAt);
const expiryMs = Date.parse(String(snapshot.result.expiresAt || ''));
const remainingSeconds = Number.isFinite(expiryMs)
? Math.max(0, Math.ceil((expiryMs - estimatedServerNow) / 1000))
: null;
const graceExpiresAt = evaluation.graceExpiresAt
? new Date(evaluation.graceExpiresAt).toISOString()
: '';
return tfNormalizeLicenseResult({
...snapshot.result,
valid: true,
success: true,
code: browserReportsOffline
? 'LICENSE_VALID_OFFLINE_GRACE'
: 'LICENSE_VALID_CACHED_SERVER_UNAVAILABLE',
message: browserReportsOffline
? 'Offline — verifikasi lisensi ditunda.'
: 'Server lisensi belum merespons. Menggunakan data lisensi terakhir.',
serverTime: new Date(estimatedServerNow).toISOString(),
remainingSeconds,
isOffline: browserReportsOffline,
verificationPending: !browserReportsOffline,
offlineGraceExpiresAt: graceExpiresAt,
offlineGraceRemainingSeconds: evaluation.graceRemainingMs === null
? null
: Math.max(0, Math.ceil(evaluation.graceRemainingMs / 1000))
});
}
if (evaluation.reason === 'expired') {
return tfBuildExpiredFromSnapshot(snapshot);
}
if (evaluation.reason === 'grace_expired') {
return tfNormalizeLicenseResult({
...snapshot.result,
valid: false,
success: false,
code: 'OFFLINE_GRACE_EXPIRED',
message: browserReportsOffline
? 'Batas penggunaan offline 72 jam telah habis. Sambungkan internet untuk memverifikasi lisensi.'
: 'Server lisensi belum berhasil diverifikasi selama 72 jam. Coba Refresh atau periksa Apps Script.',
isOffline: browserReportsOffline,
verificationPending: !browserReportsOffline,
offlineGraceRemainingSeconds: 0
});
}
return tfNormalizeLicenseResult({
valid: false,
code: browserReportsOffline ? 'NETWORK_OFFLINE' : 'LICENSE_SERVER_UNAVAILABLE',
message: browserReportsOffline
? 'Koneksi internet terputus. Sambungkan internet untuk memverifikasi lisensi.'
: 'Internet terdeteksi aktif, tetapi server lisensi belum merespons. Coba Refresh beberapa saat lagi.',
isOffline: browserReportsOffline,
verificationPending: !browserReportsOffline
});
}
}
async function tfStopProtectedJobsBestEffort() {
// REV127: jangan pernah membatalkan batch scan/Set/Disconnect hanya karena
// validator lisensi halaman mengalami timeout atau respons sementara.
// Transfer perangkat yang sah tetap ditangani oleh Device Lock background.
return false;
}
async function tfHandleLicenseExpired() {
if (tfLicenseExpiryHandled)
return;
tfLicenseExpiryHandled = true;
tfLicenseValid = false;
const expiredResult = tfNormalizeLicenseResult({
...(tfLicenseResult || {}),
valid: false,
code: 'LICENSE_EXPIRED',
message: tfLicenseResult && tfLicenseResult.isTrial
? 'Masa trial telah berakhir.'
: 'Masa berlaku lisensi telah berakhir.',
remainingSeconds: 0
});
tfLicenseResult = expiredResult;
tfRenderLicenseStatus();
await tfRecordLicenseState(false, expiredResult);
await tfStopProtectedJobsBestEffort();
setTimeout(() => tfShowLicenseUi(expiredResult.message, false), 250);
}
async function tfHandleOfflineGraceExpired() {
if (!tfLicenseValid || !tfLicenseResult || tfLicenseResult.isTrial)
return;
tfLicenseValid = false;
const result = tfNormalizeLicenseResult({
...(tfLicenseResult || {}),
valid: false,
success: false,
code: 'OFFLINE_GRACE_EXPIRED',
message: 'Batas penggunaan offline 72 jam telah habis. Sambungkan internet untuk memverifikasi lisensi.',
isOffline: true,
offlineGraceRemainingSeconds: 0
});
tfLicenseResult = result;
tfRenderLicenseStatus();
await tfStopProtectedJobsBestEffort();
tfShowLicenseUi(result.message, false);
}
async function tfRefreshLicenseStatus(options) {
const opts = options || {};
const result = await tfValidateSavedLicense({ requireFreshServer: false });
let valid = !!(result && result.valid === true);
if (!valid && !tfIsTerminalLicenseCode(result && result.code) && tfLicenseResult && tfLicenseResult.valid === true) {
const previousValid = tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
success: true,
code: 'LICENSE_VALID_SESSION_CONTINUES',
message: 'Session perangkat tetap aktif. Pemeriksaan server ditunda.',
verificationPending: true
});
valid = true;
tfLicenseValid = true;
tfApplyLicenseResult(previousValid, Date.now());
tfHideLicenseUi();
return previousValid;
}
if (valid && result && result.serverVerified === true) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
}
tfLicenseValid = valid;
tfApplyLicenseResult(result, Date.now());
if (valid && result && result.verificationPending === true) {
tfScheduleQuickRetry();
}
else if (tfLicenseQuickRetryTimer) {
clearTimeout(tfLicenseQuickRetryTimer);
tfLicenseQuickRetryTimer = null;
}
if (valid) {
tfHideLicenseUi();
tfScheduleRecheck();
try {
window.dispatchEvent(new CustomEvent('tf-license-valid', { detail: result }));
}
catch (e) { }
if (opts.reloadOnSuccess) {
setTimeout(() => location.reload(), 250);
}
return result;
}
await tfStopProtectedJobsBestEffort();
if (opts.showOverlayOnFailure !== false) {
tfShowLicenseUi((result && result.message) || 'Lisensi tidak valid.', false);
}
try {
window.dispatchEvent(new CustomEvent('tf-license-invalid', { detail: result }));
}
catch (e) { }
return result;
}
function tfScheduleQuickRetry() {
if (tfLicenseQuickRetryTimer) {
clearTimeout(tfLicenseQuickRetryTimer);
tfLicenseQuickRetryTimer = null;
}
// Tidak ada retry lisensi otomatis saat halaman sedang dipakai.
// Pemeriksaan berikutnya dilakukan saat halaman dibuka ulang atau pengguna menekan Refresh.
}
function tfGetSnapshotValidationAgeMs(snapshot) {
const snap = snapshot || {};
const credentials = snap.credentials || {};
const checkedAt = Number(credentials.lastValidatedAt || snap.checkedAt || 0);
if (!Number.isFinite(checkedAt) || checkedAt <= 0)
return Number.POSITIVE_INFINITY;
return Math.max(0, Date.now() - checkedAt);
}
async function tfTryFastStoredLicenseGate() {
const snapshot = await tfReadStoredLicense();
const evaluation = tfEvaluateStoredLicense(snapshot);
const ageMs = tfGetSnapshotValidationAgeMs(snapshot);
if (!evaluation.usable) {
return false;
}
const cachedResult = tfNormalizeLicenseResult({
...snapshot.result,
valid: true,
success: true,
code: 'LICENSE_VALID_RECENT_SERVER_CACHE',
message: 'Lisensi valid.',
isOffline: false,
verificationPending: false,
serverVerified: false
});
tfLicenseValid = true;
tfLicenseFreshServerVerified = true;
tfApplyLicenseResult(cachedResult, snapshot.checkedAt || Date.now());
tfSetServerAuthorization(true);
tfHideLicenseUi();
tfScheduleRecheck();
try {
window.dispatchEvent(new CustomEvent('tf-license-valid', { detail: cachedResult }));
}
catch (e) { }
// Device Lock sudah memverifikasi session sebelum bundle halaman dimuat.
// Jangan menjalankan refresh lisensi lama secara diam-diam saat scan berlangsung.
void ageMs;
return true;
}
async function tfReadRecentServerHealth() {
const stored = await tfStorageGet([TF_LICENSE_SERVER_HEALTH_KEY]);
const state = stored[TF_LICENSE_SERVER_HEALTH_KEY] || {};
const checkedAt = Number(state.checkedAt || 0);
return {
ok: state.ok === true,
checkedAt,
fresh: state.ok === true && Number.isFinite(checkedAt) && checkedAt > 0 &&
(Date.now() - checkedAt) <= TF_LICENSE_SERVER_HEALTH_CACHE_MS
};
}
async function tfSaveServerHealth(ok) {
await tfStorageSet({
[TF_LICENSE_SERVER_HEALTH_KEY]: {
ok: ok === true,
checkedAt: Date.now()
}
});
}
function tfScheduleRecheck() {
if (tfLicenseRecheckTimer) {
clearInterval(tfLicenseRecheckTimer);
tfLicenseRecheckTimer = null;
}
// Session Device Lock berlaku sepanjang halaman ini tetap terbuka.
// Jangan revalidasi setiap 15 menit karena kegagalan jaringan sesaat dapat
// menghentikan batch scan yang sudah berjalan lama.
}
async function tfRequireLicense(options) {
const opts = options || {};
tfEnsureServerGateUi();
tfEnsureStatusTargets();
if (tfLicenseValid && tfLicenseFreshServerVerified && !opts.force) {
tfSetServerAuthorization(true);
return true;
}
if (tfLicenseCheckPromise && !opts.force)
return tfLicenseCheckPromise;
tfLicenseCheckPromise = (async () => {
if (!opts.force) {
const fastAllowed = await tfTryFastStoredLicenseGate();
if (fastAllowed)
return true;
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
const result = await tfValidateSavedLicense({
requireFreshServer: true,
allowStoredFallback: true,
quick: true
});
const valid = !!(result && result.valid === true);
tfLicenseValid = valid;
tfApplyLicenseResult(result, Date.now());
if (valid) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
tfScheduleRecheck();
if (result && result.verificationPending === true) {
tfScheduleQuickRetry();
}
try {
window.dispatchEvent(new CustomEvent('tf-license-valid', { detail: result }));
}
catch (e) { }
return true;
}
tfSetServerAuthorization(false);
if (tfIsPrimaryPopupPage()) {
tfShowLicenseUi((result && result.message) || 'Lisensi belum berhasil diverifikasi ke server.', false);
}
else {
tfShowServerGate('Validasi lisensi gagal', (result && result.message) || 'Buka popup utama untuk memeriksa aktivasi.', true);
}
try {
window.dispatchEvent(new CustomEvent('tf-license-invalid', { detail: result }));
}
catch (e) { }
return false;
})();
try {
return await tfLicenseCheckPromise;
}
finally {
tfLicenseCheckPromise = null;
}
}
async function tfRequireServerCheckOnly(options) {
const opts = options || {};
tfEnsureServerGateUi();
if (!opts.force) {
const recentHealth = await tfReadRecentServerHealth();
if (recentHealth.fresh) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking server availability', false);
const controller = typeof AbortController === 'function' ? new AbortController() : null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, TF_LICENSE_GATE_REQUEST_TIMEOUT_MS);
try {
const response = await fetch(TF_LICENSE_HEALTH_URL, {
method: 'GET',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined
});
if (!response.ok)
throw new Error('HTTP ' + response.status);
const parsed = JSON.parse(await response.text());
if (!parsed || (parsed.success !== true && parsed.ok !== true))
throw new Error('Server lisensi tidak siap.');
await tfSaveServerHealth(true);
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
catch (error) {
await tfSaveServerHealth(false);
tfLicenseFreshServerVerified = false;
tfSetServerAuthorization(false);
tfShowServerGate((typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Tidak ada koneksi internet'
: 'Server belum merespons', (typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Sambungkan internet lalu klik Coba Lagi.'
: 'Tunggu beberapa saat lalu klik Coba Lagi.', true);
return false;
}
finally {
clearTimeout(timeoutId);
}
}
window.addEventListener('online', () => {
if (tfLicenseValid && tfLicenseResult) {
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_CACHED',
message: 'Koneksi kembali. Memeriksa server lisensi...',
isOffline: false,
verificationPending: false,
offlineGraceExpiresAt: '',
offlineGraceRemainingSeconds: null
}), Date.now());
}
setTimeout(() => {
void tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: true
});
}, 300);
});
window.addEventListener('offline', () => {
if (!tfLicenseValid || !tfLicenseResult)
return;
void tfReadStoredLicense().then((snapshot) => {
const evaluation = tfEvaluateStoredLicense(snapshot);
if (!evaluation.usable)
return;
const estimatedServerNow = tfEstimateServerNowMs(snapshot.result, snapshot.checkedAt);
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_OFFLINE_GRACE',
message: 'Offline — verifikasi lisensi ditunda.',
serverTime: new Date(estimatedServerNow).toISOString(),
isOffline: true,
offlineGraceExpiresAt: evaluation.graceExpiresAt
? new Date(evaluation.graceExpiresAt).toISOString()
: '',
offlineGraceRemainingSeconds: evaluation.graceRemainingMs === null
? null
: Math.max(0, Math.ceil(evaluation.graceRemainingMs / 1000))
}), Date.now());
});
});
function tfGetISignalUsersAccessState() {
const result = tfLicenseResult || {};
const known = result.isignalUsersAccessKnown === true;
const duration = String(result.duration || '').trim().toUpperCase();
const reason = String(result.isignalUsersAccessReason || '').trim().toUpperCase();
const expiresAt = String(result.isignalUsersExpiresAt || '');
const included = result.isignalUsersIncluded === true;
const addonRequired = result.isignalUsersAddonRequired === true;
const addonPlan = String(result.isignalUsersPlan || '').trim().toUpperCase();
const includedByMainPlan = ['TRIAL (1 HARI)', '6 BULAN', '1 TAHUN', 'PERMANENT'].includes(duration);
const effectiveKnown = known || includedByMainPlan;
const effectiveIncluded = included || includedByMainPlan;
let access = result.valid === true && (result.isignalUsersAccess === true || includedByMainPlan);
let remainingSeconds = result.isignalUsersRemainingSeconds;
if (access && !included && expiresAt) {
const expiryMs = Date.parse(expiresAt);
const serverNowMs = Date.now() + tfLicenseServerOffsetMs;
if (Number.isFinite(expiryMs)) {
remainingSeconds = Math.max(0, Math.floor((expiryMs - serverNowMs) / 1000));
if (remainingSeconds <= 0)
access = false;
}
}
return {
known: effectiveKnown,
access,
included: effectiveIncluded,
addonRequired,
addonPlan,
duration,
expiresAt,
remainingSeconds,
reason: access ? (reason || (included ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE')) : (reason || 'ACCESS_NOT_AVAILABLE'),
email: tfNormalizeEmail(result.email || '')
};
}
try {
if (document.body) {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}
else {
document.addEventListener('DOMContentLoaded', () => {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}, { once: true });
}
}
catch (e) { }
window.tfRequireLicense = tfRequireLicense;
window.tfRequireServerCheckOnly = tfRequireServerCheckOnly;
window.tfValidateSavedLicense = tfValidateSavedLicense;
window.tfRefreshLicenseStatus = tfRefreshLicenseStatus;
window.tfLicenseApiUrl = TF_LICENSE_API_URL;
window.tfGetLicenseResult = () => ({ ...(tfLicenseResult || {}) });
window.tfGetISignalUsersAccessState = tfGetISignalUsersAccessState;
tfEnsureLicenseUi();
tfEnsureStatusTargets();
})();
window.trackInvestingProTopMenuLogoClick = window.trackInvestingProTopMenuLogoClick || function () {
};
function loadUserProfileIntoDashboard() {
try {
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
return;
}
const profileKeys = [
'tfUserProfile',
'tfLoginConfirmed',
'tfAccountLoginState',
'tfRootLoginState',
'tfEnteredMain'
];
const applyProfile = (data) => {
const profile = data && data.tfUserProfile && typeof data.tfUserProfile === 'object'
? data.tfUserProfile
: null;
const nameEl = document.getElementById('dashboard-user-name');
const avatarEl = document.getElementById('dashboard-user-avatar');
const statusEl = document.getElementById('dashboard-user-status-text');
if (!nameEl && !avatarEl && !statusEl) {
return;
}
const accountState = String(data && data.tfAccountLoginState || '').trim().toLowerCase();
const rootState = String(data && data.tfRootLoginState || '').trim().toLowerCase();
const hasProfileIdentity = !!(profile && (profile.name || profile.email || profile.avatarUrl));
const isOnline = hasProfileIdentity ||
!!(data && (data.tfLoginConfirmed === true || data.tfEnteredMain === true)) ||
/logged[_ -]?in|online/.test(accountState) ||
/logged[_ -]?in|online/.test(rootState);
if (nameEl) {
if (profile && profile.name) {
nameEl.textContent = String(profile.name);
}
else if (isOnline && /belum login|offline/i.test(String(nameEl.textContent || ''))) {
nameEl.textContent = 'User';
}
}
if (avatarEl && profile && profile.avatarUrl) {
avatarEl.src = String(profile.avatarUrl);
}
if (statusEl) {
const explicitlyLoggedOut = !hasProfileIdentity && /logged[_ -]?out/.test(accountState) && /logged[_ -]?out/.test(rootState);
statusEl.textContent = isOnline ? 'Online' : (explicitlyLoggedOut ? 'Offline' : 'Memeriksa akun...');
}
if (nameEl && !hasProfileIdentity && !isOnline && /user belum login|offline/i.test(String(nameEl.textContent || ''))) {
nameEl.textContent = 'Memuat akun...';
}
try {
document.documentElement.dataset.tfAccountOnline = isOnline ? '1' : '0';
}
catch (e) { }
};
const readProfile = () => {
try {
chrome.storage.local.get(profileKeys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
applyProfile(data || {});
});
}
catch (e) { }
};
readProfile();
if (!window.__tfDashboardProfileStorageBound) {
window.__tfDashboardProfileStorageBound = true;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local' || !changes)
return;
if (profileKeys.some((key) => changes[key])) {
readProfile();
}
});
}
catch (e) { }
}
if (!window.__tfDashboardProfileRefreshStarted) {
window.__tfDashboardProfileRefreshStarted = true;
try {
chrome.runtime.sendMessage({ type: 'ensure_tf_profile', force: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
readProfile();
});
}
catch (e) { }
setTimeout(readProfile, 1200);
setTimeout(readProfile, 3500);
}
}
catch (e) {
console.warn('TF dashboard: gagal load user profile', e);
}
}
function loadScannedByNoteIntoDashboard() {
try {
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
return;
}
const noteEl = document.getElementById('tf-scanned-by');
if (!noteEl)
return;
chrome.storage.local.get(['tfLastImportMeta', 'tfLastScanMeta', 'tfUserProfile'], (data) => {
const importMeta = data && data.tfLastImportMeta ? data.tfLastImportMeta : null;
const importedBy = importMeta && importMeta.exportedBy ? importMeta.exportedBy : null;
const scanMeta = data && data.tfLastScanMeta ? data.tfLastScanMeta : null;
const scannedBy = scanMeta && scanMeta.scannedBy ? scanMeta.scannedBy : null;
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const fixedOwner = importedBy || scannedBy || null;
const name = (fixedOwner && fixedOwner.name) || (!fixedOwner && profile && profile.name) || '';
const email = (fixedOwner && fixedOwner.email) || (!fixedOwner && profile && profile.email) || '';
if (!name && !email) {
noteEl.textContent = '';
return;
}
const namePart = name ? String(name).trim() : '';
const emailPart = email ? String(email).trim() : '';
noteEl.textContent = `Scanned by : ${namePart}${emailPart ? ' | ' + emailPart : ''}`;
});
}
catch (e) {
console.warn('TF dashboard: gagal load scanned-by note', e);
}
}
const __tfDashScanOverlay = {
visible: false,
overall: {},
detail: {},
detailOrder: [],
overallOrder: []
};
__tfDashScanOverlay.lastInProg = false;
__tfDashScanOverlay.lastMap = {};
function tfDash_isOverallComplete(mapObj) {
try {
const keys = Object.keys(mapObj || {});
let sawOverall = false;
for (const k of keys) {
const st = mapObj[k];
if (!st)
continue;
if (String(st.batchIndex) !== '0')
continue;
sawOverall = true;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return false;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!Number.isFinite(d) || !Number.isFinite(t) || t <= 0)
return false;
if (d < t)
return false;
}
return sawOverall;
}
catch (e) {
return false;
}
}
function tfDash_updateSkipButtonState() {
const els = tfDash_overlayEls();
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '10.8px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '3.6px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.textContent = '▶';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a)
a.textContent = '▶';
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.textContent = '▼';
}
else {
subUl.style.display = 'none';
arrow.textContent = '▶';
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar)
ar.textContent = '▼';
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]:not([data-pair="__ALL__"])');
specifics.forEach((x) => {
if (!x.checked)
allSpecificChecked = false;
});
subAllCb.checked = !!allSpecificChecked;
}
else {
}
}
}
}
commitAndRefresh();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pcb) => {
pcb.addEventListener('change', () => {
const analyst = pcb.getAttribute('data-analyst');
const pair = pcb.getAttribute('data-pair');
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"]:not([data-pair])');
if (!topCb || !topCb.checked) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pair === '__ALL__') {
if (pcb.disabled) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pcb.checked) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
specific.forEach((x) => {
x.checked = true;
});
}
else {
}
commitAndRefresh();
return;
}
const subAll = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair="__ALL__"]');
if (subAll && !subAll.disabled) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
let allChecked = true;
specific.forEach((x) => {
if (!x.checked)
allChecked = false;
});
subAll.checked = allChecked;
}
else if (subAll) {
subAll.checked = false;
}
commitAndRefresh();
});
});
}
containers.forEach((c) => buildOneContainer(c));
}
function setupAnalystTickerFilter() {
const statsContainerIds = ['analyst-filter-container', 'analyst-filter-container-monthly'];
const historyContainerIds = ['analyst-filter-container-history', 'analyst-filter-container-equity'];
const statsContainers = statsContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const historyContainers = historyContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const allContainers = statsContainers.concat(historyContainers);
if (!allContainers.length)
return;
if (!__tfAnalystFilterOutsideClickInstalled) {
__tfAnalystFilterOutsideClickInstalled = true;
document.addEventListener('click', function onDocClickCloseMenus(event) {
const clickedInside = !!event.target.closest('#analyst-filter-container, #analyst-filter-container-monthly, #analyst-filter-container-history, #analyst-filter-container-equity');
if (clickedInside)
return;
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu && menu.style && menu.style.display === 'block') {
menu.style.display = 'none';
const arrow = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (arrow)
arrow.textContent = '▶';
}
});
});
}
const pairsByAnalystStats = {};
const pairsByAnalystHistory = {};
if (analystSourcesByName && typeof analystSourcesByName === 'object') {
Object.keys(analystSourcesByName).forEach((name) => {
if (!name)
return;
const src = analystSourcesByName[name];
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (src && Array.isArray(src.pairs)) {
src.pairs.forEach((p) => {
if (p) {
const pp = String(p).toUpperCase();
pairsByAnalystStats[name].add(pp);
pairsByAnalystHistory[name].add(pp);
}
});
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (!item || !item.analyst)
return;
const name = item.analyst;
const p = item.pair;
if (name) {
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (p) {
pairsByAnalystStats[name].add(String(p).toUpperCase());
pairsByAnalystHistory[name].add(String(p).toUpperCase());
}
}
});
}
const analystNamesStats = Object.keys(pairsByAnalystStats).sort((a, b) => a.localeCompare(b));
const analystNamesHistory = Object.keys(pairsByAnalystHistory).sort((a, b) => a.localeCompare(b));
if (!analystNamesStats.length) {
statsContainers.forEach((c) => (c.innerHTML = ''));
}
if (!analystNamesHistory.length) {
historyContainers.forEach((c) => (c.innerHTML = ''));
}
function tf_getNoDataPairsEntry(map, baseName) {
if (!map || typeof map !== 'object')
return null;
if (Object.prototype.hasOwnProperty.call(map, baseName))
return map[baseName];
const target = tf_normAnalystKey(baseName).toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return null;
}
function tf_isNoDataPairStats(baseName, pair) {
const entry = tf_getNoDataPairsEntry(noDataPairsByAnalyst, baseName);
const p = tf_normPairKey(pair);
return !!(entry && p && entry[p]);
}
function tf_computeHistoryNoValuePairsByAnalyst() {
const tmp = {};
const arr = Array.isArray(historySignals) ? historySignals : [];
arr.forEach((it) => {
if (!it)
return;
const a = tf_normAnalystKey(it.analyst || '');
const p = tf_normPairKey(it.pair || '');
if (!a || !p)
return;
if (!tmp[a])
tmp[a] = {};
if (!tmp[a][p])
tmp[a][p] = { count: 0, absPips: 0 };
tmp[a][p].count += 1;
let pv = 0;
if (typeof it.pips === 'number') {
pv = it.pips;
}
else if (typeof it.pips === 'string') {
const v = parseFloat(it.pips);
if (Number.isFinite(v))
pv = v;
}
tmp[a][p].absPips += Math.abs(pv);
});
const out = {};
if (pairsByAnalystHistory && typeof pairsByAnalystHistory === 'object') {
Object.keys(pairsByAnalystHistory).forEach((baseName) => {
const a = tf_normAnalystKey(baseName);
const set = pairsByAnalystHistory[baseName];
if (!a || !set)
return;
try {
for (const pairRaw of set) {
const p = tf_normPairKey(pairRaw);
if (!p)
continue;
const s = (tmp[a] && tmp[a][p]) ? tmp[a][p] : { count: 0, absPips: 0 };
const noValue = (s.count === 0) || (s.count > 0 && s.absPips === 0);
if (noValue) {
if (!out[a])
out[a] = {};
out[a][p] = true;
}
}
}
catch (e) { }
});
}
return out;
}
const historyNoValuePairsByAnalyst = tf_computeHistoryNoValuePairsByAnalyst();
function tf_isNoValuePairHistory(baseName, pair) {
const a = tf_normAnalystKey(baseName);
const p = tf_normPairKey(pair);
return !!(historyNoValuePairsByAnalyst && historyNoValuePairsByAnalyst[a] && historyNoValuePairsByAnalyst[a][p]);
}
const analystHasValueOverall = {};
const allAnalystNamesOverall = Array.from(new Set([].concat(analystNamesStats || [], analystNamesHistory || [])));
allAnalystNamesOverall.sort((a, b) => a.localeCompare(b));
function tf_pairExistsInHistory(baseName, pair) {
const set = pairsByAnalystHistory && pairsByAnalystHistory[baseName];
if (!set)
return false;
const target = tf_normPairKey(pair);
try {
for (const x of set) {
if (tf_normPairKey(x) === target)
return true;
}
}
catch (e) { }
return false;
}
allAnalystNamesOverall.forEach((name) => {
const u = new Set();
(pairsByAnalystStats[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
(pairsByAnalystHistory[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
const pairs = Array.from(u).filter(Boolean);
let hasValue = false;
if (pairs.length) {
for (const p of pairs) {
const statsHas = (getDollarPerPipForPair(p) > 0) && !tf_isNoDataPairStats(name, p);
const histHas = tf_pairExistsInHistory(name, p) ? !tf_isNoValuePairHistory(name, p) : false;
if (statsHas || histHas) {
hasValue = true;
break;
}
}
}
analystHasValueOverall[name] = hasValue;
});
if (selectedAnalystsGlobal === undefined) {
let anyExcluded = false;
const map = {};
allAnalystNamesOverall.forEach((name) => {
if (analystHasValueOverall[name]) {
map[name] = true;
}
else {
anyExcluded = true;
}
});
selectedAnalystsGlobal = anyExcluded ? map : null;
}
function tf_isNoValuePairOverall(baseName, pair) {
const p = tf_normPairKey(pair);
if (!p)
return true;
if (getDollarPerPipForPair(p) <= 0)
return true;
const statsHasPair = !!(pairsByAnalystStats && pairsByAnalystStats[baseName] && pairsByAnalystStats[baseName].has(p));
const histHasPair = tf_pairExistsInHistory(baseName, p);
const statsHasValue = statsHasPair && !tf_isNoDataPairStats(baseName, p);
const histHasValue = histHasPair && !tf_isNoValuePairHistory(baseName, p);
return !(statsHasValue || histHasValue);
}
const pairsByAnalystUnified = {};
allAnalystNamesOverall.forEach((name) => {
const u = new Set();
(pairsByAnalystStats[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
(pairsByAnalystHistory[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
const clean = new Set();
try {
for (const x of u) {
const pp = tf_normPairKey(x);
if (pp)
clean.add(pp);
}
}
catch (e) { }
pairsByAnalystUnified[name] = clean;
});
function tf_buildDefaultPairsMapUnified() {
const defMap = {};
allAnalystNamesOverall.forEach((name) => {
const set = pairsByAnalystUnified[name] || new Set();
const pairs = Array.from(set).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
const selected = pairs.filter((p) => !tf_isNoValuePairOverall(name, p));
defMap[name] = selected;
});
return defMap;
}
function tf_mergePairsMap(a, b) {
const out = {};
allAnalystNamesOverall.forEach((name) => {
const set = new Set();
const e1 = tf_getAllowedPairsOrNull(a, name);
const e2 = tf_getAllowedPairsOrNull(b, name);
if (Array.isArray(e1))
e1.forEach((p) => set.add(tf_normPairKey(p)));
if (Array.isArray(e2))
e2.forEach((p) => set.add(tf_normPairKey(p)));
const allowed = [];
const avail = pairsByAnalystUnified[name] || new Set();
try {
for (const p of set) {
const pp = tf_normPairKey(p);
if (!pp)
continue;
if (avail && avail.has(pp)) {
allowed.push(pp);
}
}
}
catch (e) { }
if (set.size > 0 || tf_getSelectedAnalystEntry(a, name) !== undefined || tf_getSelectedAnalystEntry(b, name) !== undefined) {
out[name] = allowed.sort();
}
});
return out;
}
const statsOk = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object');
const histOk = (selectedAnalystPairsMapHistory && typeof selectedAnalystPairsMapHistory === 'object');
const defUnified = tf_buildDefaultPairsMapUnified();
function tf_clonePairsMap(src) {
const out = {};
try {
Object.keys(defUnified || {}).forEach((k) => {
out[k] = Array.isArray(defUnified[k]) ? defUnified[k].slice() : [];
});
}
catch (e) { }
if (src && typeof src === 'object') {
try {
Object.keys(src).forEach((k) => {
const v = src[k];
if (Array.isArray(v))
out[k] = v.slice();
});
}
catch (e) { }
}
return out;
}
function tf_ensurePairsMap(map) {
const out = tf_clonePairsMap(map);
allAnalystNamesOverall.forEach((name) => {
const entry = tf_getSelectedAnalystEntry(out, name);
if (entry === undefined) {
out[name] = Array.isArray(defUnified[name]) ? defUnified[name].slice() : [];
}
else if (Array.isArray(entry)) {
const avail = pairsByAnalystUnified[name] || new Set();
const seen = new Set();
const cleaned = [];
try {
entry.forEach((p) => {
const pp = tf_normPairKey(p);
if (!pp)
return;
if (avail && avail.size && !avail.has(pp))
return;
if (!seen.has(pp)) {
seen.add(pp);
cleaned.push(pp);
}
});
}
catch (e) { }
out[name] = cleaned.sort();
}
});
return out;
}
if (!statsOk && !histOk) {
selectedAnalystPairsMapStats = tf_ensurePairsMap(null);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedStats = true;
__tfAnalystTickerDefaultAppliedHistory = true;
}
else {
if (statsOk && !histOk) {
selectedAnalystPairsMapStats = tf_ensurePairsMap(selectedAnalystPairsMapStats);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedHistory = true;
}
else if (!statsOk && histOk) {
selectedAnalystPairsMapHistory = tf_ensurePairsMap(selectedAnalystPairsMapHistory);
selectedAnalystPairsMapStats = selectedAnalystPairsMapHistory;
__tfAnalystTickerDefaultAppliedStats = true;
}
else {
if (selectedAnalystPairsMapStats !== selectedAnalystPairsMapHistory) {
const merged = tf_mergePairsMap(selectedAnalystPairsMapStats, selectedAnalystPairsMapHistory);
selectedAnalystPairsMapStats = merged;
selectedAnalystPairsMapHistory = merged;
}
selectedAnalystPairsMapStats = tf_ensurePairsMap(selectedAnalystPairsMapStats);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedStats = true;
__tfAnalystTickerDefaultAppliedHistory = true;
}
}
tf_buildAnalystTickerFilterGroup({
containers: allContainers,
analystNames: allAnalystNamesOverall,
pairsByAnalyst: pairsByAnalystUnified,
getState: () => selectedAnalystPairsMapStats,
setState: (m) => {
selectedAnalystPairsMapStats = m;
selectedAnalystPairsMapHistory = m;
},
getGlobalState: () => selectedAnalystsGlobal,
setGlobalState: (m) => (selectedAnalystsGlobal = m),
isAnalystNoValue: (name, pairs) => (analystHasValueOverall && analystHasValueOverall[name] === false),
applyFn: applyAnalystPairFilterAll,
isPairNoValue: (name, p) => tf_isNoValuePairOverall(name, p),
forceUncheckNoValue: true,
pairNoValueClass: 'tf-pair-no-value',
autoSelectPairsOnAnalystEnable: true
});
}
function applyAnalystPairFilterAll() {
renderSummaryTable();
buildMonthlyTableSkeleton();
updateMonthlyTableCells();
recomputeHistoryRows();
}
function applyAnalystPairFilterStats() {
applyAnalystPairFilterAll();
}
function applyAnalystPairFilterHistory() {
applyAnalystPairFilterAll();
}
function applyAnalystPairFilter() {
applyAnalystPairFilterStats();
applyAnalystPairFilterHistory();
}
function applyPairFilter() {
applyAnalystPairFilterAll();
}
let analystSourcesByName = {};
function formatAnalystDisplayName(name) {
if (!name)
return '';
const raw = String(name).trim();
let out = raw;
if (/^https?:\/\//i.test(raw)) {
const m = raw.match(/channels\/(\d+)/i);
if (m && m[1]) {
out = 'Channel ' + m[1];
}
else {
try {
const u = new URL(raw);
out = u.hostname || 'Link';
}
catch (e) {
out = 'Link';
}
}
}
return out;
}
function tf_normAnalystKey(name) {
return String(name || '')
.replace(/[\u200B-\u200D\uFEFF]/g, '')
.replace(/\s+/g, ' ')
.trim();
}
function tf_normPairKey(pair) {
return String(pair || '')
.toUpperCase()
.replace(/[^A-Z0-9]/g, '')
.trim();
}
function tf_getSelectedAnalystEntry(map, analystName) {
if (!map || typeof map !== 'object')
return undefined;
if (Object.prototype.hasOwnProperty.call(map, analystName))
return map[analystName];
const norm = tf_normAnalystKey(analystName);
if (Object.prototype.hasOwnProperty.call(map, norm))
return map[norm];
const target = norm.toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return undefined;
}
function tf_isAnalystGloballySelected(analystName) {
if (selectedAnalystsGlobal === undefined || selectedAnalystsGlobal === null)
return true;
if (selectedAnalystsGlobal && typeof selectedAnalystsGlobal === 'object') {
return tf_getSelectedAnalystEntry(selectedAnalystsGlobal, analystName) !== undefined;
}
return true;
}
function tf_getAllowedPairsOrNull(map, analystName) {
if (!map || typeof map !== 'object')
return null;
const entry = tf_getSelectedAnalystEntry(map, analystName);
return (typeof entry === 'undefined') ? null : entry;
}
function rebuildAnalystListFromSources() {
const nameSet = new Set();
const hasSources = (analystSourcesByName && typeof analystSourcesByName === 'object'
&& Object.keys(analystSourcesByName).some((k) => String(k || '').trim()));
if (hasSources) {
Object.keys(analystSourcesByName).forEach((name) => {
if (name) {
nameSet.add(name);
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (item && item.analyst) {
nameSet.add(item.analyst);
}
});
}
const baseNames = Array.from(nameSet);
baseNames.sort((a, b) => a.localeCompare(b));
const expanded = [];
baseNames.forEach((baseName) => {
let pairs = [];
const src = analystSourcesByName && analystSourcesByName[baseName];
if (src && Array.isArray(src.pairs) && src.pairs.length) {
pairs = src.pairs.slice();
}
else if (Array.isArray(historySignals)) {
const pairSet = new Set();
historySignals.forEach((item) => {
if (item && item.analyst === baseName && item.pair) {
pairSet.add(item.pair);
}
});
pairs = Array.from(pairSet);
}
if (!pairs.length) {
expanded.push({
name: baseName,
baseName: baseName,
pair: null,
pairs: []
});
return;
}
pairs.forEach((pair) => {
expanded.push({
name: baseName + ' (' + pair + ')',
baseName: baseName,
pair: pair,
pairs: [pair]
});
});
});
ANALYSTS = expanded;
}
function computeSlStatsFromHistory(analystName, pair) {
const result = {
fixed: null,
fixedCount: 0,
avg: null
};
const pairUpper = pair ? String(pair).toUpperCase() : null;
const tf_getRowTs = (it) => {
if (!it)
return null;
if (typeof it.sortKey === 'number' && isFinite(it.sortKey))
return it.sortKey;
if (typeof it.sortKey === 'string' && it.sortKey) {
const t = Date.parse(it.sortKey);
if (!isNaN(t))
return t;
}
const s = String(it.displayDate || '').replace(/\s*WIB\s*$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
};
let avgCutoffTs = null;
let fixedCutoffTs = null;
try {
let maxTs = null;
(Array.isArray(historySignals) ? historySignals : []).forEach((it) => {
if (!it || it.analyst !== analystName)
return;
if (pairUpper) {
const p = String(it.pair || '').toUpperCase();
if (p !== pairUpper)
return;
}
const ts = tf_getRowTs(it);
if (ts == null)
return;
if (maxTs == null || ts > maxTs)
maxTs = ts;
});
if (maxTs != null) {
const avgDate = new Date(maxTs);
avgDate.setFullYear(avgDate.getFullYear() - 1);
avgCutoffTs = avgDate.getTime();
const fixedDate = new Date(maxTs);
fixedDate.setMonth(fixedDate.getMonth() - 6);
fixedCutoffTs = fixedDate.getTime();
}
}
catch (e) {
avgCutoffTs = null;
fixedCutoffTs = null;
}
let storedAvg = null;
try {
if (analystName && pairUpper && avgSlPipsByAnalystPair && typeof avgSlPipsByAnalystPair === "object") {
const baseMap = avgSlPipsByAnalystPair[String(analystName)];
if (baseMap && typeof baseMap === "object" && Object.prototype.hasOwnProperty.call(baseMap, pairUpper)) {
const v = parseFloat(baseMap[pairUpper]);
if (Number.isFinite(v) && v > 0) {
storedAvg = v;
}
}
}
}
catch (e) {
storedAvg = null;
}
if (!analystName || !Array.isArray(historySignals) || !historySignals.length) {
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
const MIN_FIXED_COUNT = 5;
const intFreq = Object.create(null);
const decSumByInt = Object.create(null);
let sumAbs = 0;
let count = 0;
historySignals.forEach((item) => {
if (!item || item.analyst !== analystName)
return;
if (pairUpper) {
const p = String(item.pair || '').toUpperCase();
if (p !== pairUpper)
return;
}
let rowTs = null;
if (avgCutoffTs != null || fixedCutoffTs != null) {
rowTs = tf_getRowTs(item);
if (rowTs == null)
return;
}
const inAvgWindow = avgCutoffTs == null || rowTs >= avgCutoffTs;
const inFixedWindow = fixedCutoffTs == null || rowTs >= fixedCutoffTs;
if (!inAvgWindow && !inFixedWindow)
return;
if (typeof item.pips !== 'number')
return;
if (item.pips >= 0)
return;
const absVal = Math.abs(item.pips);
if (!Number.isFinite(absVal) || absVal <= 0)
return;
if (inAvgWindow) {
sumAbs += absVal;
count += 1;
}
if (inFixedWindow) {
const baseInt = Math.trunc(absVal);
const dec = absVal - baseInt;
const k = String(baseInt);
intFreq[k] = (intFreq[k] || 0) + 1;
decSumByInt[k] = (decSumByInt[k] || 0) + (Number.isFinite(dec) ? dec : 0);
}
});
if (!count) {
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
const avgVal = sumAbs / count;
if (Number.isFinite(avgVal) && avgVal > 0) {
result.avg = avgVal;
}
let bestBase = null;
let bestCount = 0;
for (const k in intFreq) {
const c = intFreq[k] || 0;
if (c < MIN_FIXED_COUNT)
continue;
const base = parseInt(k, 10);
if (!Number.isFinite(base))
continue;
if (c > bestCount) {
bestCount = c;
bestBase = base;
}
else if (c === bestCount && bestBase != null && Number.isFinite(avgVal)) {
const candDist = Math.abs(base - avgVal);
const bestDist = Math.abs(bestBase - avgVal);
if (candDist < bestDist) {
bestBase = base;
}
}
else if (c === bestCount && bestBase == null) {
bestBase = base;
}
}
if (bestBase != null && bestCount >= MIN_FIXED_COUNT) {
const k = String(bestBase);
const decSum = decSumByInt[k] || 0;
const decAvg = decSum / bestCount;
const fixedVal = bestBase + (Number.isFinite(decAvg) ? decAvg : 0);
if (Number.isFinite(fixedVal) && fixedVal > 0) {
result.fixed = fixedVal;
result.fixedCount = bestCount;
}
}
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
function computeSlPipsFromHistory(analystName, pair) {
const stats = computeSlStatsFromHistory(analystName, pair);
if (!stats || !stats.fixed || stats.fixedCount < 5) {
return null;
}
return stats.fixed;
}
function tf_makeAnalystPairKey(analystName, pair) {
if (!analystName)
return '';
if (pair)
return analystName + '|' + String(pair).toUpperCase();
return analystName;
}
function getSelectedSlTypeForAnalyst(analystName, pair) {
if (!analystName)
return null;
const key = tf_makeAnalystPairKey(analystName, pair);
return slTypeSelectionByAnalyst[key] || null;
}
function setSelectedSlTypeForAnalyst(analystName, pair, type) {
if (!analystName)
return;
const key = tf_makeAnalystPairKey(analystName, pair);
if (type === 'fixed' || type === 'avg') {
slTypeSelectionByAnalyst[key] = type;
}
else {
delete slTypeSelectionByAnalyst[key];
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function getEffectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
let pair = null;
let precomputedStats = null;
if (pairOrStats && typeof pairOrStats === 'object' && maybeStats === undefined) {
precomputedStats = pairOrStats;
}
else {
pair = pairOrStats || null;
precomputedStats = maybeStats || null;
}
const stats = precomputedStats || computeSlStatsFromHistory(analystName, pair);
let type = getSelectedSlTypeForAnalyst(analystName, pair);
if (type === 'fixed' && (!stats.fixed || stats.fixedCount < 5)) {
type = null;
}
if (type === 'avg' && !stats.avg) {
type = null;
}
if (!type) {
if (stats.fixed && stats.fixedCount >= 5) {
type = 'fixed';
}
else if (stats.avg) {
type = 'avg';
}
else {
type = null;
}
}
if (type) {
setSelectedSlTypeForAnalyst(analystName, pair, type);
}
let pips = 0;
if (type === 'fixed') {
pips = stats.fixed || 0;
}
else if (type === 'avg') {
pips = stats.avg || 0;
}
return { type, pips };
}
let currentBalance = 5000;
let currentRiskPercent = 1;
let withdrawEnabled = false;
let withdrawAmount = 0;
let withdrawEveryMonths = 1;
let withdrawDraftEnabled = false;
let withdrawDraftAmount = null;
let withdrawDraftEveryMonths = 1;
const TF_WITHDRAW_ENABLED_KEY = "tf_withdraw_enabled";
const TF_WITHDRAW_AMOUNT_KEY = "tf_withdraw_amount";
const TF_WITHDRAW_EVERY_MONTHS_KEY = "tf_withdraw_every_months";
const TF_WITHDRAW_MIN_MONTHKEY = "2023-01";
const TF_INCOME_MINMAX_START_MONTHKEY = "2024-01";
function tf_monthIndexFromMonthKeySimple(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return (y * 12) + (mo - 1);
}
function tf_isWithdrawDueMonth(monthKey, everyMonths) {
const every = Number.isFinite(everyMonths) ? Math.max(1, Math.min(12, Math.floor(everyMonths))) : 1;
if (typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey))
return false;
if (monthKey < TF_WITHDRAW_MIN_MONTHKEY)
return false;
const idx = tf_monthIndexFromMonthKeySimple(monthKey);
const anchor = tf_monthIndexFromMonthKeySimple(TF_WITHDRAW_MIN_MONTHKEY);
if (idx === null || anchor === null)
return false;
return ((idx - anchor) % every) === 0;
}
let withdrawMaxAllowed = null;
let withdrawMinSuggested = null;
let withdrawDraftTouched = false;
let withdrawDraftAutoFilled = false;
function tf_setWithdrawAverageText(maxOrNull, priceBusy) {
try {
const elInline = document.getElementById('withdraw-average-inline');
const elInlineEq = document.getElementById('withdraw-average-inline-equity');
const elInlineHistory = document.getElementById('withdraw-average-inline-history');
const elLegacy = document.getElementById('withdraw-average-text');
const setText = (t) => {
if (elInline)
elInline.textContent = t;
if (elInlineEq)
elInlineEq.textContent = t;
if (elInlineHistory)
elInlineHistory.textContent = t;
if (elLegacy)
elLegacy.textContent = t;
const eqInput = document.getElementById('withdraw-amount-input-equity');
if (eqInput)
eqInput.placeholder = t;
const histInput = document.getElementById('withdraw-amount-input-history');
if (histInput)
histInput.placeholder = t;
};
if (priceBusy) {
setText('average : -');
return;
}
if (maxOrNull === null || maxOrNull === undefined || !Number.isFinite(maxOrNull)) {
setText('average : -');
return;
}
setText(`average : ${formatMoney(Math.max(0, maxOrNull))}`);
}
catch (e) { }
}
function tf_setWithdrawMaxWarningVisible(visible, message) {
try {
const els = [
document.getElementById('withdraw-max-warning'),
document.getElementById('withdraw-max-warning-equity'),
document.getElementById('withdraw-max-warning-history')
].filter(Boolean);
if (!els.length)
return;
els.forEach((el) => {
if (visible) {
el.textContent = message || '';
el.style.display = 'block';
}
else {
el.textContent = '';
el.style.display = 'none';
}
});
}
catch (e) { }
}
function tf_getWithdrawMaxAllowedOrNull() {
return (Number.isFinite(withdrawMaxAllowed) && withdrawMaxAllowed >= 0) ? withdrawMaxAllowed : null;
}
function tf_enforceWithdrawAmountMax(showWarning, sourceInputEl) {
try {
const max = tf_getWithdrawMaxAllowedOrNull();
const inputsRaw = [
sourceInputEl,
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity'),
document.getElementById('withdraw-amount-input-history')
].filter(Boolean);
const seen = new Set();
const inputs = inputsRaw.filter((el) => {
const k = el && el.id ? el.id : String(el);
if (seen.has(k))
return false;
seen.add(k);
return true;
});
const input = inputs[0];
if (!input)
return false;
if (max === null) {
tf_setWithdrawMaxWarningVisible(false);
return false;
}
const rawStr = String(input.value || '').trim();
if (rawStr === '') {
withdrawDraftAmount = null;
tf_setWithdrawMaxWarningVisible(false);
inputs.forEach((el) => {
try {
el.value = '';
}
catch (e) { }
});
return false;
}
let v = safeParseFloat(input.value);
if (v === null || v < 0)
v = 0;
withdrawDraftAmount = v;
const exceeded = (v > max + 1e-9);
if (exceeded) {
const clamped = Math.max(0, max);
withdrawDraftAmount = clamped;
input.value = String(Math.round(clamped * 100) / 100);
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = input.value;
}
catch (e) { }
});
tf_setWithdrawMaxWarningVisible(true, `Withdraw tidak boleh melebihi ${formatMoney(clamped)}`);
return true;
}
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = String(input.value || '');
}
catch (e) { }
});
if (showWarning) {
tf_setWithdrawMaxWarningVisible(false);
}
return false;
}
catch (e) {
return false;
}
}
function tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy) {
try {
if (priceBusy || !Array.isArray(incomeValuesGross) || !incomeValuesGross.length) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, priceBusy);
return;
}
let sum = 0;
let n = 0;
for (let i = 0; i < incomeValuesGross.length; i++) {
const v = incomeValuesGross[i];
if (!Number.isFinite(v))
continue;
sum += v;
n += 1;
}
if (!n) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
return;
}
const avg = sum / n;
withdrawMaxAllowed = Math.max(0, avg);
tf_setWithdrawAverageText(withdrawMaxAllowed, false);
tf_enforceWithdrawAmountMax(true);
}
catch (e) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
}
}
function tf_tryAutoFillWithdrawDraftFromSuggested() {
try {
if (withdrawDraftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !Array.isArray(monthlyGrossByMonth) || !monthlyGrossByMonth.length) {
withdrawMinSuggested = null;
return;
}
let minAbs = null;
for (let i = 0; i < monthlyGrossByMonth.length; i++) {
const it = monthlyGrossByMonth[i] || {};
const mk = String(it.monthKey || '');
if (!mk || !/^\d{4}-\d{2}$/.test(mk))
continue;
if (mk < TF_WITHDRAW_MIN_MONTHKEY)
continue;
const v = Number(it.grossDollars);
if (!Number.isFinite(v))
continue;
const sig = Number(it.signals);
const hasData = (Number.isFinite(sig) ? sig : 0) > 0 || Math.abs(v) > 1e-9;
if (!hasData)
continue;
const absV = Math.abs(v);
if (!Number.isFinite(absV))
continue;
if (absV <= 0)
continue;
if (minAbs === null || absV < minAbs)
minAbs = absV;
}
withdrawMinSuggested = (minAbs === null) ? 0 : minAbs;
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) {
withdrawMinSuggested = null;
}
}
let analystRiskOverrides = {};
const TF_TABLE1_BALANCE_KEY = 'tf_current_balance';
const TF_TABLE1_RISK_KEY = 'tf_current_risk_percent';
const TF_TABLE1_RISK_OVERRIDES_KEY = 'tf_risk_overrides';
const TF_SL_TYPE_SELECTION_KEY = 'tf_sl_type_selection';
function tf_loadTable1StateFromLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
const bRaw = localStorage.getItem(TF_TABLE1_BALANCE_KEY);
const b = parseFloat(bRaw);
if (Number.isFinite(b) && b > 0)
currentBalance = b;
const rRaw = localStorage.getItem(TF_TABLE1_RISK_KEY);
const r = parseFloat(rRaw);
if (Number.isFinite(r) && r >= 0)
currentRiskPercent = r;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function getRiskPercentForAnalyst(analystName, pair) {
if (analystName) {
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (Object.prototype.hasOwnProperty.call(analystRiskOverrides, key)) {
const v = analystRiskOverrides[key];
if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
return v;
}
}
}
return currentRiskPercent;
}
function setAnalystRiskOverride(analystName, pair, value) {
if (!analystName)
return;
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (value === null || !Number.isFinite(value) || value < 0) {
delete analystRiskOverrides[key];
}
else {
analystRiskOverrides[key] = value;
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function clearAllAnalystRiskOverrides() {
analystRiskOverrides = {};
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function normalizeWIBSuffix(s) {
if (s == null)
return s;
const t = String(s).trim();
return t.replace(/\s*(WIB\s*)+$/i, ' WIB').trim();
}
let historySignals = [];
let initialHistorySignals = null;
let monthlyStatsByAnalyst = {};
let slTypeSelectionByAnalyst = {};
let noDataPairsByAnalyst = {};
let avgSlPipsByAnalystPair = {};
const TF_TRADE_RANGE_STORAGE_KEY = 'tf_trade_time_range_v1';
const TF_TRADE_RANGE_OPTIONS = [
{ key: 'all', label: 'ALL', title: 'All', monthsBack: 0 },
{ key: 'm1', label: '1M', title: '1 Month', monthsBack: 1 },
{ key: 'm2', label: '2M', title: '2 Month', monthsBack: 2 },
{ key: 'm3', label: '3M', title: '3 Month', monthsBack: 3 },
{ key: 'm4', label: '4M', title: '4 Month', monthsBack: 4 },
{ key: 'm5', label: '5M', title: '5 Month', monthsBack: 5 },
{ key: 'm6', label: '6M', title: '6 Month', monthsBack: 6 },
{ key: 'm7', label: '7M', title: '7 Month', monthsBack: 7 },
{ key: 'm8', label: '8M', title: '8 Month', monthsBack: 8 },
{ key: 'm9', label: '9M', title: '9 Month', monthsBack: 9 },
{ key: 'm10', label: '10M', title: '10 Month', monthsBack: 10 },
{ key: 'm11', label: '11M', title: '11 Month', monthsBack: 11 },
{ key: 'y1', label: '1Y', title: '1 Year', monthsBack: 12 },
{ key: 'y2', label: '2Y', title: '2 Year', monthsBack: 24 },
{ key: 'y3', label: '3Y', title: '3 Year', monthsBack: 36 },
{ key: 'y5', label: '5Y', title: '5 Year', monthsBack: 60 }
];
let tfTradeTimeRangeKey = 'all';
let allMonthKeysSorted = [];
const MAX_MONTH_COLUMNS = 12;
function rebuildMonthKeysFromStats() {
const set = new Set();
const stats = monthlyStatsByAnalyst || {};
Object.keys(stats).forEach((name) => {
const aStats = stats[name];
if (!aStats || typeof aStats !== 'object')
return;
Object.keys(aStats).forEach((key) => {
if (!key || !/^\d{4}-\d{2}$/.test(key))
return;
set.add(key);
});
});
const keys = Array.from(set);
keys.sort((a, b) => {
const [aY, aM] = a.split('-').map((v) => parseInt(v, 10));
const [bY, bM] = b.split('-').map((v) => parseInt(v, 10));
if (aY !== bY)
return aY - bY;
return aM - bM;
});
allMonthKeysSorted = keys;
}
let __tfMonthlyMonthKeysSig = '';
function tf_getMonthlyVisibleMonthKeys() {
rebuildMonthKeysFromStats();
let monthKeys = Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted.slice() : [];
const opt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const monthsBack = opt && Number.isFinite(opt.monthsBack) ? (opt.monthsBack || 0) : 0;
if (monthsBack && monthsBack > 0 && monthKeys.length) {
let maxIdx = null;
for (let i = 0; i < monthKeys.length; i++) {
const mi = tf_monthKeyToIndex(monthKeys[i]);
if (mi == null)
continue;
if (maxIdx == null || mi > maxIdx)
maxIdx = mi;
}
if (maxIdx == null) {
monthKeys = [];
}
else {
const startIdx = maxIdx - (monthsBack - 1);
monthKeys = monthKeys.filter((k) => {
const mi = tf_monthKeyToIndex(k);
if (mi == null)
return false;
return mi >= startIdx;
});
}
}
return monthKeys;
}
function tf_syncMonthlyTableToTradeRange() {
let monthKeys = [];
try {
monthKeys = tf_getMonthlyVisibleMonthKeys();
}
catch (e) {
monthKeys = [];
}
const sig = (monthKeys || []).join('|');
const needRebuild = (sig !== __tfMonthlyMonthKeysSig);
if (needRebuild) {
try {
buildMonthlyTableSkeleton();
}
catch (e) { }
__tfMonthlyMonthKeysSig = sig;
}
try {
updateMonthlyTableCells();
}
catch (e) { }
}
function rebuildMonthlyStatsFromHistory() {
const rows = Array.isArray(historySignals) ? historySignals : [];
if (!rows.length) {
rebuildMonthKeysFromStats();
return;
}
const stats = {};
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0) {
monthlyStatsByAnalyst = {};
rebuildMonthKeysFromStats();
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
if (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object') {
const baseName = a.baseName || a.name;
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (Array.isArray(mapEntry)) {
const pf = (a.pair || '').toString().toUpperCase();
if (!pf) {
return;
}
const match = mapEntry.some((p) => p.toString().toUpperCase() === pf);
if (!match) {
return;
}
}
}
else if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const pf = a.pair;
if (pf && !selectedPairs.includes(pf)) {
return;
}
}
const baseName = a.baseName || a.name;
const pairFilter = a.pair || null;
const perMonth = {};
rows.forEach((item) => {
if (!item)
return;
if (item.analyst !== baseName)
return;
if (pairFilter && item.pair !== pairFilter)
return;
const rawSortKey = item.sortKey;
let monthKey = null;
if (typeof rawSortKey === 'number' && isFinite(rawSortKey)) {
const d = new Date(rawSortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
monthKey =
String(yyyy).padStart(4, '0') +
'-' +
String(mm).padStart(2, '0');
}
}
else if (typeof rawSortKey === 'string') {
if (rawSortKey.length >= 7) {
const candidate = rawSortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate)) {
monthKey = candidate;
}
}
}
if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
return;
}
if (!perMonth[monthKey]) {
perMonth[monthKey] = { pips: 0, signals: 0 };
}
perMonth[monthKey].pips += typeof item.pips === 'number' ? item.pips : 0;
perMonth[monthKey].signals += 1;
});
stats[a.name] = perMonth;
});
monthlyStatsByAnalyst = stats;
rebuildMonthKeysFromStats();
}
function getVisibleMonthKeys() {
if (!Array.isArray(allMonthKeysSorted) || !allMonthKeysSorted.length)
return [];
const endKey = allMonthKeysSorted[allMonthKeysSorted.length - 1];
const m = endKey.match(/^(\d{4})-(\d{2})$/);
if (!m) {
const keys = allMonthKeysSorted.slice();
return keys.length <= MAX_MONTH_COLUMNS ? keys : keys.slice(keys.length - MAX_MONTH_COLUMNS);
}
const endYear = parseInt(m[1], 10);
const endMonth = parseInt(m[2], 10);
const formatKey = (y, mm) => String(y).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
const shiftMonth = (y, mm, delta) => {
const total = y * 12 + (mm - 1) + delta;
const ny = Math.floor(total / 12);
const nm = (total % 12) + 1;
return formatKey(ny, nm);
};
const out = [];
for (let i = MAX_MONTH_COLUMNS - 1; i >= 0; i--) {
out.push(shiftMonth(endYear, endMonth, -i));
}
return out;
}
function formatMonthKeyToLabel(monthKey) {
if (!monthKey)
return '';
const m = monthKey.match(/^(\d{4})-(\d{2})$/);
if (!m)
return monthKey;
const year = m[1];
const monthIndex = parseInt(m[2], 10) - 1;
const monthName = MONTHS[monthIndex] || monthKey;
return monthName + '\n' + year;
}
function tf_formatMonthKeyInline(monthKey) {
if (!monthKey || typeof monthKey !== 'string')
return '-';
const m = monthKey.match(/^(\d{4})-(\d{2})$/);
if (!m)
return String(monthKey);
const year = m[1];
const monthIndex = parseInt(m[2], 10) - 1;
const monthName = MONTHS[monthIndex] || m[2];
return monthName + ' ' + year;
}
let equityCurvePoints = [];
let equityHoverIndex = null;
let equityCrosshairX = null;
let equityCrosshairY = null;
let lastHistoryRows = [];
const TF_EQUITY_CHART_MODE_KEY = 'tf_equity_chart_mode_v1';
let equityChartMode = 'line';
function tf_loadEquityChartModePreference() {
try {
const raw = localStorage.getItem(TF_EQUITY_CHART_MODE_KEY);
if (raw === 'candle' || raw === 'line') {
equityChartMode = raw;
}
else {
equityChartMode = 'line';
}
}
catch (e) {
equityChartMode = 'line';
}
}
function tf_saveEquityChartModePreference() {
try {
localStorage.setItem(TF_EQUITY_CHART_MODE_KEY, equityChartMode);
}
catch (e) { }
}
function tf_syncEquityChartModeButtonsUI() {
try {
const wrap = document.getElementById('tf-equity-chartmode-buttons');
if (!wrap)
return;
const btns = wrap.querySelectorAll('button[data-mode]');
Array.prototype.forEach.call(btns, function (b) {
const m = b.getAttribute('data-mode');
if (m === equityChartMode)
b.classList.add('active');
else
b.classList.remove('active');
});
}
catch (e) { }
}
const TF_EQUITY_LOG_SCALE_KEY = 'tf_equity_log_scale_v1';
let equityLogScaleEnabled = false;
function tf_loadEquityLogScalePreference() {
try {
const raw = localStorage.getItem(TF_EQUITY_LOG_SCALE_KEY);
equityLogScaleEnabled = (raw === '1');
}
catch (e) {
equityLogScaleEnabled = false;
}
}
function tf_saveEquityLogScalePreference() {
try {
localStorage.setItem(TF_EQUITY_LOG_SCALE_KEY, equityLogScaleEnabled ? '1' : '0');
}
catch (e) { }
}
function tf_syncEquityLogScaleButtonUI() {
try {
const btn = document.getElementById('tf-equity-log-btn');
if (!btn)
return;
if (equityLogScaleEnabled)
btn.classList.add('active');
else
btn.classList.remove('active');
}
catch (e) { }
}
let equityDailyCandles = [];
let equityCandleViewStart = 0;
let equityCandleViewEnd = null;
let equityCandleHoverIndex = null;
let equityCandleIsDragging = false;
let equityCandleDragStartX = 0;
let equityCandleDragStartStart = 0;
let equityCandleDrawMetrics = null;
// REV295: touchscreen Equity interaction state.
let tfEquityTouchActive = false;
let tfEquityTouchStartX = 0;
let tfEquityTouchStartY = 0;
let tfEquityTouchHideTimer = 0;
let tfEquityPinchActive = false;
let tfEquityPinchStartDistance = 0;
let tfEquityPinchStartSpan = 0;
let tfEquityPinchAnchorIndex = 0;
let tfEquityPinchAnchorFrac = 0.5;
function tf_markEquityCandleViewportForFullReset() {
try {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
equityCandleHoverIndex = null;
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
}
catch (e) { }
}
function tf_resetEquityCandleViewportToFull() {
try {
equityCandleViewStart = 0;
equityCandleViewEnd = (Array.isArray(equityDailyCandles) ? (equityDailyCandles.length - 1) : null);
}
catch (e) {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
}
}
function tf_clampEquityCandleViewport() {
const n = Array.isArray(equityDailyCandles) ? equityDailyCandles.length : 0;
if (!n) {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
return;
}
if (equityCandleViewEnd === null || !isFinite(equityCandleViewEnd))
equityCandleViewEnd = n - 1;
equityCandleViewStart = Math.max(0, Math.min(n - 1, Math.floor(equityCandleViewStart || 0)));
equityCandleViewEnd = Math.max(0, Math.min(n - 1, Math.floor(equityCandleViewEnd || 0)));
if (equityCandleViewEnd < equityCandleViewStart) {
const tmp = equityCandleViewStart;
equityCandleViewStart = equityCandleViewEnd;
equityCandleViewEnd = tmp;
}
const minSpan = Math.min(10, n);
let span = equityCandleViewEnd - equityCandleViewStart + 1;
if (span < minSpan) {
const mid = (equityCandleViewStart + equityCandleViewEnd) / 2;
const half = Math.floor(minSpan / 2);
equityCandleViewStart = Math.max(0, Math.round(mid) - half);
equityCandleViewEnd = Math.min(n - 1, equityCandleViewStart + minSpan - 1);
if (equityCandleViewEnd - equityCandleViewStart + 1 < minSpan) {
equityCandleViewStart = Math.max(0, equityCandleViewEnd - minSpan + 1);
}
}
}
function tf_buildEquityDailyCandlesFromPoints(points) {
try {
if (!Array.isArray(points) || points.length < 2)
return [];
function tf_parseTs(pt) {
try {
if (!pt)
return null;
if (typeof pt.sortKey === 'number' && isFinite(pt.sortKey))
return pt.sortKey;
const raw = String(pt.date || pt.displayDate || '').trim();
if (!raw)
return null;
const parsed = Date.parse(raw);
if (!isNaN(parsed))
return parsed;
const s = raw.replace(/\s*(WIB\s*)+$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
}
catch (e) {
return null;
}
}
const out = [];
let cur = null;
for (let i = 1; i < points.length; i++) {
const p = points[i];
const ts = tf_parseTs(p);
if (!ts)
continue;
const d = new Date(ts);
const dayTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const dayKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const prev = points[i - 1];
const prevEq = prev && typeof prev.equity === 'number' && isFinite(prev.equity) ? prev.equity : 0;
const nowEq = p && typeof p.equity === 'number' && isFinite(p.equity) ? p.equity : prevEq;
const analystName = (!p.isWithdraw && typeof p.analyst === 'string') ? String(p.analyst).trim() : '';
if (!cur || cur.dayKey !== dayKey) {
cur = {
dayKey: dayKey,
dayTs: dayTs,
label: (function () {
try {
const dd = String(d.getDate()).padStart(2, '0');
const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()] || '';
const yy = d.getFullYear();
return dd + ' ' + mo + ' ' + yy;
}
catch (e) {
return dayKey;
}
})(),
open: prevEq,
high: Math.max(prevEq, nowEq),
low: Math.min(prevEq, nowEq),
close: nowEq,
analysts: [],
_analystSet: new Set(),
startPointIndex: i,
endPointIndex: i,
sumPnlDollar: (typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar)) ? p.pnlDollar : 0,
sumPnlPips: (typeof p.pnlPips === 'number' && isFinite(p.pnlPips)) ? p.pnlPips : 0,
sumDollarTP: (typeof p.dollarTP === 'number' && isFinite(p.dollarTP)) ? p.dollarTP : 0,
sumDollarSL: (typeof p.dollarSL === 'number' && isFinite(p.dollarSL)) ? p.dollarSL : 0,
hasWithdraw: !!p.isWithdraw
};
out.push(cur);
if (analystName) {
try {
if (!cur._analystSet.has(analystName)) {
cur._analystSet.add(analystName);
cur.analysts.push(analystName);
}
}
catch (e) { }
}
}
else {
cur.endPointIndex = i;
cur.close = nowEq;
if (nowEq > cur.high)
cur.high = nowEq;
if (nowEq < cur.low)
cur.low = nowEq;
cur.sumPnlDollar += (typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar)) ? p.pnlDollar : 0;
cur.sumPnlPips += (typeof p.pnlPips === 'number' && isFinite(p.pnlPips)) ? p.pnlPips : 0;
cur.sumDollarTP += (typeof p.dollarTP === 'number' && isFinite(p.dollarTP)) ? p.dollarTP : 0;
cur.sumDollarSL += (typeof p.dollarSL === 'number' && isFinite(p.dollarSL)) ? p.dollarSL : 0;
if (p.isWithdraw)
cur.hasWithdraw = true;
if (analystName) {
try {
if (!cur._analystSet)
cur._analystSet = new Set();
if (!cur._analystSet.has(analystName)) {
cur._analystSet.add(analystName);
if (!Array.isArray(cur.analysts))
cur.analysts = [];
cur.analysts.push(analystName);
}
}
catch (e) { }
}
}
}
try {
for (let k = 0; k < out.length; k++) {
const c = out[k];
if (!c)
continue;
if (Array.isArray(c.analysts)) {
c.analysts = c.analysts
.map((x) => String(x || '').trim())
.filter(Boolean)
.sort((a, b) => a.localeCompare(b));
}
else {
c.analysts = [];
}
if (c._analystSet)
delete c._analystSet;
}
}
catch (e) { }
return out;
}
catch (e) {
return [];
}
}
function setupEquityLogScaleToggle() {
try {
tf_loadEquityLogScalePreference();
}
catch (e) { }
try {
tf_syncEquityLogScaleButtonUI();
}
catch (e) { }
const btn = document.getElementById('tf-equity-log-btn');
if (!btn)
return;
btn.addEventListener('click', function () {
equityLogScaleEnabled = !equityLogScaleEnabled;
tf_saveEquityLogScalePreference();
tf_syncEquityLogScaleButtonUI();
try {
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
drawEquityCurve();
});
}
let lastHistoryRowsForExport = [];
const tf_historyRowEnabledMap = new Map();
const tf_historyRowManualOverrideSet = new Set();
function tf_closedKeyOf(row) {
try {
const k = row && row.sortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
}
catch (e) {
return 0;
}
}
function tf_createdKeyOf(row) {
try {
const k = row && row.createdSortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
}
catch (e) {
return 0;
}
}
let tf_lastVisibleHistoryRowIds = [];
let tf_lastEligibleHistoryRowIds = [];
let tf_historyScrollRestoreTop = null;
let tf_historyScrollRestoreLeft = null;
function tf_captureHistoryTableScrollForRestore() {
try {
const section = document.getElementById('section-history');
if (!section)
return;
const scrollDiv = section.querySelector('.table-scroll');
if (!scrollDiv)
return;
tf_historyScrollRestoreTop = scrollDiv.scrollTop;
tf_historyScrollRestoreLeft = scrollDiv.scrollLeft;
}
catch (e) { }
}
function tf_restoreHistoryTableScrollIfRequested(scrollDiv) {
try {
if (!scrollDiv)
return false;
const hasTop = (tf_historyScrollRestoreTop !== null && Number.isFinite(tf_historyScrollRestoreTop));
const hasLeft = (tf_historyScrollRestoreLeft !== null && Number.isFinite(tf_historyScrollRestoreLeft));
if (!hasTop && !hasLeft)
return false;
const top = hasTop ? tf_historyScrollRestoreTop : null;
const left = hasLeft ? tf_historyScrollRestoreLeft : null;
tf_historyScrollRestoreTop = null;
tf_historyScrollRestoreLeft = null;
if (top !== null) {
const maxTop = Math.max(0, (scrollDiv.scrollHeight || 0) - (scrollDiv.clientHeight || 0));
scrollDiv.scrollTop = Math.max(0, Math.min(top, maxTop));
}
if (left !== null) {
const maxLeft = Math.max(0, (scrollDiv.scrollWidth || 0) - (scrollDiv.clientWidth || 0));
scrollDiv.scrollLeft = Math.max(0, Math.min(left, maxLeft));
}
return true;
}
catch (e) {
try {
tf_historyScrollRestoreTop = null;
tf_historyScrollRestoreLeft = null;
}
catch (e2) { }
return false;
}
}
function tf_isHistoryRowEligibleForAllToggle(row) {
try {
if (!row)
return false;
if (row.isWithdraw)
return true;
if (row.__tfAutoUnticked)
return false;
return true;
}
catch (e) {
return true;
}
}
function tf_historyRowId(row) {
try {
if (!row)
return '';
if (row.__tfRowId)
return String(row.__tfRowId);
const a = (row.analyst || '').trim();
const p = (row.pair || '').trim();
const ck = tf_closedKeyOf(row) || 0;
const crk = tf_createdKeyOf(row) || 0;
const kind = row.isWithdraw ? 'withdraw' : 'trade';
const extra = row.isWithdraw
? (String(row.displayDate || row.createdDate || '') + '|' + String(row.pnlDollar || row.dollarTP || 0))
: (String((row.pnlPips != null ? row.pnlPips : row.pips) || ''));
const id = kind + '|' + a + '|' + p + '|' + crk + '|' + ck + '|' + extra;
row.__tfRowId = id;
return id;
}
catch (e) {
return '';
}
}
function tf_isHistoryRowEnabled(rowOrId) {
const id = (typeof rowOrId === 'string') ? rowOrId : tf_historyRowId(rowOrId);
if (!id)
return true;
if (!tf_historyRowEnabledMap.has(id))
return true;
return !!tf_historyRowEnabledMap.get(id);
}
function tf_setHistoryRowEnabled(rowOrId, enabled) {
const id = (typeof rowOrId === 'string') ? rowOrId : tf_historyRowId(rowOrId);
if (!id)
return;
try {
tf_historyRowManualOverrideSet.add(id);
}
catch (e) { }
tf_historyRowEnabledMap.set(id, !!enabled);
}
function tf_initAutoUntickStartOfMonthRule(rowsSortedByClosed) {
try {
if (!Array.isArray(rowsSortedByClosed) || rowsSortedByClosed.length === 0)
return;
try {
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r0 = rowsSortedByClosed[i];
if (!r0)
continue;
const id0 = tf_historyRowId(r0);
if (!id0)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id0))
continue;
if (tf_historyRowEnabledMap.has(id0))
tf_historyRowEnabledMap.delete(id0);
}
}
catch (e) { }
const timeRangeActive = String(tfTradeTimeRangeKey || 'all') !== 'all';
let isCustomDateFilter = false;
try {
if (equityFilterStart !== null && equityFilterEnd !== null) {
if (equityFilterMin !== null && equityFilterMax !== null) {
const s = tf_dayKey(equityFilterStart);
const e = tf_dayKey(equityFilterEnd);
const mn = tf_dayKey(equityFilterMin);
const mx = tf_dayKey(equityFilterMax);
if (s !== null && e !== null && mn !== null && mx !== null) {
isCustomDateFilter = (s !== mn) || (e !== mx);
}
else {
isCustomDateFilter = true;
}
}
else {
isCustomDateFilter = true;
}
}
}
catch (e) { }
let firstClosedKey = null;
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r = rowsSortedByClosed[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
if (firstClosedKey === null || ck < firstClosedKey)
firstClosedKey = ck;
}
if (firstClosedKey === null)
return;
const firstMonthKey = tf_monthKeyFromSortKey(firstClosedKey);
if (!firstMonthKey)
return;
let thresholdDay = null;
// REV224: for the per-calendar-month selector, the boundary must be the
// first day of the selected month, NOT the first trade's Closed At day.
// Otherwise a valid trade created earlier in the same month (for example
// Created 22-Jun, Closed 23-Jun) is incorrectly auto-unticked, which makes
// Performance/Probability and Equity Curve appear empty. Carry-over trades
// created before the selected month are still excluded by this rule.
if (tfTradeSingleMonthKey) {
try {
const mm = String(tfTradeSingleMonthKey || '').match(/^(\d{4})-(\d{2})$/);
if (mm) {
const yy = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
if (Number.isFinite(yy) && Number.isFinite(mo) && mo >= 1 && mo <= 12)
thresholdDay = new Date(yy, mo - 1, 1, 0, 0, 0, 0).getTime();
}
}
catch (e) { }
if (thresholdDay === null)
thresholdDay = tf_dayKey(firstClosedKey);
}
else if (isCustomDateFilter || timeRangeActive) {
thresholdDay = tf_dayKey(firstClosedKey);
}
else {
return;
}
if (thresholdDay === null)
return;
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r = rowsSortedByClosed[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
const mk = tf_monthKeyFromSortKey(ck);
if (mk !== firstMonthKey)
continue;
const crk = tf_createdKeyOf(r);
const createdDay = tf_dayKey(crk);
if (createdDay === null)
continue;
if (createdDay < thresholdDay) {
const id = tf_historyRowId(r);
if (!id)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id))
continue;
tf_historyRowEnabledMap.set(id, false);
r.__tfAutoUnticked = true;
}
}
}
catch (e) { }
}
function tf_recomputeBalancesSkippingDisabled(rowsForUi, startingBalance, rm) {
try {
if (!Array.isArray(rowsForUi) || rowsForUi.length === 0)
return;
const risk = (rm === 'compound') ? 'compound' : 'fixed';
const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
rowsForUi.sort((a, b) => {
const ak = (a && typeof a.sortKey === 'number' && isFinite(a.sortKey)) ? a.sortKey : 0;
const bk = (b && typeof b.sortKey === 'number' && isFinite(b.sortKey)) ? b.sortKey : 0;
return ak - bk;
});
let firstMonthKey = null;
for (let i = 0; i < rowsForUi.length; i++) {
const r = rowsForUi[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
firstMonthKey = tf_monthKeyFromSortKey(ck);
break;
}
const monthKeys = [];
const seen = new Set();
for (let i = 0; i < rowsForUi.length; i++) {
const r = rowsForUi[i];
if (!r)
continue;
const ck = tf_closedKeyOf(r) || tf_createdKeyOf(r) || 0;
const mk = tf_monthKeyFromSortKey(ck);
if (!mk)
continue;
if (!seen.has(mk)) {
seen.add(mk);
monthKeys.push(mk);
}
}
const monthIndexFromKey = (mk) => {
const m = String(mk || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return y * 12 + (mo - 1);
};
const keyFromMonthIndex = (idx) => {
const y = Math.floor(idx / 12);
const mo = (idx % 12) + 1;
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
};
let fullMonthKeys = monthKeys.slice();
if (monthKeys.length >= 2) {
const firstIdx = monthIndexFromKey(monthKeys[0]);
const lastIdx = monthIndexFromKey(monthKeys[monthKeys.length - 1]);
if (firstIdx !== null && lastIdx !== null && lastIdx >= firstIdx) {
fullMonthKeys = [];
for (let mi = firstIdx; mi <= lastIdx; mi++) {
fullMonthKeys.push(keyFromMonthIndex(mi));
}
}
}
if (!firstMonthKey && fullMonthKeys.length)
firstMonthKey = fullMonthKeys[0];
const periodMonths = (risk === 'compound') ? Math.max(1, Math.min(12, Math.floor(Number(compoundMonths) || 1))) : 1;
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[fullMonthKeys[i]] = fullMonthKeys[startIndex] || fullMonthKeys[i];
}
let runningEquity = startBal;
let runningTradeOnly = startBal;
let currentMonthKey = null;
let currentPeriodStartKey = null;
let sizingBase = startBal;
const lotCache = new Map();
const clearLotCache = () => { try {
lotCache.clear();
}
catch (e) { } };
const slPipsCache = new Map();
const tf_getEffectiveSlPipsForRecompute = (analystName, pair) => {
try {
const a = (analystName || '').trim();
const p = pair ? String(pair).toUpperCase() : '';
const key = a + '|' + p;
if (slPipsCache.has(key))
return slPipsCache.get(key) || 0;
let v = 0;
try {
const stats = computeSlStatsFromHistory(a, p || null);
const eff = getEffectiveSlForAnalyst(a, p || null, stats);
v = (eff && Number.isFinite(eff.pips) && eff.pips > 0) ? eff.pips : 0;
}
catch (e2) {
v = 0;
}
slPipsCache.set(key, v);
return v;
}
catch (e) {
return 0;
}
};
const isFirstDayWithdrawRow = (row, mk) => {
try {
if (!row || !row.isWithdraw || !mk)
return false;
const fd = tf_firstDaySortKeyFromMonthKey(mk);
const d1 = tf_dayKey(fd);
const d2 = tf_dayKey(tf_createdKeyOf(row) || tf_closedKeyOf(row) || 0);
if (d1 === null || d2 === null)
return false;
return d1 === d2;
}
catch (e) {
return false;
}
};
const enterMonth = (mk) => {
currentMonthKey = mk;
const pStart = monthToPeriodStart[mk] || mk;
if (risk !== 'compound') {
sizingBase = startBal;
return;
}
if (currentPeriodStartKey !== pStart) {
currentPeriodStartKey = pStart;
sizingBase = (mk === firstMonthKey) ? startBal : runningEquity;
clearLotCache();
}
};
if (fullMonthKeys.length && !currentMonthKey) {
enterMonth(fullMonthKeys[0]);
}
for (let i = 0; i < rowsForUi.length; i++) {
const row = rowsForUi[i];
if (!row)
continue;
const ck = tf_closedKeyOf(row) || 0;
const mk = tf_monthKeyFromSortKey(ck) || tf_monthKeyFromSortKey(tf_createdKeyOf(row) || 0);
if (mk && mk !== currentMonthKey) {
enterMonth(mk);
}
else if (!currentMonthKey && mk) {
enterMonth(mk);
}
const enabled = tf_isHistoryRowEnabled(row);
if (row.isWithdraw) {
const before = runningEquity;
const pnl = Number.isFinite(row.pnlDollar) ? row.pnlDollar
: ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
if (enabled) {
runningEquity += pnl;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
row.balanceCompound = (risk === 'compound') ? before : startBal;
if (risk === 'compound' && enabled && mk && isFirstDayWithdrawRow(row, mk)) {
sizingBase = runningEquity;
clearLotCache();
}
continue;
}
if (risk !== 'compound') {
const pnlDollar = Number.isFinite(row.pnlDollar) ? row.pnlDollar
: ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
if (enabled) {
runningTradeOnly += pnlDollar;
runningEquity += pnlDollar;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
row.balanceCompound = startBal;
continue;
}
const analyst = (row.analyst || '').trim();
const pair = (row.pair || '').trim();
const pnlPips = Number.isFinite(row.pnlPips) ? row.pnlPips
: (Number.isFinite(row.pips) ? row.pips : (Number(row.pips) || 0));
row.pnlPips = pnlPips;
const riskPercent = Math.max(0, Number(row.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(row.dollarPerPip) || 0);
const slPips = tf_getEffectiveSlPipsForRecompute(analyst, pair);
const baseKey = Number.isFinite(sizingBase) ? Math.round(sizingBase * 100) : 0;
const cacheKey = (currentPeriodStartKey || '') + '|' + (currentMonthKey || '') + '|' + analyst + '|' + pair
+ '|B' + baseKey + '|R' + Math.round(riskPercent * 1000) + '|D' + Math.round(dollarPerPip * 10000) + '|S' + Math.round(slPips * 1000);
let lot = 0;
if (lotCache.has(cacheKey)) {
lot = lotCache.get(cacheKey) || 0;
}
else {
let calcLot = 0;
const baseForLot = Math.max(0, Number(sizingBase) || 0);
if (baseForLot > 0 && slPips > 0 && dollarPerPip > 0) {
calcLot = computeLot(baseForLot, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(calcLot) || calcLot <= 0)
calcLot = 0;
else
calcLot = roundLotToTwoDecimals(calcLot);
}
lotCache.set(cacheKey, calcLot);
lot = calcLot;
}
row.lot = lot;
row.balanceCompound = sizingBase;
const pnlDollar = (Number.isFinite(pnlPips) && Number.isFinite(lot) && Number.isFinite(dollarPerPip))
? (pnlPips * lot * dollarPerPip)
: 0;
row.pnlDollar = pnlDollar;
row.pipsTP = pnlPips > 0 ? pnlPips : 0;
row.pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
row.dollarTP = pnlDollar > 0 ? pnlDollar : 0;
row.dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(Number(sizingBase) || 0);
row.pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
if (enabled) {
runningTradeOnly += pnlDollar;
runningEquity += pnlDollar;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
}
}
catch (e) {
}
}
let tf_lastEquityCalcRows = [];
let lastHistoryRiskMode = 'fixed';
let equityFilterMin = null;
let equityFilterMax = null;
let equityFilterStart = null;
let equityFilterEnd = null;
let equityMetric = 'usd';
const EQUITY_METRIC_STORAGE_KEY = 'tf_equity_metric';
let riskMode = 'fixed';
const RISK_MODE_STORAGE_KEY = 'tf_risk_mode';
let compoundMonths = 1;
const COMPOUND_MONTHS_STORAGE_KEY = 'tf_compound_months';
function formatMoney(value) {
if (!isFinite(value))
return '-';
return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function formatPlainNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
const v = Number(value);
const absStr = Math.abs(v).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return v < 0 ? ('-' + absStr) : absStr;
}
function formatSignedMoney(value) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatMoney(abs);
if (value < 0) {
return '-' + base;
}
if (value > 0) {
return '+' + base;
}
return base;
}
function formatNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals);
}
function formatPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals) + ' pips';
}
function formatSignedPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatPips(abs, decimals);
if (value < 0)
return '-' + base;
if (value > 0)
return '+' + base;
return formatPips(0, decimals);
}
function loadEquityMetricPreference() {
try {
const saved = localStorage.getItem(EQUITY_METRIC_STORAGE_KEY);
if (saved === 'usd' || saved === 'pips') {
equityMetric = saved;
}
}
catch (e) {
}
}
function saveEquityMetricPreference() {
try {
localStorage.setItem(EQUITY_METRIC_STORAGE_KEY, equityMetric);
}
catch (e) {
}
}
function loadRiskModePreference() {
// REV177: Fixed Lot is always the default whenever the page is opened.
// Users can still switch to Compound % for the current session.
riskMode = 'fixed';
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, 'fixed');
}
catch (e) {
}
}
function loadCompoundMonthsPreference() {
try {
const saved = parseInt(localStorage.getItem(COMPOUND_MONTHS_STORAGE_KEY), 10);
if (Number.isFinite(saved) && saved >= 1 && saved <= 12) {
compoundMonths = saved;
}
}
catch (e) {
}
}
function saveCompoundMonthsPreference() {
try {
localStorage.setItem(COMPOUND_MONTHS_STORAGE_KEY, String(compoundMonths));
}
catch (e) {
}
}
function tf_monthKeyFromSortKey(sortKey) {
if (typeof sortKey === 'number' && isFinite(sortKey)) {
const d = new Date(sortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
return String(yyyy).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
}
}
else if (typeof sortKey === 'string' && sortKey.length >= 7) {
const candidate = sortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate))
return candidate;
}
return null;
}
function tf_getPrimarySortKey(row) {
try {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
}
catch (e) { }
return null;
}
function tf_firstDaySortKeyFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
const d = new Date(y, mo - 1, 1, 0, 0, 0, 0);
const ms = d.getTime();
return (typeof ms === 'number' && isFinite(ms)) ? ms : null;
}
function tf_firstDayDisplayDateFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return '';
const yyyy = m[1];
const mm = m[2];
return `01-${mm}-${yyyy}`;
}
function tf_shiftMonthKey(monthKey, deltaMonths) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
let y = parseInt(m[1], 10);
let mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
mo += (Number.isFinite(deltaMonths) ? deltaMonths : 0);
while (mo <= 0) {
mo += 12;
y -= 1;
}
while (mo > 12) {
mo -= 12;
y += 1;
}
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
}
function tf_setCompoundSubRowsVisible(isVisible) {
const ids = ['compound-sub-row-equity', 'compound-sub-row-history', 'compound-sub-row-monthly'];
ids.forEach((id) => {
const el = document.getElementById(id);
if (!el)
return;
el.style.display = isVisible ? '' : 'none';
});
}
function tf_updateHistoryBalanceHeaderLabel(currentRiskMode) {
const th = document.getElementById('history-balance-base-th');
if (!th)
return;
th.textContent = currentRiskMode === 'compound' ? 'Balance Compounded' : 'Balance';
}
function tf_setRiskModeRowsVisible(isVisible) {
const selIds = ['risk-mode-select', 'risk-mode-select-history', 'risk-mode-select-monthly'];
selIds.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
const row = sel.closest ? sel.closest('.equity-filter-row') : null;
if (!row)
return;
row.style.display = isVisible ? '' : 'none';
});
}
function tf_getAllRiskModeSelects() {
return Array.from(document.querySelectorAll('#risk-mode-select, #risk-mode-select-history, #risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, fallbackBalance) {
const offset = Number.isFinite(compoundMonths) ? Math.max(1, Math.min(12, Math.floor(compoundMonths))) : 1;
const targetKey = tf_shiftMonthKey(monthKey, -offset);
if (targetKey && monthEndBalanceMap) {
let k = targetKey;
for (let i = 0; i < 36 && k; i++) {
if (Object.prototype.hasOwnProperty.call(monthEndBalanceMap, k)) {
const v = monthEndBalanceMap[k];
if (Number.isFinite(v))
return v;
}
k = tf_shiftMonthKey(k, -1);
}
}
if (Number.isFinite(fallbackBalance))
return fallbackBalance;
return Number.isFinite(currentBalance) ? currentBalance : 0;
}
function saveRiskModePreference() {
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, riskMode);
}
catch (e) {
}
}
function formatEquityMetricAxis(value) {
if (equityMetric === 'usd')
return formatMoney(value);
if (!isFinite(value))
return '-';
return value.toFixed(1);
}
function formatEquityMetricSigned(value) {
return equityMetric === 'usd' ? formatSignedMoney(value) : formatSignedPips(value, 1);
}
function formatEquityMetricValue(value) {
return equityMetric === 'usd' ? formatMoney(value) : formatPips(value, 1);
}
function updateEquityCurveCopyForMetric() {
const titleEl = document.getElementById('equity-curve-title');
const badgeEl = document.getElementById('equity-curve-badge-text');
if (titleEl) {
titleEl.textContent =
equityMetric === 'usd'
? 'Equity Curve – Akumulasi $ per Trade'
: 'Equity Curve – Akumulasi Pips per Trade';
}
if (badgeEl) {
badgeEl.textContent =
equityMetric === 'usd'
? 'Hover untuk detail $ dan Equity'
: 'Hover untuk detail Pips dan Akumulasi';
}
}
function tf_updateUiForEquityMetric() {
try {
const isUsd = (equityMetric === 'usd');
try {
tf_setRiskModeRowsVisible(isUsd);
}
catch (e) { }
try {
tf_setCompoundSubRowsVisible(isUsd && (riskMode === 'compound'));
}
catch (e) { }
const withdrawToggleMain = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInputMain = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelectMain = document.getElementById('withdraw-months-select');
const withdrawSubmitBtnMain = document.getElementById('withdraw-submit-btn');
const withdrawToggleEq = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEq = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEq = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEq = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawGroups = [
{ toggle: withdrawToggleMain, amount: withdrawAmountInputMain, months: withdrawMonthsSelectMain, submit: withdrawSubmitBtnMain },
{ toggle: withdrawToggleEq, amount: withdrawAmountInputEq, months: withdrawMonthsSelectEq, submit: withdrawSubmitBtnEq },
{ toggle: withdrawToggleHistory, amount: withdrawAmountInputHistory, months: withdrawMonthsSelectHistory, submit: withdrawSubmitBtnHistory }
];
const disabledTitle = isUsd ? '' : 'Tidak tersedia saat Filter by: PnL Pips';
withdrawGroups.forEach((g) => {
[g.toggle, g.amount, g.months, g.submit].forEach((el) => {
if (!el)
return;
el.disabled = !isUsd;
if (!isUsd)
el.title = disabledTitle;
});
});
if (isUsd) {
withdrawGroups.forEach((g) => {
if (g.submit && g.toggle) {
g.submit.disabled = !g.toggle.checked;
g.submit.title = g.toggle.checked ? '' : 'Enable Withdraw to apply';
}
});
}
}
catch (e) { }
}
function computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const riskAmount = (balance * riskPercent) / 100;
const denom = pipsPerTrade * dollarPerPip;
if (denom <= 0)
return 0;
return riskAmount / denom;
}
function roundLotToTwoDecimals(lot) {
if (!Number.isFinite(lot) || lot <= 0)
return 0;
const scaled = lot * 100;
const scaledFloor = Math.floor(scaled);
const diff = scaled - scaledFloor;
let roundedScaled;
if (diff > 0.5) {
roundedScaled = scaledFloor + 1;
}
else {
roundedScaled = scaledFloor;
}
return roundedScaled / 100;
}
function computeFixedLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const rawLot = computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip);
return roundLotToTwoDecimals(rawLot);
}
function safeParseFloat(v) {
const n = parseFloat(v);
return isNaN(n) ? null : n;
}
function parseDateFromInputs(dateStr, timeStr) {
const parts = (dateStr || '').trim().split('-');
if (parts.length !== 3)
return null;
const [ddStr, mmStr, yyyyStr] = parts;
const dd = parseInt(ddStr, 10);
const mm = parseInt(mmStr, 10);
const yyyy = parseInt(yyyyStr, 10);
let hh = 0;
let min = 0;
if ((timeStr || '').trim()) {
const tParts = timeStr.trim().split(':');
if (tParts.length >= 2) {
hh = parseInt(tParts[0], 10) || 0;
min = parseInt(tParts[1], 10) || 0;
}
}
if (!dd || !mm || !yyyy)
return null;
return new Date(yyyy, mm - 1, dd, hh, min).getTime();
}
function formatDateInputFromSortKey(sortKey) {
if (typeof sortKey !== 'number' || !isFinite(sortKey))
return '';
const d = new Date(sortKey);
const yyyy = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return yyyy + '-' + mm + '-' + dd;
}
function parseDateInputToSortKey(dateStr) {
if (!dateStr)
return null;
const parts = dateStr.split('-');
if (parts.length !== 3)
return null;
const yyyy = parseInt(parts[0], 10);
const mm = parseInt(parts[1], 10);
const dd = parseInt(parts[2], 10);
if (!yyyy || !mm || !dd)
return null;
return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).getTime();
}
function tf_dayKey(ts) {
if (typeof ts !== 'number' || !isFinite(ts))
return null;
const s = formatDateInputFromSortKey(ts);
return parseDateInputToSortKey(s);
}
function tf_filterRowsByUnifiedDate(rows) {
if (!Array.isArray(rows) || rows.length === 0)
return [];
if (equityFilterStart === null || equityFilterEnd === null)
return rows.slice();
const startDay = tf_dayKey(equityFilterStart);
const endDay = tf_dayKey(equityFilterEnd);
if (startDay === null || endDay === null)
return rows.slice();
const lo = Math.min(startDay, endDay);
const hi = Math.max(startDay, endDay);
return rows.filter((row) => {
const k = tf_getPrimarySortKey(row);
const day = tf_dayKey(k);
if (day === null)
return false;
return day >= lo && day <= hi;
});
}
function tf_applyStartTradeCreatedClosedRule(rows) {
const arr = Array.isArray(rows) ? rows.slice() : [];
try {
return arr.filter(r => tf_isHistoryRowEnabled(r));
}
catch (e) {
return arr;
}
}
function tf_getHistoryRowsForUiAndExport(baseRows) {
const byDate = tf_filterRowsByUnifiedDate(baseRows);
tf_initAutoUntickStartOfMonthRule(byDate);
try {
for (let i = 0; i < byDate.length; i++) {
const r = byDate[i];
if (!r || !r.isWithdraw)
continue;
if (!r.__tfWithdrawAutoUntick)
continue;
const id = tf_historyRowId(r);
if (!id)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id))
continue;
tf_historyRowEnabledMap.set(id, false);
r.__tfWithdrawAutoUnticked = true;
}
}
catch (e) { }
try {
for (let i = 0; i < byDate.length; i++) {
const r = byDate[i];
if (!r)
continue;
r.__tfRowId = tf_historyRowId(r);
r.__tfEnabled = tf_isHistoryRowEnabled(r.__tfRowId);
}
}
catch (e) { }
return byDate;
}
function tf_syncHistoryDateInputsFromState() {
const startInput = document.getElementById('history-start-date');
const endInput = document.getElementById('history-end-date');
if (!startInput || !endInput)
return;
if (equityFilterMin === null || equityFilterMax === null)
return;
const minStr = formatDateInputFromSortKey(equityFilterMin);
const maxStr = formatDateInputFromSortKey(equityFilterMax);
startInput.min = minStr;
startInput.max = maxStr;
endInput.min = minStr;
endInput.max = maxStr;
if (equityFilterStart !== null)
startInput.value = formatDateInputFromSortKey(equityFilterStart);
if (equityFilterEnd !== null)
endInput.value = formatDateInputFromSortKey(equityFilterEnd);
}
function renderSummaryTable() {
const tbody = document.querySelector('#summary-table tbody');
if (!tbody)
return;
tbody.innerHTML = '';
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0) {
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
const priceBusy = tf_isMyfxbookPriceLoading();
filteredAnalysts.forEach((a) => {
if (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object') {
const baseName = a.baseName || a.name;
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (Array.isArray(mapEntry)) {
const rowPair = tf_normPairKey(a.pair || '');
if (!rowPair) {
return;
}
const match = mapEntry.some((p) => tf_normPairKey(p) === rowPair);
if (!match) {
return;
}
}
}
else if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const apairs = Array.isArray(a.pairs) ? a.pairs : [];
const ok = apairs.length === 0 || apairs.some((p) => selectedPairs.includes(p));
if (!ok) {
return;
}
}
const baseName = a.baseName || a.name;
const rowPair = (a.pair || getPrimaryPairForAnalyst(a) || null);
const stats = computeSlStatsFromHistory(baseName, rowPair);
const effective = getEffectiveSlForAnalyst(baseName, rowPair, stats);
const slType = effective.type;
const effectiveSlPips = effective.pips || 0;
const primaryPair = getPrimaryPairForAnalyst(a);
const dollarPerPip = getDollarPerPipForAnalyst(a, rowPair || primaryPair);
const riskPercent = getRiskPercentForAnalyst(baseName, rowPair || primaryPair);
let rawLot = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(currentBalance, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
let lot = roundLotToTwoDecimals(rawLot);
const tr = document.createElement('tr');
const nameCell = document.createElement('td');
nameCell.textContent = a.baseName || a.name;
nameCell.classList.add('monthly-sticky-col-2');
tr.appendChild(nameCell);
const pairCell = document.createElement('td');
pairCell.textContent = rowPair ? String(rowPair).toUpperCase() : '-';
tr.appendChild(pairCell);
const selectorCell = document.createElement('td');
const slSelect = document.createElement('select');
slSelect.className = 'form-input';
slSelect.style.padding = '2px 4px';
slSelect.classList.add('sltype-select');
slSelect.style.fontSize = '9.9px';
slSelect.style.maxWidth = '126px';
slSelect.style.width = '126px';
slSelect.style.overflow = 'hidden';
slSelect.style.textOverflow = 'ellipsis';
slSelect.title = 'SL Type';
const fixedOption = document.createElement('option');
fixedOption.value = 'fixed';
fixedOption.textContent = 'SL FIXED PIPS (Avg 6M)';
fixedOption.title = 'SL FIXED PIPS (Avg. 6 Months)';
if (!stats.fixed || stats.fixedCount < 5) {
fixedOption.disabled = true;
}
const avgOption = document.createElement('option');
avgOption.value = 'avg';
avgOption.textContent = 'Avg. SL PIPS';
if (!stats.avg) {
avgOption.disabled = true;
}
slSelect.appendChild(fixedOption);
slSelect.appendChild(avgOption);
if (slType && !slSelect.querySelector('option[value="' + slType + '"]')?.disabled) {
slSelect.value = slType;
}
else if (!fixedOption.disabled) {
slSelect.value = 'fixed';
}
else if (!avgOption.disabled) {
slSelect.value = 'avg';
}
else {
slSelect.value = '';
}
slSelect.addEventListener('change', () => {
const val = slSelect.value;
if (val === 'fixed' || val === 'avg') {
setSelectedSlTypeForAnalyst(baseName, rowPair || primaryPair, val);
}
else {
setSelectedSlTypeForAnalyst(baseName, rowPair || primaryPair, null);
}
renderSummaryTable();
});
selectorCell.appendChild(slSelect);
tr.appendChild(selectorCell);
const slFixedCell = document.createElement('td');
slFixedCell.className = 'text-right mono';
slFixedCell.style.color = '#ef4444';
if (stats.fixed && stats.fixedCount >= 5) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(stats.fixed, 2);
const line2 = document.createElement('div');
line2.textContent = stats.fixedCount + 'x';
slFixedCell.innerHTML = '';
slFixedCell.appendChild(line1);
slFixedCell.appendChild(line2);
if (rawLot > 0) {
if (priceBusy) {
const line3 = document.createElement('div');
line3.style.fontSize = '9.9px';
line3.className = 'monthly-cell-line monthly-val-positive';
line3.innerHTML = tf_spinnerHTML(true);
slFixedCell.appendChild(line3);
}
else if (dollarPerPip > 0) {
const dollarFixed = stats.fixed * rawLot * dollarPerPip;
if (Number.isFinite(dollarFixed) && dollarFixed > 0) {
const line3 = document.createElement('div');
line3.style.fontSize = '9.9px';
line3.className = 'monthly-cell-line monthly-val-positive';
line3.textContent = formatMoney(dollarFixed);
slFixedCell.appendChild(line3);
}
}
}
}
else {
slFixedCell.textContent = '-';
}
tr.appendChild(slFixedCell);
const slAvgCell = document.createElement('td');
slAvgCell.className = 'text-right mono';
slAvgCell.style.color = '#ef4444';
if (stats.avg) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(stats.avg, 2);
slAvgCell.innerHTML = '';
slAvgCell.appendChild(line1);
if (rawLot > 0) {
if (priceBusy) {
const line2 = document.createElement('div');
line2.style.fontSize = '9.9px';
line2.className = 'monthly-cell-line monthly-val-positive';
line2.innerHTML = tf_spinnerHTML(true);
slAvgCell.appendChild(line2);
}
else if (dollarPerPip > 0) {
const dollarAvg = stats.avg * rawLot * dollarPerPip;
if (Number.isFinite(dollarAvg) && dollarAvg > 0) {
const line2 = document.createElement('div');
line2.style.fontSize = '9.9px';
line2.className = 'monthly-cell-line monthly-val-positive';
line2.textContent = formatMoney(dollarAvg);
slAvgCell.appendChild(line2);
}
}
}
}
else {
slAvgCell.textContent = '-';
}
tr.appendChild(slAvgCell);
const lotCell = document.createElement('td');
lotCell.className = 'text-right mono';
lotCell.style.verticalAlign = 'middle';
if (priceBusy) {
lotCell.innerHTML = tf_spinnerHTML(true);
}
else if (lot > 0) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(lot, 2);
lotCell.appendChild(line1);
if (rawLot > 0) {
const line2 = document.createElement('div');
line2.style.fontSize = '9.9px';
line2.style.opacity = '0.8';
line2.textContent = '( ' + formatNumber(rawLot, 5) + ' )';
lotCell.appendChild(line2);
}
}
else {
lotCell.textContent = '-';
}
tr.appendChild(lotCell);
const dollarCell = document.createElement('td');
dollarCell.className = 'text-right mono';
if (priceBusy) {
dollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
dollarCell.textContent = dollarPerPip > 0 ? formatNumber(dollarPerPip, 2) : '-';
}
tr.appendChild(dollarCell);
const balanceCell = document.createElement('td');
balanceCell.className = 'text-right mono';
balanceCell.textContent = formatMoney(currentBalance);
tr.appendChild(balanceCell);
const riskCell = document.createElement('td');
riskCell.className = 'text-right mono';
const riskInput = document.createElement('input');
riskInput.type = 'number';
riskInput.inputMode = 'decimal';
riskInput.min = '0';
riskInput.step = '0.1';
riskInput.className = 'form-input mono tf-summary-risk-input';
riskInput.style.padding = '2px 4px';
riskInput.style.textAlign = 'left';
riskInput.style.width = '52.2px';
const analystRisk = getRiskPercentForAnalyst(baseName, rowPair || primaryPair);
riskInput.value = Number.isFinite(analystRisk) ? analystRisk.toString() : '';
riskInput.addEventListener('change', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
setAnalystRiskOverride(baseName, rowPair || primaryPair, null);
riskInput.value = formatNumber(currentRiskPercent, 2);
}
else {
setAnalystRiskOverride(baseName, rowPair || primaryPair, v);
}
renderSummaryTable();
recomputeHistoryRows();
});
riskCell.appendChild(riskInput);
tr.appendChild(riskCell);
tbody.appendChild(tr);
});
updateMonthlyTableCells();
}
function tf_renderAnalystPerformanceTablesFromRows(rows) {
try {
window.__tf_perf_last_rows = rows;
}
catch (e) { }
const wrap = document.getElementById("tf-perf-wrap");
const leftBody = document.getElementById("tf-perf-body-left");
const rightBody = document.getElementById("tf-perf-body-right");
const overallBox = document.getElementById("tf-perf-overall");
const overallFill = document.getElementById("tf-perf-overall-fill");
const overallPctEl = document.getElementById("tf-perf-overall-pct");
const overallCountEl = document.getElementById("tf-perf-overall-count");
const overallWinEl = document.getElementById("tf-perf-overall-win");
const overallLossEl = document.getElementById("tf-perf-overall-loss");
const metricSel = document.getElementById('tf-perf-metric-select');
const perfRiskSel = document.getElementById('tf-perf-risk-mode-select');
const perfRiskGroup = document.getElementById('tf-perf-risk-group');
const perfCompSel = document.getElementById('tf-perf-compound-months-select');
const perfCompGroup = document.getElementById('tf-perf-compound-group');
if (!wrap || !leftBody || !rightBody)
return;
const PERF_USD_RISK_KEY = 'tf_perf_usd_risk_mode_v1';
const PERF_USD_MONTHS_KEY = 'tf_perf_usd_compound_months_v1';
const tf_perf_getUsdRiskMode = () => {
try {
const v = String(localStorage.getItem(PERF_USD_RISK_KEY) || 'fixed');
return (v === 'fixed' || v === 'compound') ? v : 'fixed';
}
catch (e) {
return 'fixed';
}
};
const tf_perf_setUsdRiskMode = (v) => {
const next = (v === 'compound') ? 'compound' : 'fixed';
try {
localStorage.setItem(PERF_USD_RISK_KEY, next);
}
catch (e) { }
try {
if (perfRiskSel)
perfRiskSel.value = next;
}
catch (e) { }
return next;
};
const tf_perf_getUsdCompoundMonths = () => {
try {
const v = parseInt(localStorage.getItem(PERF_USD_MONTHS_KEY) || '1', 10);
if (Number.isFinite(v) && v >= 1 && v <= 12)
return v;
}
catch (e) { }
return 1;
};
const tf_perf_setUsdCompoundMonths = (v) => {
const next = Math.max(1, Math.min(12, Math.floor(Number(v) || 1)));
try {
localStorage.setItem(PERF_USD_MONTHS_KEY, String(next));
}
catch (e) { }
try {
if (perfCompSel)
perfCompSel.value = String(next);
}
catch (e) { }
return next;
};
const tf_perf_syncGlobalRiskModeFromPerf = (desiredRisk, desiredMonths) => {
return false;
};
const METRIC_KEY = 'tf_perf_metric_v1';
const tf_perf_getMetric = () => {
try {
const v = (metricSel && metricSel.value) ? String(metricSel.value) : String(localStorage.getItem(METRIC_KEY) || 'tp_sl');
if (v === 'pips' || v === 'usd' || v === 'tp_sl')
return v;
}
catch (e) { }
return 'tp_sl';
};
const tf_perf_setMetric = (v) => {
const next = (v === 'pips' || v === 'usd' || v === 'tp_sl') ? v : 'tp_sl';
try {
localStorage.setItem(METRIC_KEY, next);
}
catch (e) { }
try {
if (metricSel)
metricSel.value = next;
}
catch (e) { }
};
try {
if (metricSel && !metricSel.dataset.tfBound) {
metricSel.dataset.tfBound = '1';
tf_perf_setMetric(String(localStorage.getItem(METRIC_KEY) || 'tp_sl'));
metricSel.addEventListener('change', () => {
const nextMetric = String(metricSel.value || 'tp_sl');
tf_perf_setMetric(nextMetric);
if (nextMetric === 'usd') {
const desiredRisk = tf_perf_setUsdRiskMode('fixed');
const desiredMonths = tf_perf_setUsdCompoundMonths(tf_perf_getUsdCompoundMonths());
const did = tf_perf_syncGlobalRiskModeFromPerf(desiredRisk, desiredMonths);
if (did)
return;
}
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
});
}
else if (metricSel) {
tf_perf_setMetric(String(localStorage.getItem(METRIC_KEY) || tf_perf_getMetric()));
}
}
catch (e) { }
try {
if (perfRiskSel && !perfRiskSel.dataset.tfBound) {
perfRiskSel.dataset.tfBound = '1';
perfRiskSel.addEventListener('change', () => {
const desiredRisk = tf_perf_setUsdRiskMode(String(perfRiskSel.value || 'fixed'));
const desiredMonths = tf_perf_setUsdCompoundMonths(tf_perf_getUsdCompoundMonths());
try {
if (perfCompGroup)
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
}
catch (e) { }
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
});
}
}
catch (e) { }
try {
if (perfCompSel && !perfCompSel.dataset.tfBound) {
perfCompSel.dataset.tfBound = '1';
perfCompSel.addEventListener('change', () => {
tf_perf_setUsdCompoundMonths(perfCompSel.value);
const desiredRisk = tf_perf_getUsdRiskMode();
if (desiredRisk === 'compound') {
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
}
});
}
}
catch (e) { }
const perfMetric = tf_perf_getMetric();
try {
const showUsdControls = (perfMetric === 'usd');
if (perfRiskGroup)
perfRiskGroup.style.display = showUsdControls ? '' : 'none';
if (!showUsdControls) {
if (perfCompGroup)
perfCompGroup.style.display = 'none';
}
else {
const desiredRisk = tf_perf_getUsdRiskMode();
const desiredMonths = tf_perf_getUsdCompoundMonths();
try {
tf_perf_setUsdRiskMode(desiredRisk);
}
catch (e) { }
try {
tf_perf_setUsdCompoundMonths(desiredMonths);
}
catch (e) { }
try {
const did = tf_perf_syncGlobalRiskModeFromPerf(desiredRisk, desiredMonths);
if (did)
return;
}
catch (e) { }
try {
if (perfCompSel && perfCompSel.options && perfCompSel.options.length === 0) {
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = (i === 1) ? '1 month' : String(i) + ' month';
perfCompSel.appendChild(opt);
}
}
}
catch (e) { }
if (perfCompGroup)
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
}
}
catch (e) { }
const tf_perf_trim0 = (s) => {
const str = String(s || '');
return str
.replace(/(\.[0-9]*?[1-9])0+$/g, '$1')
.replace(/\.0+$/g, '')
.replace(/\.$/g, '');
};
const tf_perf_formatCompact = (num) => {
const n0 = Number(num);
if (!Number.isFinite(n0))
return '0';
const n = Math.abs(n0);
const units = [
{ v: 1e9, s: 'B' },
{ v: 1e6, s: 'M' },
{ v: 1e3, s: 'K' },
];
for (let i = 0; i < units.length; i++) {
const u = units[i];
if (n >= u.v) {
const x = n / u.v;
const dec = x < 100 ? 1 : 0;
const out = tf_perf_trim0(x.toFixed(dec));
return out + u.s;
}
}
try {
if (typeof formatNumber === 'function')
return tf_perf_trim0(formatNumber(n, 0));
}
catch (e) { }
return String(Math.round(n));
};
const tf_perf_formatPipsCompact = (num) => {
const n0 = Number(num);
if (!Number.isFinite(n0))
return '0';
const n = Math.abs(n0);
const units = [
{ v: 1e6, s: 'm' },
{ v: 1e3, s: 'k' },
];
for (let i = 0; i < units.length; i++) {
const u = units[i];
if (n >= u.v) {
const x = n / u.v;
const dec = x < 100 ? 1 : 0;
const out = tf_perf_trim0(x.toFixed(dec));
return out + u.s;
}
}
try {
if (typeof formatNumber === 'function')
return tf_perf_trim0(formatNumber(n, 1));
}
catch (e) { }
return tf_perf_trim0(n.toFixed(1));
};
const tf_perf_formatValue = (val) => {
const n = Number(val);
if (!Number.isFinite(n))
return '0';
if (perfMetric === 'tp_sl')
return String(Math.round(n));
if (perfMetric === 'usd')
return tf_perf_formatCompact(n);
return tf_perf_formatPipsCompact(n);
};
const tf_perf_formatSignedNet = (val) => {
const n = Number(val);
if (!Number.isFinite(n))
return '0';
if (perfMetric === 'tp_sl')
return String(Math.round(n));
const sign = n < 0 ? '-' : '';
const abs = Math.abs(n);
if (perfMetric === 'usd')
return sign + tf_perf_formatCompact(abs);
return sign + tf_perf_formatPipsCompact(abs);
};
const tf_perf_formatPctSigned = (pctVal) => {
const n = Number(pctVal);
if (!Number.isFinite(n))
return '0%';
return tf_perf_trim0(n.toFixed(1)) + '%';
};
const byAnalyst = new Map();
const TF_PERF_UNKNOWN = '__UNKNOWN__';
const tf_perf_keyOfAnalyst = (r) => {
try {
const raw = (r && r.analyst != null) ? String(r.analyst).trim() : '';
const low = raw.toLowerCase();
if (!raw || low === 'undefined' || low === 'null')
return TF_PERF_UNKNOWN;
return raw;
}
catch (e) {
return TF_PERF_UNKNOWN;
}
};
const tf_perf_add = (key, tpAdd, slAdd) => {
const cur = byAnalyst.get(key) || { tp: 0, sl: 0, total: 0 };
if (Number.isFinite(tpAdd) && tpAdd > 0)
cur.tp += tpAdd;
if (Number.isFinite(slAdd) && slAdd > 0)
cur.sl += slAdd;
cur.total = (cur.tp || 0) + (cur.sl || 0);
byAnalyst.set(key, cur);
};
const tf_perf_calcKey = (row) => {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
return 0;
};
const tf_perf_getPips = (r) => {
const p = Number.isFinite(r && r.pnlPips) ? Number(r.pnlPips) : Number(r && (r.pnlPips != null ? r.pnlPips : r.pips));
return Number.isFinite(p) ? p : 0;
};
const tf_perf_getDollarPerPip = (pair, r) => {
const dpp = Number.isFinite(r && r.dollarPerPip) ? Number(r.dollarPerPip) : Number(getDollarPerPipForAnalyst(null, pair));
return Number.isFinite(dpp) ? Math.abs(dpp) : 0;
};
const tf_perf_getRiskPercent = (analyst, pair, r) => {
const rp = Number.isFinite(r && r.riskPercent) ? Number(r.riskPercent) : Number(getRiskPercentForAnalyst(analyst, pair));
return Number.isFinite(rp) ? Math.max(0, rp) : 0;
};
const _perfSlPipsCache = new Map();
const tf_perf_getEffectiveSlPips = (analyst, pair) => {
const k = String(analyst || '') + '|' + String(pair || '');
if (_perfSlPipsCache.has(k))
return _perfSlPipsCache.get(k) || 0;
let sl = 0;
try {
const slStats = (typeof computeSlStatsFromHistory === 'function') ? computeSlStatsFromHistory(analyst, pair) : null;
const eff = (typeof getEffectiveSlForAnalyst === 'function') ? getEffectiveSlForAnalyst(analyst, pair, slStats) : null;
if (eff && Number.isFinite(eff.pips))
sl = eff.pips;
}
catch (e) { }
if (!Number.isFinite(sl) || sl <= 0)
sl = 0;
_perfSlPipsCache.set(k, sl);
return sl;
};
const _perfFixedLotCache = new Map();
const tf_perf_getLotFixed = (analyst, pair, dollarPerPip, riskPercent, startingBalance) => {
const k = String(analyst || '') + '|' + String(pair || '');
if (_perfFixedLotCache.has(k))
return _perfFixedLotCache.get(k) || 0;
let lot = 0;
try {
const slPips = tf_perf_getEffectiveSlPips(analyst, pair);
if (slPips > 0 && dollarPerPip > 0 && Number.isFinite(startingBalance) && startingBalance > 0) {
lot = computeLot(startingBalance, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(lot) || lot <= 0)
lot = 0;
else
lot = roundLotToTwoDecimals(lot);
}
}
catch (e) { }
_perfFixedLotCache.set(k, lot);
return lot;
};
try {
const inputRows = Array.isArray(rows) ? rows : [];
const trades = inputRows
.filter((r) => r && !r.isWithdraw && String(r.analyst || '').toLowerCase() !== 'withdraw');
if (perfMetric === 'usd') {
const perfUsdRisk = tf_perf_getUsdRiskMode();
const perfUsdMonths = tf_perf_getUsdCompoundMonths();
const startingBalance = Number.isFinite(currentBalance) ? currentBalance : 0;
if (perfUsdRisk !== 'compound') {
trades.forEach((r) => {
const analyst = r.analyst || '';
const pair = r.pair || '';
const pips = tf_perf_getPips(r);
if (!Number.isFinite(pips) || pips === 0)
return;
const dpp = tf_perf_getDollarPerPip(pair, r);
if (!(dpp > 0))
return;
const rp = tf_perf_getRiskPercent(analyst, pair, r);
const lot = tf_perf_getLotFixed(analyst, pair, dpp, rp, startingBalance);
if (!(lot > 0))
return;
const pnlDollar = pips * lot * dpp;
if (!Number.isFinite(pnlDollar) || pnlDollar === 0)
return;
const key = tf_perf_keyOfAnalyst(r);
if (pnlDollar > 0)
tf_perf_add(key, pnlDollar, 0);
else
tf_perf_add(key, 0, Math.abs(pnlDollar));
});
}
else {
const sorted = trades.slice().sort((a, b) => tf_perf_calcKey(a) - tf_perf_calcKey(b));
const monthSeen = new Set();
const monthKeys = [];
const tradesByMonth = Object.create(null);
let minIdx = null;
let maxIdx = null;
for (let i = 0; i < sorted.length; i++) {
const r = sorted[i];
const k = tf_perf_calcKey(r);
const mk = (typeof tf_monthKeyFromSortKey === 'function') ? tf_monthKeyFromSortKey(k) : null;
if (!mk)
continue;
if (!monthSeen.has(mk)) {
monthSeen.add(mk);
monthKeys.push(mk);
}
if (!tradesByMonth[mk])
tradesByMonth[mk] = [];
tradesByMonth[mk].push(r);
const mi = (typeof tf_sortKeyToMonthIndex === 'function') ? tf_sortKeyToMonthIndex(k) : null;
if (mi != null) {
if (minIdx == null || mi < minIdx)
minIdx = mi;
if (maxIdx == null || mi > maxIdx)
maxIdx = mi;
}
}
const tf_perf_monthKeyFromIndex = (idx) => {
const y = Math.floor(idx / 12);
const m = (idx % 12) + 1;
return String(y) + '-' + String(m).padStart(2, '0');
};
const fullMonthKeys = (minIdx == null || maxIdx == null) ? monthKeys.slice() : (function () {
const out = [];
for (let mi = minIdx; mi <= maxIdx; mi++)
out.push(tf_perf_monthKeyFromIndex(mi));
return out;
})();
const periodMonths = Math.max(1, Math.min(12, Math.floor(Number(perfUsdMonths) || 1)));
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const mk = fullMonthKeys[i];
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[mk] = fullMonthKeys[startIndex] || mk;
}
let runningEquity = startingBalance;
let currentPeriodStart = null;
let sizingBase = startingBalance;
const lotCache = new Map();
const firstMonth = fullMonthKeys.length ? fullMonthKeys[0] : null;
for (let mi = 0; mi < fullMonthKeys.length; mi++) {
const monthKey = fullMonthKeys[mi];
const periodStartKey = monthToPeriodStart[monthKey] || monthKey;
if (currentPeriodStart !== periodStartKey) {
currentPeriodStart = periodStartKey;
sizingBase = (monthKey === firstMonth) ? startingBalance : runningEquity;
try {
lotCache.clear();
}
catch (e) { }
}
const monthTrades = tradesByMonth[monthKey] || [];
for (let j = 0; j < monthTrades.length; j++) {
const r = monthTrades[j];
const analyst = r.analyst || '';
const pair = r.pair || '';
const pips = tf_perf_getPips(r);
if (!Number.isFinite(pips) || pips === 0)
continue;
const dpp = tf_perf_getDollarPerPip(pair, r);
if (!(dpp > 0))
continue;
const rp = tf_perf_getRiskPercent(analyst, pair, r);
const baseBal = Math.max(0, Number(sizingBase) || 0);
const cacheKey = `${periodStartKey}|${analyst}|${pair}|B${Math.round(baseBal * 100)}`;
let lot = lotCache.get(cacheKey);
if (!Number.isFinite(lot)) {
lot = 0;
const slPips = tf_perf_getEffectiveSlPips(analyst, pair);
if (slPips > 0 && rp >= 0 && baseBal > 0) {
lot = computeLot(baseBal, rp, slPips, dpp);
if (!Number.isFinite(lot) || lot <= 0)
lot = 0;
else
lot = roundLotToTwoDecimals(lot);
}
lotCache.set(cacheKey, lot);
}
if (!(lot > 0))
continue;
const pnlDollar = pips * lot * dpp;
if (!Number.isFinite(pnlDollar) || pnlDollar === 0)
continue;
const key = tf_perf_keyOfAnalyst(r);
if (pnlDollar > 0)
tf_perf_add(key, pnlDollar, 0);
else
tf_perf_add(key, 0, Math.abs(pnlDollar));
runningEquity += pnlDollar;
}
}
}
}
else {
trades.forEach((r) => {
const p = tf_perf_getPips(r);
if (!Number.isFinite(p) || p === 0)
return;
const key = tf_perf_keyOfAnalyst(r);
if (perfMetric === 'pips') {
if (p > 0)
tf_perf_add(key, p, 0);
else
tf_perf_add(key, 0, Math.abs(p));
}
else {
if (p > 0)
tf_perf_add(key, 1, 0);
else
tf_perf_add(key, 0, 1);
}
});
}
}
catch (e) { }
const names = Array.from(byAnalyst.keys())
.filter(Boolean)
.sort((a, b) => {
const aa = String(a);
const bb = String(b);
if (aa === TF_PERF_UNKNOWN && bb !== TF_PERF_UNKNOWN)
return 1;
if (bb === TF_PERF_UNKNOWN && aa !== TF_PERF_UNKNOWN)
return -1;
return aa.localeCompare(bb, undefined, { sensitivity: 'base' });
});
if (!names.length) {
try {
wrap.style.display = "none";
}
catch (e) { }
try {
leftBody.innerHTML = "";
rightBody.innerHTML = "";
}
catch (e) { }
try {
if (overallBox)
overallBox.style.display = "none";
}
catch (e) { }
return;
}
try {
wrap.style.display = "flex";
}
catch (e) { }
const SEL_KEY = "tf_perf_selected_analysts_v1";
let sel = {};
try {
sel = JSON.parse(localStorage.getItem(SEL_KEY) || "{}");
}
catch (e) {
sel = {};
}
if (!sel || typeof sel !== "object")
sel = {};
const isChecked = (name) => (sel[String(name)] !== false);
const persistSel = () => {
try {
localStorage.setItem(SEL_KEY, JSON.stringify(sel));
}
catch (e) { }
};
const computeOverall = () => {
let totalTP = 0;
let totalSL = 0;
try {
names.forEach((n) => {
if (!isChecked(n))
return;
const v = byAnalyst.get(n);
if (!v)
return;
totalTP += (v.tp || 0);
totalSL += (v.sl || 0);
});
}
catch (e) { }
const totalAll = totalTP + totalSL;
const winrate = (totalAll > 0) ? (totalTP / totalAll) * 100 : 0;
const isNegative = (totalAll > 0) && (totalSL > totalTP);
return { totalTP, totalSL, totalAll, winrate, isNegative };
};
const renderOverall = () => {
if (!overallBox || !overallFill || !overallPctEl)
return;
const { winrate, totalTP, totalSL, isNegative } = computeOverall();
const pctOverall = Math.max(0, Math.min(100, Number.isFinite(winrate) ? winrate : 0));
const pctLabelNeg = !!isNegative;
const fillNeg = !!isNegative;
try {
overallBox.style.display = "block";
}
catch (e) { }
try {
overallFill.style.width = pctOverall.toFixed(0) + "%";
overallFill.style.background = fillNeg ? "var(--danger, #f97373)" : "var(--accent, #3c8dbc)";
}
catch (e) { }
try {
const track = overallBox.querySelector(".tf-perf-bar-track");
if (track) {
let mid = track.querySelector(".tf-perf-bar-mid");
if (!mid) {
mid = document.createElement("div");
mid.className = "tf-perf-bar-mid mono";
track.appendChild(mid);
}
const net = (totalTP || 0) - (totalSL || 0);
if (perfMetric === 'usd') {
const base = (Number.isFinite(currentBalance) ? Number(currentBalance) : 0);
const pctNet = (base > 0) ? (net / base) * 100 : 0;
mid.textContent = 'PnL ' + tf_perf_formatSignedNet(net) + ' (' + tf_perf_formatPctSigned(pctNet) + ')';
mid.classList.toggle('tf-perf-neg', pctNet < 0);
}
else {
mid.textContent = tf_perf_formatSignedNet(net);
mid.classList.remove('tf-perf-neg');
}
}
}
catch (e) { }
try {
if (overallCountEl && (overallWinEl || overallLossEl)) {
if (overallWinEl)
overallWinEl.textContent = tf_perf_formatValue(totalTP || 0);
if (overallLossEl) {
overallLossEl.textContent = tf_perf_formatValue(totalSL || 0);
overallLossEl.classList.toggle("tf-perf-loss-red", (Number(totalSL) || 0) > 0);
}
}
}
catch (e) { }
try {
overallPctEl.textContent = (pctLabelNeg ? '-' : '') + pctOverall.toFixed(0) + '%';
overallPctEl.classList.toggle('tf-perf-neg', !!pctLabelNeg);
}
catch (e) { }
};
renderOverall();
const items = names.map((name) => {
const v = byAnalyst.get(name) || { tp: 0, sl: 0, total: 0 };
const winrate = (v.total > 0) ? (v.tp / v.total) * 100 : 0;
const isUnknown = String(name) === TF_PERF_UNKNOWN;
return {
name,
display: isUnknown
? '(Unknown)'
: ((typeof formatAnalystDisplayName === "function") ? formatAnalystDisplayName(name) : name),
tp: (v.tp || 0),
sl: (v.sl || 0),
winrate,
isNegative: (v.total > 0) && ((v.sl || 0) > (v.tp || 0))
};
});
const half = Math.ceil(items.length / 2);
const left = items.slice(0, half);
const right = items.slice(half);
const renderSide = (tbody, list) => {
try {
tbody.innerHTML = "";
}
catch (e) { }
list.forEach((it) => {
const tr = document.createElement("tr");
tr.className = "tf-perf-row";
tr.dataset.analyst = it.name;
const checked = isChecked(it.name);
if (!checked)
tr.classList.add("tf-perf-row-off");
const tdName = document.createElement("td");
tdName.className = "tf-perf-name";
const label = document.createElement("label");
label.className = "tf-perf-analyst-label";
const cb = document.createElement("input");
cb.type = "checkbox";
cb.className = "tf-perf-ck";
cb.checked = !!checked;
const nameSpan = document.createElement("span");
nameSpan.className = "tf-perf-name-text";
nameSpan.textContent = it.display || it.name || "";
nameSpan.title = String(it.name || "").trim();
cb.addEventListener("change", () => {
sel[String(it.name)] = cb.checked;
persistSel();
tr.classList.toggle("tf-perf-row-off", !cb.checked);
renderOverall();
});
label.appendChild(cb);
label.appendChild(nameSpan);
tdName.appendChild(label);
const tdBar = document.createElement("td");
tdBar.className = "tf-perf-bar-cell";
const barWrap = document.createElement("div");
barWrap.className = "tf-perf-bar-wrap";
const count = document.createElement("div");
count.className = "tf-perf-count mono";
const winSpan = document.createElement("span");
winSpan.className = "tf-perf-win";
winSpan.textContent = tf_perf_formatValue(it.tp || 0);
const sep = document.createTextNode("/");
const lossSpan = document.createElement("span");
lossSpan.className = "tf-perf-loss";
lossSpan.textContent = tf_perf_formatValue(it.sl || 0);
if ((Number(it.sl) || 0) > 0)
lossSpan.classList.add("tf-perf-loss-red");
count.appendChild(winSpan);
count.appendChild(sep);
count.appendChild(lossSpan);
const track = document.createElement("div");
track.className = "tf-perf-bar-track";
const fill = document.createElement("div");
fill.className = "tf-perf-bar-fill";
const pct = Math.max(0, Math.min(100, Number.isFinite(it.winrate) ? it.winrate : 0));
fill.style.width = pct.toFixed(0) + "%";
const __neg = !!it.isNegative;
try {
fill.style.background = __neg ? "var(--danger, #f97373)" : "var(--accent, #3c8dbc)";
}
catch (e) { }
track.appendChild(fill);
const mid = document.createElement("div");
mid.className = "tf-perf-bar-mid mono";
const net = (it.tp || 0) - (it.sl || 0);
if (perfMetric === 'usd') {
const base = (Number.isFinite(currentBalance) ? Number(currentBalance) : 0);
const pctNet = (base > 0) ? (net / base) * 100 : 0;
mid.textContent = 'PnL ' + tf_perf_formatSignedNet(net) + ' (' + tf_perf_formatPctSigned(pctNet) + ')';
mid.classList.toggle('tf-perf-neg', pctNet < 0);
}
else {
mid.textContent = tf_perf_formatSignedNet(net);
mid.classList.remove('tf-perf-neg');
}
track.appendChild(mid);
barWrap.appendChild(count);
barWrap.appendChild(track);
tdBar.appendChild(barWrap);
const tdPct = document.createElement("td");
tdPct.className = "tf-perf-pct mono";
tdPct.textContent = (it.isNegative ? "-" : "") + pct.toFixed(0) + "%";
tdPct.classList.toggle('tf-perf-neg', !!it.isNegative);
tr.appendChild(tdName);
tr.appendChild(tdBar);
tr.appendChild(tdPct);
tbody.appendChild(tr);
});
};
renderSide(leftBody, left);
renderSide(rightBody, right);
}
const TF_MONTHLY_COL_WIDTHS = {
action: 90,
analyst: 160,
pair: 110,
month: 120,
};
function tf_applyMonthlyTableLayout(monthCount) {
const section = document.getElementById('section-monthly');
const table = document.getElementById('monthly-table');
if (!table)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
const requiredWidth = TF_MONTHLY_COL_WIDTHS.action +
TF_MONTHLY_COL_WIDTHS.analyst +
TF_MONTHLY_COL_WIDTHS.pair +
(TF_MONTHLY_COL_WIDTHS.month * safeCount);
const scrollEl = table.closest('.table-scroll.monthly-table-scroll') || table.closest('.table-scroll');
const containerW = scrollEl ? (scrollEl.clientWidth || 0) : 0;
const shouldFit = containerW > 0 && requiredWidth < (containerW - 6);
if (shouldFit) {
table.classList.add('monthly-fit');
table.style.minWidth = '100%';
table.style.width = '100%';
table.style.maxWidth = '100%';
}
else {
table.classList.remove('monthly-fit');
table.style.minWidth = `${requiredWidth}px`;
table.style.width = 'max-content';
table.style.maxWidth = 'none';
}
if (section) {
section.style.setProperty('--mcol-action', `${TF_MONTHLY_COL_WIDTHS.action}px`);
section.style.setProperty('--mcol-analyst', `${TF_MONTHLY_COL_WIDTHS.analyst}px`);
section.style.setProperty('--mcol-pair', `${TF_MONTHLY_COL_WIDTHS.pair}px`);
}
}
function buildMonthlyTableSkeleton() {
const tbody = document.getElementById('monthly-body');
if (!tbody)
return;
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const theadRow = document.querySelector('#monthly-table thead tr');
if (theadRow) {
while (theadRow.children.length > 3) {
theadRow.removeChild(theadRow.lastChild);
}
if (theadRow.children.length === 2) {
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
else if (theadRow.children.length === 1) {
const thName = document.createElement('th');
thName.textContent = 'Nama Analis';
theadRow.appendChild(thName);
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
else if (theadRow.children.length === 0) {
const thAction = document.createElement('th');
thAction.textContent = 'Action';
theadRow.appendChild(thAction);
const thName = document.createElement('th');
thName.textContent = 'Nama Analis';
theadRow.appendChild(thName);
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
if (theadRow.children.length >= 3) {
theadRow.children[2].textContent = 'Pair';
}
if (theadRow.children[0]) {
theadRow.children[0].classList.add('monthly-sticky-col-1');
}
if (theadRow.children[1]) {
theadRow.children[1].classList.add('monthly-sticky-col-2');
}
if (theadRow.children[2]) {
theadRow.children[2].classList.add('monthly-sticky-col-3');
}
monthKeys.forEach((monthKey) => {
const th = document.createElement('th');
th.textContent = formatMonthKeyToLabel(monthKey);
th.setAttribute('data-month-key', monthKey);
theadRow.appendChild(th);
});
}
tbody.innerHTML = '';
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
if (!pairUpper)
return true;
return Array.isArray(allowedPairs)
? allowedPairs.map((p) => String(p).toUpperCase()).includes(pairUpper)
: true;
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
if (!Array.isArray(filteredAnalysts) || filteredAnalysts.length === 0 || !monthKeys.length) {
return;
}
filteredAnalysts.forEach((a) => {
const tr = document.createElement('tr');
const actionCell = document.createElement('td');
actionCell.classList.add('monthly-sticky-col-1');
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'btn btn-xs';
btn.textContent = 'Refresh';
btn.title = 'Reload data analis ini dari website (Statistics + History)';
btn.addEventListener('click', () => {
const baseName = a.baseName || a.name;
const pair = a.pair || (Array.isArray(a.pairs) && a.pairs.length ? a.pairs[0] : null);
refreshAnalystFromDashboard(baseName, pair, btn);
});
actionCell.appendChild(btn);
tr.appendChild(actionCell);
const nameCell = document.createElement('td');
nameCell.textContent = formatAnalystDisplayName(a.baseName || a.name);
nameCell.title = String(a.baseName || a.name || '').trim();
nameCell.classList.add('monthly-sticky-col-2');
tr.appendChild(nameCell);
const pairCell = document.createElement('td');
const pairText = (Array.isArray(a.pairs) && a.pairs.length)
? a.pairs.join(', ')
: (a.pair || '');
pairCell.textContent = pairText;
pairCell.classList.add('monthly-sticky-col-3');
tr.appendChild(pairCell);
monthKeys.forEach((monthKey) => {
const td = document.createElement('td');
td.setAttribute('contenteditable', 'true');
td.setAttribute('data-analyst', a.name);
td.setAttribute('data-month-key', monthKey);
td.style.whiteSpace = 'pre-line';
tr.appendChild(td);
});
tbody.appendChild(tr);
});
tf_applyMonthlyTableLayout(monthKeys.length);
try {
__tfMonthlyMonthKeysSig = (monthKeys || []).join('|');
}
catch (e) { }
const monthlyTable = document.getElementById('monthly-table');
if (monthlyTable) {
const scrollContainer = monthlyTable.closest('.table-scroll');
if (scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
scrollContainer.scrollLeft = scrollContainer.scrollWidth;
}
}
}
function refreshAnalystFromDashboard(analystName, pair, buttonEl) {
const hasChromeAPI = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
if (!hasChromeAPI) {
console.warn('Chrome runtime API tidak tersedia – tombol refresh hanya berfungsi di extension.');
return;
}
if (buttonEl) {
buttonEl.disabled = true;
buttonEl.textContent = 'Refreshing...';
}
const msg = { type: 'scanSingleAnalyst', analystName };
if (pair)
msg.pair = pair;
chrome.runtime.sendMessage(msg, (response) => {
if (buttonEl) {
buttonEl.disabled = false;
buttonEl.textContent = 'Refresh';
}
if (chrome.runtime.lastError) {
console.error('scanSingleAnalyst error:', chrome.runtime.lastError.message);
return;
}
if (!response || !response.ok) {
console.error('scanSingleAnalyst gagal:', response && response.error);
return;
}
loadFromChromeStorageIfAvailable();
});
}
function updateMonthlyTableCells() {
const tbody = document.getElementById('monthly-body');
if (!tbody)
return;
const stats = monthlyStatsByAnalyst || {};
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const priceBusy = tf_isMyfxbookPriceLoading();
const monthEndBalanceMap = (riskMode === 'compound')
? tf_buildMonthEndBalanceMapFromHistoryRows(lastHistoryRows)
: null;
let tf_monthlyCompoundFallback = Number.isFinite(currentBalance) ? currentBalance : 0;
try {
if (riskMode === 'compound' && Array.isArray(lastHistoryRows) && lastHistoryRows.length) {
const first = lastHistoryRows[0];
if (first && Number.isFinite(first.balanceCompound)) {
tf_monthlyCompoundFallback = first.balanceCompound;
}
}
}
catch (e) { }
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0 || !monthKeys.length) {
const cells = tbody.querySelectorAll('td[data-analyst]');
cells.forEach((cell) => {
cell.textContent = '-';
});
renderMonthlyTotals();
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
const analystName = a.baseName || a.name;
const statsKey = a.name;
const hasPair = !!(a.pair);
const aStats = stats[statsKey] || (!hasPair && analystName ? stats[analystName] : null) || {};
const effective = getEffectiveSlForAnalyst(analystName, a.pair || null);
const effectiveSlPips = effective.pips || 0;
const dollarPerPip = getDollarPerPipForAnalyst(a);
const riskPercent = getRiskPercentForAnalyst(analystName, a.pair || getPrimaryPairForAnalyst(a));
const baseBalFixedForIncome = (Number.isFinite(currentBalance) ? currentBalance : 0);
let lotFixedIncome = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBalFixedForIncome, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lotFixedIncome = roundLotToTwoDecimals(lotFixedIncome);
monthKeys.forEach((monthKey) => {
const selector = 'td[data-analyst="' + a.name + '"][data-month-key="' + monthKey + '"]';
const cell = document.querySelector(selector);
if (!cell)
return;
const s = aStats[monthKey] || {};
const pips = typeof s.pips === 'number' ? s.pips : null;
const signals = typeof s.signals === 'number' ? s.signals : null;
if (pips == null && signals == null) {
cell.textContent = '-';
return;
}
const lineElements = [];
if (pips != null) {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (pips > 0) {
span.classList.add('monthly-val-positive');
}
else if (pips < 0) {
span.classList.add('monthly-val-negative');
}
span.textContent = formatNumber(pips, 1) + ' Pips';
lineElements.push(span);
}
if (signals != null) {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
span.textContent = signals + ' Signals';
lineElements.push(span);
}
if (pips != null && effectiveSlPips > 0 && dollarPerPip > 0) {
const baseBal = (riskMode === 'compound')
? tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, tf_monthlyCompoundFallback)
: (Number.isFinite(currentBalance) ? currentBalance : 0);
let lot = (Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBal, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lot = roundLotToTwoDecimals(lot);
const dollars = pips * lot * dollarPerPip;
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (dollars > 0) {
span.classList.add('monthly-val-positive');
}
else if (dollars < 0) {
span.classList.add('monthly-val-negative');
}
if (priceBusy && ((signals != null && signals > 0) || (pips != null && pips !== 0))) {
span.innerHTML = tf_spinnerHTML(true);
}
else {
span.textContent = formatMoney(dollars);
}
lineElements.push(span);
}
cell.innerHTML = '';
lineElements.forEach((el) => cell.appendChild(el));
});
});
renderMonthlyTotals();
}
function renderMonthlyTotals() {
const priceBusy = tf_isMyfxbookPriceLoading();
const tbody = document.getElementById('monthly-body');
const incomeMinEl = document.getElementById('income-min');
const incomeMaxEl = document.getElementById('income-max');
const incomeRangeTextEl = document.getElementById('income-minmax-range-text');
const tf_setIncomeMinMaxUI = (minText, maxText, rangeText) => {
try {
if (incomeMinEl)
incomeMinEl.innerHTML = minText;
if (incomeMaxEl)
incomeMaxEl.innerHTML = maxText;
if (incomeRangeTextEl)
incomeRangeTextEl.textContent = rangeText || 'min-max income from January 2024 s.d -';
}
catch (e) { }
};
if (!tbody) {
tf_setIncomeMinMaxUI('-', '-', 'min-max income from January 2024 s.d -');
return;
}
const oldTotalRows = Array.from(tbody.querySelectorAll('tr.monthly-total-row'));
oldTotalRows.forEach((tr) => tr.remove());
const stats = monthlyStatsByAnalyst || {};
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const firstMonthInCurrentRangeTotals = (monthKeys && monthKeys.length) ? monthKeys[0] : null;
const skipWithdrawMonthKeyTotals = (firstMonthInCurrentRangeTotals && firstMonthInCurrentRangeTotals >= TF_WITHDRAW_MIN_MONTHKEY) ? firstMonthInCurrentRangeTotals : null;
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0 || !monthKeys.length) {
tf_setIncomeMinMaxUI('-', '-', 'min-max income from January 2024 s.d -');
return;
}
const totals = {};
monthKeys.forEach((key) => {
totals[key] = { pips: 0, signals: 0, dollars: 0 };
});
const totalsFixedWithdraw = {};
monthKeys.forEach((key) => {
totalsFixedWithdraw[key] = { dollars: 0 };
});
const monthEndBalanceMap = (riskMode === 'compound')
? tf_buildMonthEndBalanceMapFromHistoryRows(lastHistoryRows)
: null;
let tf_monthlyCompoundFallback = Number.isFinite(currentBalance) ? currentBalance : 0;
try {
if (riskMode === 'compound' && Array.isArray(lastHistoryRows) && lastHistoryRows.length) {
const first = lastHistoryRows[0];
if (first && Number.isFinite(first.balanceCompound)) {
tf_monthlyCompoundFallback = first.balanceCompound;
}
}
}
catch (e) { }
try {
rebuildMonthKeysFromStats();
}
catch (e) { }
const tf_allKeysForIncome = Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted.slice() : [];
const tf_incomeMonthKeys = tf_allKeysForIncome.filter((k) => typeof k === 'string' && /^\d{4}-\d{2}$/.test(k) && k >= TF_INCOME_MINMAX_START_MONTHKEY);
const tf_incomeEndKey = tf_incomeMonthKeys.length
? tf_incomeMonthKeys[tf_incomeMonthKeys.length - 1]
: (tf_allKeysForIncome.length ? tf_allKeysForIncome[tf_allKeysForIncome.length - 1] : null);
const tf_incomeRangeText = tf_incomeEndKey
? `min-max income from January 2024 s.d ${tf_formatMonthKeyInline(tf_incomeEndKey)}`
: 'min-max income from January 2024 s.d -';
const tf_incomeTotalsFixed = {};
tf_incomeMonthKeys.forEach((k) => { tf_incomeTotalsFixed[k] = 0; });
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
const analystName = a.baseName || a.name;
const statsKey = a.name;
const hasPair = !!(a.pair);
const aStats = stats[statsKey] || (!hasPair && analystName ? stats[analystName] : null) || {};
const effective = getEffectiveSlForAnalyst(analystName, a.pair || null);
const effectiveSlPips = effective.pips || 0;
const dollarPerPip = getDollarPerPipForAnalyst(a);
const riskPercent = getRiskPercentForAnalyst(analystName, a.pair || getPrimaryPairForAnalyst(a));
const baseBalFixedForIncome = (Number.isFinite(currentBalance) ? currentBalance : 0);
let lotFixedIncome = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBalFixedForIncome, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lotFixedIncome = roundLotToTwoDecimals(lotFixedIncome);
monthKeys.forEach((monthKey) => {
const s = aStats[monthKey];
if (!s)
return;
const baseBal = (riskMode === 'compound')
? tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, tf_monthlyCompoundFallback)
: (Number.isFinite(currentBalance) ? currentBalance : 0);
let lot = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBal, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lot = roundLotToTwoDecimals(lot);
if (typeof s.pips === 'number') {
totals[monthKey].pips += s.pips;
if (lot > 0 && dollarPerPip > 0) {
totals[monthKey].dollars += s.pips * lot * dollarPerPip;
}
}
if (typeof s.pips === 'number') {
if (lotFixedIncome > 0 && dollarPerPip > 0) {
totalsFixedWithdraw[monthKey].dollars += s.pips * lotFixedIncome * dollarPerPip;
}
}
if (typeof s.signals === 'number') {
totals[monthKey].signals += s.signals;
}
});
if (Array.isArray(tf_incomeMonthKeys) && tf_incomeMonthKeys.length && Number.isFinite(lotFixedIncome) && lotFixedIncome > 0 && dollarPerPip > 0) {
tf_incomeMonthKeys.forEach((monthKey) => {
const s = aStats[monthKey];
if (!s || typeof s.pips !== 'number')
return;
tf_incomeTotalsFixed[monthKey] += s.pips * lotFixedIncome * dollarPerPip;
});
}
});
const incomeValuesGross = [];
const incomeValuesNet = [];
const monthlyGrossByMonth = [];
const totalRow = document.createElement('tr');
totalRow.className = 'monthly-total-row';
const totalLabelCell = document.createElement('td');
totalLabelCell.colSpan = 3;
totalLabelCell.textContent = 'Total semua analis';
totalLabelCell.classList.add('monthly-sticky-col-1');
totalRow.appendChild(totalLabelCell);
monthKeys.forEach((monthKey, monthIdx) => {
const t = totals[monthKey] || { pips: 0, signals: 0, dollars: 0 };
const td = document.createElement('td');
const lineElements = [];
if (typeof t.pips === 'number') {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (t.pips > 0) {
span.classList.add('monthly-val-positive');
}
else if (t.pips < 0) {
span.classList.add('monthly-val-negative');
}
span.textContent = formatNumber(t.pips, 1) + ' Pips';
lineElements.push(span);
}
const sigSpan = document.createElement('span');
sigSpan.className = 'monthly-cell-line';
sigSpan.textContent = (typeof t.signals === 'number' ? t.signals : 0) + ' Signals';
lineElements.push(sigSpan);
if (typeof t.dollars === 'number') {
const grossDollars = t.dollars;
let netDollars = grossDollars;
const grossDollarsFixed = (totalsFixedWithdraw[monthKey] && typeof totalsFixedWithdraw[monthKey].dollars === 'number')
? totalsFixedWithdraw[monthKey].dollars
: grossDollars;
if (equityMetric === 'usd' && withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
const every = (Number.isFinite(withdrawEveryMonths) ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths))) : 1);
if (tf_isWithdrawDueMonth(monthKey, every) && (!skipWithdrawMonthKeyTotals || monthKey !== skipWithdrawMonthKeyTotals)) {
netDollars = grossDollars - withdrawAmount;
}
}
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (netDollars > 0) {
span.classList.add('monthly-val-positive');
}
else if (netDollars < 0) {
span.classList.add('monthly-val-negative');
}
if (priceBusy) {
span.innerHTML = tf_spinnerHTML(true);
}
else {
span.textContent = formatMoney(netDollars);
}
lineElements.push(span);
if (!priceBusy) {
incomeValuesGross.push(grossDollarsFixed);
monthlyGrossByMonth.push({
monthKey,
grossDollars: grossDollarsFixed,
signals: (typeof t.signals === 'number' ? t.signals : 0)
});
}
}
if (!lineElements.length) {
td.textContent = '-';
}
else {
lineElements.forEach((el) => td.appendChild(el));
}
totalRow.appendChild(td);
});
tbody.appendChild(totalRow);
if (priceBusy) {
tf_setIncomeMinMaxUI(tf_spinnerHTML(true), tf_spinnerHTML(true), tf_incomeRangeText);
}
else {
const incomeRangeVals = [];
try {
if (Array.isArray(tf_incomeMonthKeys) && tf_incomeMonthKeys.length) {
const every = (Number.isFinite(withdrawEveryMonths) ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths))) : 1);
tf_incomeMonthKeys.forEach((mk) => {
const gross = (tf_incomeTotalsFixed && Number.isFinite(tf_incomeTotalsFixed[mk])) ? tf_incomeTotalsFixed[mk] : 0;
let net = gross;
if (equityMetric === 'usd' && withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
if (tf_isWithdrawDueMonth(mk, every)) {
net = gross - withdrawAmount;
}
}
if (Number.isFinite(net) && net > 0) {
incomeRangeVals.push(net);
}
});
}
}
catch (e) { }
if (incomeRangeVals.length) {
const minVal = Math.min(...incomeRangeVals);
const maxVal = Math.max(...incomeRangeVals);
tf_setIncomeMinMaxUI(formatMoney(minVal), formatMoney(maxVal), tf_incomeRangeText);
}
else {
tf_setIncomeMinMaxUI(formatMoney(0), formatMoney(0), tf_incomeRangeText);
}
}
try {
tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy);
}
catch (e) { }
}
function fillMonthlyFromStorage(tfMonthlyStats) {
monthlyStatsByAnalyst = tfMonthlyStats || {};
}
const TF_HISTORY_COLUMN_PREF_KEY = 'tf_history_visible_columns_v1';
const TF_HISTORY_COLUMN_OPTIONS = [
{ key: 'created', label: 'Tanggal (Created At)', defaultVisible: true },
{ key: 'closed', label: 'Tanggal (Closed At)', defaultVisible: true },
{ key: 'analyst', label: 'Nama Analis', defaultVisible: true },
{ key: 'balance', label: 'Balance', defaultVisible: true },
{ key: 'entry', label: 'Entry', defaultVisible: false },
{ key: 'takeProfit', label: 'Take Profit', defaultVisible: false },
{ key: 'stopLoss', label: 'Stop Loss', defaultVisible: false },
{ key: 'type', label: 'Type', defaultVisible: false },
{ key: 'pair', label: 'Pair', defaultVisible: true },
{ key: 'lot', label: 'Lot Size', defaultVisible: true },
{ key: 'pnlPips', label: 'PnL (pips)', defaultVisible: true },
{ key: 'pnlDollar', label: 'PnL ($)', defaultVisible: true },
{ key: 'pnlPercent', label: 'PnL %', defaultVisible: true },
{ key: 'balancePnl', label: 'Balance PnL ($)', defaultVisible: true }
];
let tf_historyColumnVisibility = null;
function tf_defaultHistoryColumnVisibility() {
const out = {};
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => { out[col.key] = !!col.defaultVisible; });
return out;
}
function tf_getHistoryColumnVisibility() {
if (tf_historyColumnVisibility && typeof tf_historyColumnVisibility === 'object') {
return tf_historyColumnVisibility;
}
const defaults = tf_defaultHistoryColumnVisibility();
try {
const raw = localStorage.getItem(TF_HISTORY_COLUMN_PREF_KEY);
const saved = raw ? JSON.parse(raw) : null;
if (saved && typeof saved === 'object') {
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
if (Object.prototype.hasOwnProperty.call(saved, col.key)) {
defaults[col.key] = !!saved[col.key];
}
});
}
}
catch (e) { }
tf_historyColumnVisibility = defaults;
return tf_historyColumnVisibility;
}
function tf_saveHistoryColumnVisibility() {
try {
localStorage.setItem(TF_HISTORY_COLUMN_PREF_KEY, JSON.stringify(tf_getHistoryColumnVisibility()));
}
catch (e) { }
}
function tf_getVisibleHistoryColumnKeys() {
const visibility = tf_getHistoryColumnVisibility();
return TF_HISTORY_COLUMN_OPTIONS.filter((col) => visibility[col.key] !== false).map((col) => col.key);
}
function tf_markHistoryCell(cell, key) {
if (!cell)
return cell;
try {
cell.setAttribute('data-history-col', key);
}
catch (e) { }
const visibility = tf_getHistoryColumnVisibility();
const shouldHide = visibility[key] === false;
try {
cell.classList.toggle('tf-history-col-hidden', shouldHide);
}
catch (e) { }
try {
cell.hidden = shouldHide;
}
catch (e) { }
return cell;
}
function tf_applyHistoryColumnVisibility() {
const visibility = tf_getHistoryColumnVisibility();
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
document.querySelectorAll('#history-table [data-history-col="' + col.key + '"]').forEach((node) => {
const shouldHide = visibility[col.key] === false;
node.classList.toggle('tf-history-col-hidden', shouldHide);
try {
node.hidden = shouldHide;
}
catch (e) { }
});
});
const visibleCount = tf_getVisibleHistoryColumnKeys().length;
const label = document.getElementById('history-column-filter-label');
if (label)
label.textContent = 'Kolom: ' + visibleCount + '/' + TF_HISTORY_COLUMN_OPTIONS.length;
try {
const detailStatus = document.getElementById('history-detail-data-status');
if (detailStatus) {
const source = Array.isArray(historySignals) ? historySignals : [];
let totalTradeCount = Number(window.__tfHistoryDynamicTradeCount);
if (!Number.isFinite(totalTradeCount) || totalTradeCount < 0) {
try {
const domRows = Array.from(document.querySelectorAll('#history-table tbody tr'))
.filter((tr) => !tr.classList.contains('tf-start-balance-row') && !tr.classList.contains('tf-withdraw-row'));
totalTradeCount = domRows.length;
}
catch (e) { totalTradeCount = source.filter((row) => row && !row.isWithdraw).length; }
}
totalTradeCount = Math.max(0, Math.floor(totalTradeCount || 0));
if (totalTradeCount > 0) {
detailStatus.textContent = 'Data Entry/TP/SL/Type tersedia: ' + totalTradeCount + ' trade. Centang kolom untuk menampilkan.';
detailStatus.classList.add('tf-history-detail-ready');
}
else {
detailStatus.textContent = 'Data Entry/TP/SL/Type belum tersedia pada data saat ini.';
detailStatus.classList.remove('tf-history-detail-ready');
}
}
}
catch (e) { }
const menu = document.getElementById('history-column-filter-menu');
if (menu) {
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
const cb = menu.querySelector('input[data-history-column="' + col.key + '"]');
if (cb)
cb.checked = visibility[col.key] !== false;
});
const allCb = menu.querySelector('input[data-history-column-all="1"]');
if (allCb) {
allCb.checked = visibleCount === TF_HISTORY_COLUMN_OPTIONS.length;
allCb.indeterminate = visibleCount > 0 && visibleCount < TF_HISTORY_COLUMN_OPTIONS.length;
}
}
try {
const startCell = document.querySelector('#history-table tbody tr.tf-start-balance-row td');
if (startCell)
startCell.colSpan = Math.max(1, visibleCount + 1);
}
catch (e) { }
}
function setupHistoryColumnFilter() {
const root = document.getElementById('history-column-filter');
const button = document.getElementById('history-column-filter-btn');
const menu = document.getElementById('history-column-filter-menu');
if (!root || !button || !menu)
return;
if (root.getAttribute('data-ready') === '1') {
tf_applyHistoryColumnVisibility();
return;
}
root.setAttribute('data-ready', '1');
menu.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'tf-history-column-filter-list';
const allLi = document.createElement('li');
allLi.className = 'tf-history-column-filter-all';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.setAttribute('data-history-column-all', '1');
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
const li = document.createElement('li');
const labelEl = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-history-column', col.key);
cb.checked = tf_getHistoryColumnVisibility()[col.key] !== false;
labelEl.appendChild(cb);
labelEl.appendChild(document.createTextNode(col.label));
li.appendChild(labelEl);
ul.appendChild(li);
cb.addEventListener('change', () => {
tf_getHistoryColumnVisibility()[col.key] = !!cb.checked;
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
try {
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
});
});
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
const visibility = tf_getHistoryColumnVisibility();
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => { visibility[col.key] = checked; });
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
try {
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
});
menu.appendChild(ul);
const footer = document.createElement('div');
footer.className = 'tf-history-column-filter-footer';
const reset = document.createElement('button');
reset.type = 'button';
reset.className = 'tf-history-column-filter-reset';
reset.textContent = 'Kembali ke Default';
reset.addEventListener('click', (event) => {
event.preventDefault();
event.stopPropagation();
tf_historyColumnVisibility = tf_defaultHistoryColumnVisibility();
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
});
footer.appendChild(reset);
menu.appendChild(footer);
button.addEventListener('click', (event) => {
event.preventDefault();
event.stopPropagation();
const opening = menu.style.display !== 'block';
menu.style.display = opening ? 'block' : 'none';
button.setAttribute('aria-expanded', opening ? 'true' : 'false');
});
menu.addEventListener('click', (event) => event.stopPropagation());
if (!window.__tfHistoryColumnFilterOutsideBound) {
window.__tfHistoryColumnFilterOutsideBound = true;
document.addEventListener('click', (event) => {
const activeRoot = document.getElementById('history-column-filter');
const activeMenu = document.getElementById('history-column-filter-menu');
const activeButton = document.getElementById('history-column-filter-btn');
if (!activeRoot || !activeMenu || activeRoot.contains(event.target))
return;
activeMenu.style.display = 'none';
if (activeButton)
activeButton.setAttribute('aria-expanded', 'false');
});
}
tf_applyHistoryColumnVisibility();
}
function getHistoryAnalystSource() {
if (!Array.isArray(historySignals))
return [];
const set = new Set();
historySignals.forEach((item) => {
if (item && item.analyst) {
set.add(item.analyst);
}
});
return Array.from(set).sort();
}
function getHistorySelectedAnalysts() {
const allCheckbox = document.getElementById('history-analyst-all');
const container = document.getElementById('history-analyst-checkboxes');
if (!allCheckbox || !container) {
return null;
}
if (allCheckbox.checked) {
return null;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const selected = [];
boxes.forEach(function (cb) {
if (cb.checked) {
const name = cb.getAttribute('data-analyst') || '';
if (name)
selected.push(name);
}
});
return selected.length ? selected : null;
}
function setupHistoryAnalystFilter() {
const allCheckbox = document.getElementById('history-analyst-all');
const container = document.getElementById('history-analyst-checkboxes');
if (!allCheckbox || !container)
return;
const source = getHistoryAnalystSource();
container.innerHTML = '';
if (!source.length) {
allCheckbox.checked = true;
return;
}
source.forEach(function (name) {
const label = document.createElement('label');
label.style.fontSize = '10.8px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
cb.checked = true;
const span = document.createElement('span');
span.textContent = name;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
function syncAllFromChildren() {
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
let anyChecked = false;
let allChecked = true;
boxes.forEach(function (cb) {
if (cb.checked) {
anyChecked = true;
}
else {
allChecked = false;
}
});
if (!anyChecked) {
allCheckbox.checked = true;
boxes.forEach(function (cb) {
cb.checked = true;
});
}
else {
allCheckbox.checked = allChecked;
}
}
allCheckbox.addEventListener('change', function () {
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const checked = !!allCheckbox.checked;
boxes.forEach(function (cb) {
cb.checked = checked;
});
if (!checked) {
boxes.forEach(function (cb) { cb.checked = true; });
allCheckbox.checked = true;
}
recomputeHistoryRows();
});
container.addEventListener('change', function (evt) {
const target = evt.target;
if (!target || target.type !== 'checkbox')
return;
syncAllFromChildren();
recomputeHistoryRows();
});
syncAllFromChildren();
}
function recomputeHistoryRows() {
const selectedAnalysts = null;
const fixedLotCache = new Map();
function getFixedLotCached(analystName, pair, dollarPerPip, riskPercent) {
const key = String(analystName || '') + '|' + String(pair || '');
if (fixedLotCache.has(key)) {
return fixedLotCache.get(key) || 0;
}
let lotFixed = 0;
try {
const slStats = computeSlStatsFromHistory(analystName, pair);
const effective = getEffectiveSlForAnalyst(analystName, pair, slStats);
const fixedSlPips = effective && Number.isFinite(effective.pips) ? effective.pips : 0;
if (fixedSlPips > 0 && dollarPerPip > 0 && Number.isFinite(currentBalance) && Number.isFinite(riskPercent) && riskPercent >= 0) {
lotFixed = computeLot(currentBalance, riskPercent, fixedSlPips, dollarPerPip);
if (!Number.isFinite(lotFixed) || lotFixed <= 0) {
lotFixed = 0;
}
else {
lotFixed = roundLotToTwoDecimals(lotFixed);
}
}
}
catch (e) {
}
fixedLotCache.set(key, lotFixed);
return lotFixed;
}
const slPipsCache = new Map();
function getEffectiveSlPipsCached(analystName, pair) {
const key = String(analystName || '') + '|' + String(pair || '');
if (slPipsCache.has(key)) {
return slPipsCache.get(key) || 0;
}
let slPips = 0;
try {
const slStats = computeSlStatsFromHistory(analystName, pair);
const effective = getEffectiveSlForAnalyst(analystName, pair, slStats);
if (effective && Number.isFinite(effective.pips)) {
slPips = effective.pips;
}
}
catch (e) {
}
if (!Number.isFinite(slPips) || slPips <= 0)
slPips = 0;
slPipsCache.set(key, slPips);
return slPips;
}
let baseRows = (Array.isArray(historySignals) ? historySignals : [])
.map((item) => {
if (!item)
return null;
const analystName = item.analyst || '';
const pair = item.pair || '';
if (!tf_isAnalystGloballySelected(analystName)) {
return null;
}
if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const upperPair = String(pair || '').toUpperCase();
if (upperPair && !selectedPairs.includes(upperPair)) {
return null;
}
}
if (selectedAnalystPairsMapHistory && typeof selectedAnalystPairsMapHistory === 'object') {
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapHistory, analystName);
if (Array.isArray(mapEntry)) {
const pairUpper = tf_normPairKey(pair || '');
if (!pairUpper) {
return null;
}
const match = mapEntry.some((p) => tf_normPairKey(p) === pairUpper);
if (!match) {
return null;
}
}
}
let pips = 0;
if (typeof item.pips === 'number') {
pips = item.pips;
}
else if (typeof item.pips === 'string') {
const parsed = parseFloat(item.pips);
if (Number.isFinite(parsed)) {
pips = parsed;
}
}
const absPips = Math.abs(pips);
const dollarPerPip = getDollarPerPipForAnalyst(null, pair);
const riskPercent = getRiskPercentForAnalyst(analystName, pair);
const lotFixed = getFixedLotCached(analystName, pair, dollarPerPip, riskPercent);
return {
...item,
analyst: analystName,
pair,
pips: pips,
absPips: absPips,
dollarPerPip: dollarPerPip,
riskPercent: riskPercent,
lotFixed: lotFixed
};
})
.filter(Boolean);
let minMonthIdx = null;
let maxMonthIdx = null;
try {
for (let i = 0; i < baseRows.length; i++) {
const mi = tf_sortKeyToMonthIndex(tf_getPrimarySortKey(baseRows[i]));
if (mi == null)
continue;
if (minMonthIdx == null || mi < minMonthIdx)
minMonthIdx = mi;
if (maxMonthIdx == null || mi > maxMonthIdx)
maxMonthIdx = mi;
}
}
catch (e) {
}
try {
tf_updateTradeRangeAvailabilityFromMonthSpan(minMonthIdx, maxMonthIdx);
}
catch (e) { }
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
const tf_closedKeyOf = (row) => {
const k = row && row.sortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
};
const tf_createdKeyOf = (row) => {
const k = row && row.createdSortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
};
const tf_calcKeyOf = (row) => {
const sk = tf_closedKeyOf(row);
return sk || tf_createdKeyOf(row);
};
const baseRowsForCalc = baseRows.slice().sort((a, b) => tf_calcKeyOf(a) - tf_calcKeyOf(b));
const monthKeys = [];
const monthSeen = new Set();
const tradesByMonth = Object.create(null);
for (let i = 0; i < baseRowsForCalc.length; i++) {
const rb = baseRowsForCalc[i];
const mk = tf_monthKeyFromSortKey(tf_calcKeyOf(rb));
if (!mk)
continue;
if (!monthSeen.has(mk)) {
monthSeen.add(mk);
monthKeys.push(mk);
}
if (!tradesByMonth[mk])
tradesByMonth[mk] = [];
tradesByMonth[mk].push(rb);
}
const tf_monthIndexFromMonthKey = (mk) => {
const parts = String(mk || '').split('-');
const y = parseInt(parts[0] || '0', 10);
const m = parseInt(parts[1] || '1', 10);
return (y * 12) + (m - 1);
};
const tf_monthKeyFromMonthIndex = (idx) => {
const y = Math.floor(idx / 12);
const m = (idx % 12) + 1;
const mm = String(m).padStart(2, '0');
return `${y}-${mm}`;
};
const fullMonthKeys = (monthKeys.length <= 1) ? monthKeys.slice() : (function () {
const startIdx = tf_monthIndexFromMonthKey(monthKeys[0]);
const endIdx = tf_monthIndexFromMonthKey(monthKeys[monthKeys.length - 1]);
const out = [];
for (let mi = startIdx; mi <= endIdx; mi++) {
out.push(tf_monthKeyFromMonthIndex(mi));
}
return out;
})();
try {
tf_setCompoundSubRowsVisible((equityMetric === 'usd') && (riskMode === 'compound'));
}
catch (e) { }
try {
tf_updateHistoryBalanceHeaderLabel(riskMode);
}
catch (e) { }
try {
tf_renderCompoundMonthsOptions(fullMonthKeys.length || monthKeys.length);
}
catch (e) { }
const periodMonths = (riskMode === 'compound') ? Math.max(1, Math.floor(compoundMonths || 1)) : 1;
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const mkey = fullMonthKeys[i];
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[mkey] = fullMonthKeys[startIndex] || mkey;
}
const startingBalance = Number.isFinite(currentBalance) ? currentBalance : 0;
let runningEquity = startingBalance;
let runningTrade = startingBalance;
const rows = [];
const compoundLotCache = new Map();
const periodStartBalanceCache = {};
const firstPeriodStartKey = (riskMode === 'compound' && fullMonthKeys && fullMonthKeys.length)
? (monthToPeriodStart[fullMonthKeys[0]] || fullMonthKeys[0])
: null;
if (riskMode === 'compound' && firstPeriodStartKey) {
periodStartBalanceCache[firstPeriodStartKey] = startingBalance;
}
const wEnabled = (equityMetric === 'usd') && !!withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0;
const wAmt = wEnabled ? Math.max(0, withdrawAmount) : 0;
const wEvery = wEnabled ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths || 1))) : 1;
const firstMonthInCurrentRange = (fullMonthKeys && fullMonthKeys.length) ? fullMonthKeys[0] : null;
const skipWithdrawMonthKey = (firstMonthInCurrentRange && firstMonthInCurrentRange >= TF_WITHDRAW_MIN_MONTHKEY) ? firstMonthInCurrentRange : null;
const tf_monthStartEquityAfterWithdraw = Object.create(null);
const tf_monthEndEquity = Object.create(null);
const tf_monthStartTradeAfterWithdraw = Object.create(null);
const tf_monthEndTrade = Object.create(null);
let tf_currentSizingBase = startingBalance;
let tf_currentPeriodStartKey = firstPeriodStartKey;
let tf_doubleAchievedEver = false;
let tf_maxEquityEver = Number.isFinite(startingBalance) ? startingBalance : 0;
for (let mIndex = 0; mIndex < fullMonthKeys.length; mIndex++) {
const monthKey = fullMonthKeys[mIndex];
const periodStartKey = monthToPeriodStart[monthKey] || monthKey;
if (riskMode === 'compound') {
if (tf_currentPeriodStartKey !== periodStartKey) {
tf_currentPeriodStartKey = periodStartKey;
tf_currentSizingBase = (monthKey === firstMonthInCurrentRange) ? startingBalance : runningEquity;
try {
compoundLotCache.clear();
}
catch (e) { }
}
periodStartBalanceCache[periodStartKey] = tf_currentSizingBase;
}
const tf_withdrawScheduled = (wEnabled && tf_isWithdrawDueMonth(monthKey, wEvery) && (!skipWithdrawMonthKey || monthKey !== skipWithdrawMonthKey));
let tf_withdrawEligible = false;
let tf_withdrawAutoUntick = false;
if (tf_withdrawScheduled) {
tf_withdrawEligible = true;
if (mIndex <= 0) {
tf_withdrawEligible = false;
}
else {
const __prevMonthKey = fullMonthKeys[mIndex - 1];
const __prevPrevMonthKey = (mIndex - 2 >= 0) ? fullMonthKeys[mIndex - 2] : null;
const __prevStart = (mIndex - 2 < 0)
? startingBalance
: ((__prevPrevMonthKey && Number.isFinite(tf_monthEndEquity[__prevPrevMonthKey]))
? tf_monthEndEquity[__prevPrevMonthKey]
: startingBalance);
const __prevEnd = (__prevMonthKey && Number.isFinite(tf_monthEndEquity[__prevMonthKey]))
? tf_monthEndEquity[__prevMonthKey]
: __prevStart;
if (!tf_doubleAchievedEver) {
if (!Number.isFinite(__prevStart) || __prevStart <= 0 || !Number.isFinite(__prevEnd) || (__prevEnd < (__prevStart * 1.10))) {
tf_withdrawEligible = false;
}
if (tf_withdrawEligible && Number.isFinite(__prevStart) && __prevStart > 0 && Number.isFinite(__prevEnd) && (__prevEnd <= (__prevStart * 0.80))) {
tf_withdrawEligible = false;
}
}
}
if (!tf_withdrawEligible) {
tf_withdrawAutoUntick = true;
}
}
if (tf_withdrawScheduled) {
const wSortKey = tf_firstDaySortKeyFromMonthKey(monthKey);
const wDateLabel = tf_firstDayDisplayDateFromMonthKey(monthKey);
const __balBeforeWithdraw = runningEquity;
let __balAfterWithdraw = __balBeforeWithdraw;
if (tf_withdrawEligible) {
runningEquity -= wAmt;
__balAfterWithdraw = runningEquity;
}
try {
if (Number.isFinite(runningEquity) && runningEquity > tf_maxEquityEver)
tf_maxEquityEver = runningEquity;
if (!tf_doubleAchievedEver && Number.isFinite(startingBalance) && startingBalance > 0 && tf_maxEquityEver >= (startingBalance * 2)) {
tf_doubleAchievedEver = true;
}
}
catch (e) { }
let __withdrawDenom = 0;
if (riskMode === 'fixed') {
__withdrawDenom = startingBalance;
}
else {
__withdrawDenom = __balBeforeWithdraw;
}
let __withdrawPct = 0;
if (Number.isFinite(__withdrawDenom) && __withdrawDenom !== 0) {
__withdrawPct = (-wAmt / __withdrawDenom) * 100;
}
rows.push({
isWithdraw: true,
__tfWithdrawEligible: !!tf_withdrawEligible,
__tfWithdrawAutoUntick: !!tf_withdrawAutoUntick,
withdrawMonthKey: monthKey,
withdrawAmount: wAmt,
sortKey: wSortKey,
createdSortKey: wSortKey,
createdDate: wDateLabel,
displayDate: wDateLabel,
analyst: 'Withdraw',
pair: 'User',
lot: 0,
pnlPips: 0,
pnlDollar: -wAmt,
pnlPercent: __withdrawPct,
dollarTP: 0,
dollarSL: wAmt,
balancePnl: __balAfterWithdraw,
balanceCompound: (riskMode === 'compound') ? __balBeforeWithdraw : startingBalance,
balanceTradeOnly: runningTrade,
});
if (riskMode === 'compound' && tf_withdrawEligible) {
tf_currentSizingBase = runningEquity;
try {
compoundLotCache.clear();
}
catch (e) { }
try {
periodStartBalanceCache[periodStartKey] = tf_currentSizingBase;
}
catch (e) { }
}
}
try {
tf_monthStartEquityAfterWithdraw[monthKey] = runningEquity;
}
catch (e) { }
try {
tf_monthStartTradeAfterWithdraw[monthKey] = runningTrade;
}
catch (e) { }
try {
const monthTrades = tradesByMonth[monthKey] || [];
for (let j = 0; j < monthTrades.length; j++) {
const rowBase = monthTrades[j];
const mk = monthKey;
const pStart = periodStartKey;
const baseBalanceForPeriod = (riskMode === 'compound' && Number.isFinite(tf_currentSizingBase))
? tf_currentSizingBase
: startingBalance;
const riskPercent = Math.max(0, Number(rowBase.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(rowBase.dollarPerPip) || 0);
const pnlPips = Number(rowBase.pips) || 0;
let lot = 0;
if (riskMode === 'fixed') {
lot = Number(rowBase.lotFixed) || 0;
}
else {
const baseForSizing = Math.max(0, Number(baseBalanceForPeriod) || 0);
const key = `${pStart}|${rowBase.analyst}|${rowBase.pair}|B${Math.round(baseForSizing * 100)}`;
if (!compoundLotCache.has(key)) {
const slPips = getEffectiveSlPipsCached(rowBase.analyst, rowBase.pair);
let lotC = 0;
if (slPips > 0 && dollarPerPip > 0 && riskPercent >= 0) {
lotC = computeLot(baseForSizing, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(lotC) || lotC <= 0) {
lotC = 0;
}
else {
lotC = roundLotToTwoDecimals(lotC);
}
}
compoundLotCache.set(key, lotC);
}
lot = compoundLotCache.get(key) || 0;
}
const pnlDollarRaw = pnlPips * lot * dollarPerPip;
const pnlDollar = Number.isFinite(pnlDollarRaw) ? pnlDollarRaw : 0;
const pipsTP = pnlPips > 0 ? pnlPips : 0;
const pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
const dollarTP = pnlDollar > 0 ? pnlDollar : 0;
const dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(baseBalanceForPeriod) || 0;
const pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
runningTrade += pnlDollar;
runningEquity += pnlDollar;
try {
if (Number.isFinite(runningEquity) && runningEquity > tf_maxEquityEver)
tf_maxEquityEver = runningEquity;
if (!tf_doubleAchievedEver && Number.isFinite(startingBalance) && startingBalance > 0 && tf_maxEquityEver >= (startingBalance * 2)) {
tf_doubleAchievedEver = true;
}
}
catch (e) { }
const __balanceColValue = (riskMode === 'compound') ? baseBalanceForPeriod : startingBalance;
rows.push({
...rowBase,
lot,
pnlPips,
pipsTP,
pipsSL,
dollarTP,
dollarSL,
pnlDollar,
pnlPercent,
balancePnl: runningEquity,
balanceCompound: __balanceColValue,
balanceTradeOnly: runningTrade,
});
}
try {
tf_monthEndEquity[monthKey] = runningEquity;
}
catch (e) { }
try {
tf_monthEndTrade[monthKey] = runningTrade;
}
catch (e) { }
}
catch (e) { }
}
const tbody = document.querySelector('#history-table tbody');
if (!tbody)
return;
tbody.innerHTML = '';
try {
const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
const trStart = document.createElement('tr');
trStart.className = 'tf-start-balance-row';
const tdStart = document.createElement('td');
tdStart.colSpan = Math.max(1, tf_getVisibleHistoryColumnKeys().length + 1);
tdStart.className = 'mono';
const sbLabel = (riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
tdStart.textContent = sbLabel + ' : ' + formatMoney(startBal);
trStart.appendChild(tdStart);
tbody.appendChild(trStart);
}
catch (e) { }
const rowsForDisplay = rows.slice().sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
try {
let __runEq = startingBalance;
let __runTrade = startingBalance;
for (let i = 0; i < rowsForDisplay.length; i++) {
const r = rowsForDisplay[i];
if (!r)
continue;
const __pnl = (Number.isFinite(r.pnlDollar) ? r.pnlDollar : ((r.dollarTP || 0) - (r.dollarSL || 0)));
if (r.isWithdraw) {
const __before = __runEq;
__runEq += __pnl;
r.balancePnl = __runEq;
r.balanceTradeOnly = __runTrade;
if (riskMode === 'fixed') {
r.balanceCompound = startingBalance;
}
else {
r.balanceCompound = __before;
}
}
else {
__runTrade += __pnl;
__runEq += __pnl;
r.balancePnl = __runEq;
r.balanceTradeOnly = __runTrade;
if (riskMode === 'fixed') {
r.balanceCompound = startingBalance;
}
}
}
}
catch (e) { }
const priceBusy = tf_isMyfxbookPriceLoading();
const rowsForUi = tf_getHistoryRowsForUiAndExport(rowsForDisplay);
try {
window.__tfHistoryDynamicTradeCount = Array.isArray(rowsForUi)
? rowsForUi.filter((r) => !(r && r.isWithdraw)).length
: 0;
}
catch (e) { window.__tfHistoryDynamicTradeCount = 0; }
try {
tf_lastVisibleHistoryRowIds = Array.isArray(rowsForUi) ? rowsForUi.map(r => tf_historyRowId(r)).filter(Boolean) : [];
tf_lastEligibleHistoryRowIds = Array.isArray(rowsForUi)
? rowsForUi.filter(r => tf_isHistoryRowEligibleForAllToggle(r)).map(r => tf_historyRowId(r)).filter(Boolean)
: [];
}
catch (e) {
tf_lastVisibleHistoryRowIds = [];
tf_lastEligibleHistoryRowIds = [];
}
try {
tf_recomputeBalancesSkippingDisabled(rowsForUi, startingBalance, riskMode);
}
catch (e) { }
const rowsForCalc = Array.isArray(rowsForUi) ? rowsForUi.filter(r => tf_isHistoryRowEnabled(r)) : [];
try {
lastHistoryRowsForExport = rowsForCalc.slice();
}
catch (e) {
lastHistoryRowsForExport = [];
}
try {
tf_renderAnalystPerformanceTablesFromRows(rowsForCalc);
}
catch (e) { }
rowsForUi.forEach((row) => {
const isWithdrawRow = !!(row && row.isWithdraw);
const tr = document.createElement('tr');
if (isWithdrawRow) {
tr.className = 'tf-withdraw-row';
}
const __rowId = tf_historyRowId(row);
const __enabled = tf_isHistoryRowEnabled(__rowId);
if (!__enabled) {
try {
tr.classList.add('tf-row-disabled');
}
catch (e) { }
}
const cbCell = document.createElement('td');
cbCell.className = 'tf-history-cb-cell';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.className = 'tf-history-row-cb';
cb.checked = !!__enabled;
cb.addEventListener('change', () => {
tf_captureHistoryTableScrollForRestore();
tf_setHistoryRowEnabled(__rowId, cb.checked);
recomputeHistoryRows();
});
cbCell.appendChild(cb);
tr.appendChild(cbCell);
const createdCell = tf_markHistoryCell(document.createElement('td'), 'created');
createdCell.classList.add('mono');
createdCell.textContent = row.createdDate || row.displayDate || '';
tr.appendChild(createdCell);
const dateCell = tf_markHistoryCell(document.createElement('td'), 'closed');
dateCell.classList.add('mono');
dateCell.textContent = row.displayDate || row.createdDate || '';
tr.appendChild(dateCell);
const analystCell = tf_markHistoryCell(document.createElement('td'), 'analyst');
analystCell.textContent = isWithdrawRow ? 'Withdraw' : formatAnalystDisplayName(row.analyst || '');
analystCell.title = isWithdrawRow ? 'Withdraw' : String(row.analyst || '').trim();
tr.appendChild(analystCell);
const balanceCompoundCell = tf_markHistoryCell(document.createElement('td'), 'balance');
balanceCompoundCell.classList.add('text-right', 'mono');
balanceCompoundCell.textContent = Number.isFinite(row.balanceCompound)
? formatMoney(row.balanceCompound)
: formatMoney(startingBalance || 0);
tr.appendChild(balanceCompoundCell);
const tfPickHistoryDetail = (keys) => {
if (isWithdrawRow)
return '';
for (let i = 0; i < keys.length; i++) {
const value = row ? row[keys[i]] : '';
if (value !== null && value !== undefined && String(value).trim() !== '') {
return String(value).trim();
}
}
return '';
};
const entryCell = tf_markHistoryCell(document.createElement('td'), 'entry');
entryCell.classList.add('mono');
entryCell.textContent = tfPickHistoryDetail(['entry', 'price']);
tr.appendChild(entryCell);
const takeProfitCell = tf_markHistoryCell(document.createElement('td'), 'takeProfit');
takeProfitCell.classList.add('mono');
takeProfitCell.textContent = tfPickHistoryDetail(['takeProfit', 'take_profit', 'tp']);
tr.appendChild(takeProfitCell);
const stopLossCell = tf_markHistoryCell(document.createElement('td'), 'stopLoss');
stopLossCell.classList.add('mono');
stopLossCell.textContent = tfPickHistoryDetail(['stopLoss', 'stop_loss', 'sl']);
tr.appendChild(stopLossCell);
const typeCell = tf_markHistoryCell(document.createElement('td'), 'type');
const typeText = tfPickHistoryDetail(['type', 'side', 'orderType']);
typeCell.textContent = typeText;
if (/^buy$/i.test(typeText))
typeCell.classList.add('tf-history-type-buy');
else if (/^sell$/i.test(typeText))
typeCell.classList.add('tf-history-type-sell');
tr.appendChild(typeCell);
const pairCell = tf_markHistoryCell(document.createElement('td'), 'pair');
pairCell.textContent = isWithdrawRow ? '' : (row.pair || '');
tr.appendChild(pairCell);
const lotCell = tf_markHistoryCell(document.createElement('td'), 'lot');
lotCell.className = 'text-right mono';
if (isWithdrawRow) {
lotCell.textContent = '-';
}
else if (priceBusy) {
lotCell.innerHTML = tf_spinnerHTML(true);
}
else {
lotCell.textContent = formatNumber(row.lot, 2);
}
tr.appendChild(lotCell);
const pnlPipsCell = tf_markHistoryCell(document.createElement('td'), 'pnlPips');
pnlPipsCell.className = 'text-right mono ' + ((row.pnlPips >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPipsCell.className = 'text-right mono sl';
pnlPipsCell.textContent = '-';
}
else {
pnlPipsCell.textContent = row.pnlPips ? formatNumber(row.pnlPips, 1) : '0';
}
tr.appendChild(pnlPipsCell);
const pnlDollarCell = tf_markHistoryCell(document.createElement('td'), 'pnlDollar');
pnlDollarCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
const wd = Number.isFinite(row.pnlDollar) ? row.pnlDollar : (-(Math.abs(Number(row.withdrawAmount) || 0)));
pnlDollarCell.className = 'text-right mono sl';
pnlDollarCell.textContent = formatMoney(wd || 0);
}
else if (priceBusy) {
pnlDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlDollarCell.textContent = row.pnlDollar ? formatMoney(row.pnlDollar) : formatMoney(0);
}
tr.appendChild(pnlDollarCell);
const pnlPercentCell = tf_markHistoryCell(document.createElement('td'), 'pnlPercent');
pnlPercentCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPercentCell.className = 'text-right mono sl';
pnlPercentCell.textContent = '—';
}
else if (priceBusy) {
pnlPercentCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlPercentCell.textContent = Number.isFinite(row.pnlPercent) ? (formatNumber(row.pnlPercent, 2) + '%') : '0%';
}
tr.appendChild(pnlPercentCell);
const balanceCell = tf_markHistoryCell(document.createElement('td'), 'balancePnl');
balanceCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
balanceCell.className = 'text-right mono sl';
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
else if (priceBusy) {
balanceCell.innerHTML = tf_spinnerHTML(true);
}
else {
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
tr.appendChild(balanceCell);
tbody.appendChild(tr);
});
try {
tf_applyHistoryColumnVisibility();
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
computeAndRenderDrawdownStats(rowsForCalc.filter(r => !r.isWithdraw));
try {
const allCb = document.getElementById('history-all-checkbox');
if (allCb) {
const ids = Array.isArray(tf_lastEligibleHistoryRowIds) ? tf_lastEligibleHistoryRowIds : [];
const total = ids.length;
let enabledCount = 0;
for (let i = 0; i < ids.length; i++) {
if (tf_isHistoryRowEnabled(ids[i]))
enabledCount++;
}
if (total === 0) {
allCb.indeterminate = false;
allCb.checked = true;
}
else if (enabledCount === 0) {
allCb.indeterminate = false;
allCb.checked = false;
}
else if (enabledCount === total) {
allCb.indeterminate = false;
allCb.checked = true;
}
else {
allCb.checked = true;
allCb.indeterminate = true;
}
}
}
catch (e) { }
lastHistoryRiskMode = riskMode;
lastHistoryRows = rowsForDisplay.slice();
updateEquityCurveFromRows(rowsForDisplay);
try {
tf_syncMonthlyTableToTradeRange();
}
catch (e) { }
applyHistoryTableScroll();
}
function updateEquityCurveFromRows(rows) {
const canvas = document.getElementById('equity-curve-canvas');
const emptyNote = document.getElementById('equity-empty-note');
const tooltip = document.getElementById('equity-tooltip');
if (!canvas) {
return;
}
try {
if (emptyNote && emptyNote.dataset && emptyNote.dataset.origHtml) {
emptyNote.innerHTML = emptyNote.dataset.origHtml;
}
}
catch (e) { }
if (tf_isMyfxbookPriceLoading() && equityMetric === 'usd') {
try {
const ctx = canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
}
catch (e) { }
if (emptyNote) {
try {
if (!emptyNote.dataset.origHtml) {
emptyNote.dataset.origHtml = emptyNote.innerHTML;
}
}
catch (e) { }
emptyNote.style.display = 'block';
emptyNote.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:7.2px;">' + tf_spinnerHTML(true) + '<span>Loading price…</span></div>';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
equityCurvePoints = [];
if (!rows || rows.length === 0) {
const ctx = canvas.getContext && canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
const keys = rows
.map((row) => { const k = tf_getPrimarySortKey(row); return (typeof k === 'number' && isFinite(k) ? k : null); })
.filter((k) => k !== null);
if (!keys.length) {
const ctx = canvas.getContext && canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
const minKey = Math.min.apply(null, keys);
const maxKey = Math.max.apply(null, keys);
equityFilterMin = minKey;
equityFilterMax = maxKey;
if (equityFilterStart === null || equityFilterStart < equityFilterMin || equityFilterStart > equityFilterMax) {
equityFilterStart = equityFilterMin;
}
if (equityFilterEnd === null || equityFilterEnd > equityFilterMax || equityFilterEnd < equityFilterMin) {
equityFilterEnd = equityFilterMax;
}
if (equityFilterEnd < equityFilterStart) {
equityFilterStart = equityFilterMin;
equityFilterEnd = equityFilterMax;
}
const startInput = document.getElementById('equity-start-date');
const endInput = document.getElementById('equity-end-date');
if (startInput && endInput) {
const minStr = formatDateInputFromSortKey(equityFilterMin);
const maxStr = formatDateInputFromSortKey(equityFilterMax);
startInput.min = minStr;
startInput.max = maxStr;
endInput.min = minStr;
endInput.max = maxStr;
startInput.value = formatDateInputFromSortKey(equityFilterStart);
endInput.value = formatDateInputFromSortKey(equityFilterEnd);
}
try {
tf_syncHistoryDateInputsFromState();
}
catch (e) { }
const startDayKey = parseDateInputToSortKey(formatDateInputFromSortKey(equityFilterStart));
const endDayKey = parseDateInputToSortKey(formatDateInputFromSortKey(equityFilterEnd));
const filteredRows = rows.filter((row) => {
const k = tf_getPrimarySortKey(row);
if (k === null)
return false;
const dOnly = parseDateInputToSortKey(formatDateInputFromSortKey(k));
if (startDayKey !== null && dOnly < startDayKey)
return false;
if (endDayKey !== null && dOnly > endDayKey)
return false;
return true;
});
const ctx = canvas.getContext && canvas.getContext('2d');
const __rowsEnabled = Array.isArray(filteredRows)
? filteredRows.filter((r) => tf_isHistoryRowEnabled(r))
: [];
const enabledRows = tf_applyStartTradeCreatedClosedRule(__rowsEnabled);
try {
tf_lastEquityCalcRows = Array.isArray(enabledRows) ? enabledRows.slice() : [];
}
catch (e) {
tf_lastEquityCalcRows = [];
}
if (!enabledRows.length) {
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
emptyNote.textContent = 'Tidak ada data history dalam rentang tanggal yang dipilih.';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
if (emptyNote) {
emptyNote.style.display = 'none';
emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
}
let equity = equityMetric === 'usd' ? (currentBalance || 0) : 0;
try {
const first = enabledRows[0] || null;
const firstKey = (first ? tf_getPrimarySortKey(first) : null);
equityCurvePoints.push({
index: 0,
sortKey: (firstKey !== null ? (firstKey - 1) : null),
date: (equityMetric === 'usd') ? 'Start Balance' : 'Start',
analyst: '',
pair: '',
dollarTP: 0,
dollarSL: 0,
pnlDollar: 0,
pnlPips: 0,
pnlPercent: 0,
pnlValue: 0,
equity: equity,
isStart: true
});
}
catch (e) { }
enabledRows.forEach((row, index) => {
const pnlDollar = (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.dollarSL || 0)));
const pnlPips = typeof row.pnlPips === 'number' && isFinite(row.pnlPips) ? row.pnlPips : 0;
const pnlValue = equityMetric === 'usd' ? pnlDollar : pnlPips;
equity += pnlValue;
equityCurvePoints.push({
index: index + 1,
sortKey: tf_getPrimarySortKey(row),
date: (row.displayDate || row.createdDate || ''),
analyst: row.analyst || '',
pair: row.pair || '',
dollarTP: row.dollarTP || 0,
dollarSL: row.dollarSL || 0,
pnlDollar: pnlDollar,
pnlPips: pnlPips,
pnlPercent: Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0,
pnlValue: pnlValue,
equity: equity,
isWithdraw: !!row.isWithdraw
});
});
try {
equityDailyCandles = tf_buildEquityDailyCandlesFromPoints(equityCurvePoints);
if (equityChartMode === 'candle') {
if (equityCandleViewEnd === null)
tf_resetEquityCandleViewportToFull();
tf_clampEquityCandleViewport();
}
}
catch (e) {
equityDailyCandles = [];
}
drawEquityCurve();
computeAndRenderEquityDrawdownSummary();
}
function applyEquityDateFilterFromInputs() {
const startInput = document.getElementById('equity-start-date');
const endInput = document.getElementById('equity-end-date');
if (!startInput || !endInput)
return;
if (equityFilterMin === null || equityFilterMax === null)
return;
const startVal = startInput.value;
const endVal = endInput.value;
if (!startVal || !endVal) {
alert('Mohon pilih tanggal mulai dan selesai.');
return;
}
let startKey = parseDateInputToSortKey(startVal);
let endKey = parseDateInputToSortKey(endVal);
if (startKey === null || endKey === null) {
alert('Format tanggal tidak valid.');
return;
}
if (startKey < equityFilterMin)
startKey = equityFilterMin;
if (startKey > equityFilterMax)
startKey = equityFilterMax;
if (endKey > equityFilterMax)
endKey = equityFilterMax;
if (endKey < equityFilterMin)
endKey = equityFilterMin;
if (endKey < startKey) {
alert('Tanggal akhir tidak boleh lebih kecil dari tanggal awal.');
return;
}
equityFilterStart = startKey;
equityFilterEnd = endKey;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function resetEquityDateFilterToFullRange() {
if (equityFilterMin === null || equityFilterMax === null) {
return;
}
equityFilterStart = equityFilterMin;
equityFilterEnd = equityFilterMax;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function applyHistoryDateFilterFromInputs() {
const startInput = document.getElementById('history-start-date');
const endInput = document.getElementById('history-end-date');
if (!startInput || !endInput) {
return applyEquityDateFilterFromInputs();
}
if (equityFilterMin === null || equityFilterMax === null) {
alert('Belum ada data history untuk menentukan range tanggal.');
return;
}
const startVal = (startInput.value || '').trim();
const endVal = (endInput.value || '').trim();
if (!startVal || !endVal) {
alert('Mohon pilih tanggal mulai dan selesai.');
return;
}
let startKey = parseDateInputToSortKey(startVal);
let endKey = parseDateInputToSortKey(endVal);
if (startKey === null || endKey === null) {
alert('Format tanggal tidak valid.');
return;
}
if (startKey < equityFilterMin)
startKey = equityFilterMin;
if (startKey > equityFilterMax)
startKey = equityFilterMax;
if (endKey > equityFilterMax)
endKey = equityFilterMax;
if (endKey < equityFilterMin)
endKey = equityFilterMin;
if (endKey < startKey) {
alert('Tanggal akhir tidak boleh lebih kecil dari tanggal awal.');
return;
}
equityFilterStart = startKey;
equityFilterEnd = endKey;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function resetHistoryDateFilterToFullRange() {
return resetEquityDateFilterToFullRange();
}
function drawEquityCurve() {
const canvas = document.getElementById('equity-curve-canvas');
if (!canvas || !canvas.getContext)
return;
const ctx = canvas.getContext('2d');
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const width = wrapper.clientWidth || 0;
const baseHeight = 450;
if (!width)
return;
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = baseHeight * dpr;
canvas.style.width = width + 'px';
canvas.style.height = baseHeight + 'px';
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.clearRect(0, 0, width, baseHeight);
if (!equityCurvePoints.length)
return;
const paddingLeft = 48;
const paddingRight = 18;
const paddingTop = 18;
const paddingBottom = 44;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = baseHeight - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const isCandleMode = (equityChartMode === 'candle');
let minYRaw = Infinity;
let maxYRaw = -Infinity;
let candleView = null;
if (isCandleMode) {
const candles = Array.isArray(equityDailyCandles) ? equityDailyCandles : [];
if (candles.length) {
try {
tf_clampEquityCandleViewport();
}
catch (e) { }
const s = Math.max(0, Math.min(candles.length - 1, equityCandleViewStart || 0));
const e = (equityCandleViewEnd === null) ? (candles.length - 1) : Math.max(0, Math.min(candles.length - 1, equityCandleViewEnd));
candleView = { candles: candles, start: s, end: e };
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const lo = Number(c.low);
const hi = Number(c.high);
if (isFinite(lo))
minYRaw = Math.min(minYRaw, lo);
if (isFinite(hi))
maxYRaw = Math.max(maxYRaw, hi);
const o = Number(c.open);
const cl = Number(c.close);
if (isFinite(o)) {
minYRaw = Math.min(minYRaw, o);
maxYRaw = Math.max(maxYRaw, o);
}
if (isFinite(cl)) {
minYRaw = Math.min(minYRaw, cl);
maxYRaw = Math.max(maxYRaw, cl);
}
}
}
}
if (!isFinite(minYRaw) || !isFinite(maxYRaw)) {
for (let i = 0; i < equityCurvePoints.length; i++) {
const v = Number(equityCurvePoints[i] && equityCurvePoints[i].equity);
if (!isFinite(v))
continue;
minYRaw = Math.min(minYRaw, v);
maxYRaw = Math.max(maxYRaw, v);
}
}
if (!isFinite(minYRaw) || !isFinite(maxYRaw))
return;
// REV340 PC: Line Chart + Candle Stick use actual USD balance with the Y-axis
// starting exactly $1,000 below the initial balance input.
const tfEqStartBalanceV340 = (equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity)))
? Number(equityCurvePoints[0].equity)
: (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0);
const tfEqAxisFloorV340 = tfEqStartBalanceV340 - 1000;
if (equityMetric === 'usd') {
const rawTopV340 = Math.max(Number(maxYRaw) || 0, tfEqStartBalanceV340);
const spanV340 = Math.max(1000, rawTopV340 - tfEqAxisFloorV340);
const stepV340 = Math.max(1000, Math.ceil((spanV340 / 4) / 1000) * 1000);
minYRaw = tfEqAxisFloorV340;
maxYRaw = tfEqAxisFloorV340 + stepV340 * 4;
} else if (minYRaw === maxYRaw) {
const delta = Math.max(10, Math.abs(minYRaw) * 0.02);
minYRaw -= delta;
maxYRaw += delta;
}
else {
const pad = (maxYRaw - minYRaw) * 0.08;
minYRaw -= pad;
maxYRaw += pad;
}
let tMin = minYRaw;
let tMax = maxYRaw;
function toT(v) { return v; }
function fromT(t) { return t; }
function xForIndex(i) {
if (equityCurvePoints.length === 1) {
return paddingLeft + chartWidth / 2;
}
const t = i / (equityCurvePoints.length - 1);
return paddingLeft + t * chartWidth;
}
function yForVal(v) {
if (tMax === tMin)
return paddingTop + chartHeight / 2;
const tv = toT(v);
const tt = (tv - tMin) / (tMax - tMin);
return paddingTop + (1 - tt) * chartHeight;
}
ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([4, 4]);
ctx.font = '10px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = '#9ca3af';
const steps = 4;
for (let i = 0; i <= steps; i++) {
const t = i / steps;
const tVal = tMin + (tMax - tMin) * t;
const value = fromT(tVal);
const y = yForVal(value);
ctx.beginPath();
ctx.moveTo(paddingLeft, y);
ctx.lineTo(width - paddingRight, y);
ctx.stroke();
const text = formatEquityMetricAxis(value);
ctx.fillText(text, 4, y + 3);
}
ctx.setLineDash([]);
if (isCandleMode && candleView && candleView.candles && candleView.candles.length) {
try {
const candles = candleView.candles;
const s = candleView.start;
const e = candleView.end;
const visCount = Math.max(1, e - s + 1);
const stepX = chartWidth / visCount;
let candleW = stepX * 0.78;
const maxW = Math.min(24, stepX * 0.92);
const minW = Math.min(Math.max(0.6, stepX * 0.25), stepX * 0.92);
candleW = Math.max(minW, Math.min(maxW, candleW));
equityCandleDrawMetrics = {
paddingLeft: paddingLeft,
paddingRight: paddingRight,
paddingTop: paddingTop,
paddingBottom: paddingBottom,
chartWidth: chartWidth,
chartHeight: chartHeight,
viewStart: s,
viewEnd: e,
stepX: stepX,
visCount: visCount
};
function xForCandleAbsIndex(absIdx) {
const j = absIdx - s;
return paddingLeft + stepX * (j + 0.5);
}
try {
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const marks = [];
let prevKey = null;
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c || !c.dayTs)
continue;
const d = new Date(c.dayTs);
const key = d.getFullYear() + '-' + d.getMonth();
if (prevKey === null || key !== prevKey) {
prevKey = key;
marks.push({ idx: i, date: d });
}
}
if (marks.length) {
ctx.save();
ctx.strokeStyle = 'rgba(255,255,255,0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([3, 4]);
marks.forEach((m) => {
const x = xForCandleAbsIndex(m.idx);
ctx.beginPath();
ctx.moveTo(x, paddingTop);
ctx.lineTo(x, paddingTop + chartHeight);
ctx.stroke();
});
ctx.restore();
ctx.save();
ctx.setLineDash([]);
ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.70)';
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
const labelY1 = paddingTop + chartHeight + 14;
const labelY2 = labelY1 + 10;
let lastX = -1e9;
marks.forEach((m) => {
const x = xForCandleAbsIndex(m.idx);
if (x - lastX < 42)
return;
lastX = x;
const mo = monthNames[m.date.getMonth()] || '';
const yy = String(m.date.getFullYear());
ctx.fillText(mo, x, labelY1);
ctx.fillText(yy, x, labelY2);
});
ctx.restore();
}
}
catch (e) { }
ctx.save();
ctx.setLineDash([]);
ctx.lineWidth = 1.2;
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const xC = xForCandleAbsIndex(i);
const openY = yForVal(c.open);
const closeY = yForVal(c.close);
const highY = yForVal(c.high);
const lowY = yForVal(c.low);
const isUp = (Number(c.close) >= Number(c.open));
ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';
ctx.beginPath();
ctx.moveTo(xC, highY);
ctx.lineTo(xC, lowY);
ctx.stroke();
const topY = Math.min(openY, closeY);
const botY = Math.max(openY, closeY);
const bodyH = Math.max(2, botY - topY);
ctx.beginPath();
ctx.rect(xC - candleW / 2, topY, candleW, bodyH);
ctx.fill();
ctx.stroke();
}
ctx.restore();
ctx.save();
ctx.beginPath();
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const x = xForCandleAbsIndex(i);
const y = yForVal(c.close);
if (i === s)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
}
ctx.strokeStyle = 'rgba(56, 189, 248, 0.60)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.restore();
if (equityCrosshairX !== null && equityCrosshairY !== null) {
const cx = equityCrosshairX;
const cy = equityCrosshairY;
ctx.beginPath();
ctx.moveTo(cx, paddingTop);
ctx.lineTo(cx, paddingTop + chartHeight);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(paddingLeft, cy);
ctx.lineTo(paddingLeft + chartWidth, cy);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
ctx.lineWidth = 1;
ctx.stroke();
}
if (equityCandleHoverIndex !== null && equityCandleHoverIndex >= s && equityCandleHoverIndex <= e) {
const c = candles[equityCandleHoverIndex];
if (c) {
const x = xForCandleAbsIndex(equityCandleHoverIndex);
const y = yForVal(c.close);
ctx.beginPath();
ctx.arc(x, y, 4, 0, Math.PI * 2);
ctx.fillStyle = '#38bdf8';
ctx.fill();
ctx.strokeStyle = '#0ea5e9';
ctx.lineWidth = 1.5;
ctx.stroke();
}
}
}
catch (e) { }
return;
}
function tf_parseEquityPointTs(pt) {
try {
if (!pt)
return null;
if (typeof pt.sortKey === 'number' && isFinite(pt.sortKey))
return pt.sortKey;
const raw = String(pt.date || pt.displayDate || '').trim();
if (!raw)
return null;
const parsed = Date.parse(raw);
if (!isNaN(parsed))
return parsed;
const s = raw.replace(/\s*(WIB\s*)+$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
}
catch (e) {
return null;
}
}
const tf_monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const monthMarkers = [];
let prevMonthKey = null;
for (let i = 0; i < equityCurvePoints.length; i++) {
const ts = tf_parseEquityPointTs(equityCurvePoints[i]);
if (!ts)
continue;
const d = new Date(ts);
const key = d.getFullYear() + '-' + d.getMonth();
if (prevMonthKey === null) {
prevMonthKey = key;
monthMarkers.push({ idx: i, date: d });
}
else if (key !== prevMonthKey) {
prevMonthKey = key;
monthMarkers.push({ idx: i, date: d });
}
}
if (monthMarkers.length > 0) {
ctx.save();
ctx.strokeStyle = 'rgba(255,255,255,0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([3, 4]);
for (const m of monthMarkers) {
const x = xForIndex(m.idx);
ctx.beginPath();
ctx.moveTo(x, paddingTop);
ctx.lineTo(x, paddingTop + chartHeight);
ctx.stroke();
}
ctx.restore();
ctx.save();
ctx.setLineDash([]);
ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.70)';
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
const labelY1 = paddingTop + chartHeight + 14;
const labelY2 = labelY1 + 10;
let lastLabelX = -1e9;
for (const m of monthMarkers) {
const x = xForIndex(m.idx);
if (x - lastLabelX < 36)
continue;
lastLabelX = x;
const mo = tf_monthNamesShort[m.date.getMonth()] || '';
const yy = String(m.date.getFullYear());
ctx.fillText(mo, x, labelY1);
ctx.fillText(yy, x, labelY2);
}
ctx.restore();
}
if (equityChartMode === 'candle') {
try {
const candles = [];
let cur = null;
for (let i = 1; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const ts = tf_parseEquityPointTs(p);
if (!ts)
continue;
const d = new Date(ts);
const dayKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const prev = equityCurvePoints[i - 1];
const prevEquity = prev && typeof prev.equity === 'number' && isFinite(prev.equity) ? prev.equity : null;
const nowEquity = p && typeof p.equity === 'number' && isFinite(p.equity) ? p.equity : null;
if (!cur || cur.dayKey !== dayKey) {
const open = prevEquity !== null ? prevEquity : (nowEquity !== null ? nowEquity : 0);
const first = nowEquity !== null ? nowEquity : open;
cur = {
dayKey: dayKey,
startIdx: i,
endIdx: i,
open: open,
high: Math.max(open, first),
low: Math.min(open, first),
close: first
};
candles.push(cur);
}
else {
const v = nowEquity !== null ? nowEquity : cur.close;
cur.endIdx = i;
cur.close = v;
if (v > cur.high)
cur.high = v;
if (v < cur.low)
cur.low = v;
}
}
if (candles.length) {
ctx.save();
ctx.setLineDash([]);
ctx.lineWidth = 1;
candles.forEach((c) => {
const xStart = xForIndex(c.startIdx);
const xEnd = xForIndex(c.endIdx);
const xC = (xStart + xEnd) / 2;
const openY = yForVal(c.open);
const closeY = yForVal(c.close);
const highY = yForVal(c.high);
const lowY = yForVal(c.low);
const isUp = c.close >= c.open;
ctx.strokeStyle = isUp ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)';
ctx.fillStyle = isUp ? 'rgba(34, 197, 94, 0.28)' : 'rgba(239, 68, 68, 0.28)';
ctx.beginPath();
ctx.moveTo(xC, highY);
ctx.lineTo(xC, lowY);
ctx.stroke();
const topY = Math.min(openY, closeY);
const botY = Math.max(openY, closeY);
const bodyH = Math.max(1.5, botY - topY);
let bodyW = Math.abs(xEnd - xStart) * 0.7;
if (!isFinite(bodyW))
bodyW = 0;
bodyW = Math.max(4, Math.min(22, bodyW));
const left = xC - bodyW / 2;
ctx.beginPath();
ctx.rect(left, topY, bodyW, bodyH);
ctx.fill();
ctx.stroke();
});
ctx.restore();
}
}
catch (e) { }
}
ctx.beginPath();
equityCurvePoints.forEach((p, idx) => {
const x = xForIndex(idx);
const y = yForVal(p.equity);
if (idx === 0)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
});
ctx.strokeStyle = (equityChartMode === 'candle') ? 'rgba(56, 189, 248, 0.65)' : '#38bdf8';
ctx.lineWidth = (equityChartMode === 'candle') ? 1.2 : 2;
ctx.stroke();
(function drawEquityHighlights() {
if (!Array.isArray(equityCurvePoints) || equityCurvePoints.length < 2)
return;
let peakEquity = null;
let peakIdx = 0;
let maxDd = 0;
let ddPeakIdx = 0;
let ddTroughIdx = 0;
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const e = p && typeof p.equity === 'number' ? p.equity : null;
if (e === null || !isFinite(e))
continue;
if (peakEquity === null) {
peakEquity = e;
peakIdx = i;
ddPeakIdx = i;
ddTroughIdx = i;
continue;
}
if (e > peakEquity) {
peakEquity = e;
peakIdx = i;
}
const dd = e - peakEquity;
if (dd < maxDd) {
maxDd = dd;
ddPeakIdx = peakIdx;
ddTroughIdx = i;
}
}
let bestStart = -1;
let bestEnd = -1;
let maxLen = 0;
let bestLossSum = 0;
let curStart = -1;
let curLen = 0;
let curLoss = 0;
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const pnl = equityMetric === 'usd'
? (p && typeof p.pnlDollar === 'number' ? p.pnlDollar : 0)
: (p && typeof p.pnlPips === 'number' ? p.pnlPips : 0);
if (pnl < 0) {
if (curLen === 0) {
curStart = i;
curLen = 1;
curLoss = pnl;
}
else {
curLen += 1;
curLoss += pnl;
}
if (curLen > maxLen || (curLen === maxLen && curLoss < bestLossSum)) {
maxLen = curLen;
bestLossSum = curLoss;
bestStart = curStart;
bestEnd = i;
}
}
else {
curStart = -1;
curLen = 0;
curLoss = 0;
}
}
const segments = [];
if (maxDd < 0 && ddTroughIdx > ddPeakIdx) {
segments.push({
name: 'drawdown',
start: ddPeakIdx,
end: ddTroughIdx,
color: '#fbbf24'
});
}
if (maxLen > 0 && bestStart !== -1 && bestEnd > bestStart) {
segments.push({
name: 'lossStreak',
start: bestStart,
end: bestEnd,
color: '#ef4444'
});
}
if (!segments.length)
return;
segments.sort((a, b) => {
const la = a.end - a.start;
const lb = b.end - b.start;
if (la !== lb)
return lb - la;
if (a.name === b.name)
return 0;
if (a.name === 'drawdown')
return -1;
return 1;
});
segments.forEach((seg, idx) => {
const isTop = idx === segments.length - 1;
ctx.beginPath();
for (let i = seg.start; i <= seg.end; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const x = xForIndex(i);
const y = yForVal(p.equity);
if (i === seg.start)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
}
ctx.strokeStyle = seg.color;
ctx.lineWidth = isTop ? 3 : 2;
ctx.stroke();
});
window.TF_EQUITY_HIGHLIGHTS = {
ddPeakIdx: ddPeakIdx,
ddTroughIdx: ddTroughIdx,
maxDd: maxDd,
lossStreakStartIdx: bestStart,
lossStreakEndIdx: bestEnd,
lossStreakLen: maxLen,
lossStreakLoss: bestLossSum
};
})();
try {
if (Array.isArray(equityCurvePoints) && equityCurvePoints.length > 1) {
const withdrawIdx = [];
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const isW = !!p.isWithdraw || (typeof p.analyst === 'string' && p.analyst.toLowerCase() === 'withdraw');
if (isW)
withdrawIdx.push(i);
}
if (withdrawIdx.length) {
ctx.save();
ctx.setLineDash([]);
ctx.strokeStyle = '#ef4444';
ctx.lineWidth = 4.2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
withdrawIdx.forEach((i) => {
if (i <= 0)
return;
const p0 = equityCurvePoints[i - 1];
const p1 = equityCurvePoints[i];
if (!p0 || !p1)
return;
const x0 = xForIndex(i - 1);
const y0 = yForVal(p0.equity);
const x1 = xForIndex(i);
const y1 = yForVal(p1.equity);
ctx.beginPath();
ctx.moveTo(x0, y0);
ctx.lineTo(x1, y1);
ctx.stroke();
});
ctx.restore();
}
}
}
catch (e) { }
if (equityCrosshairX !== null && equityCrosshairY !== null) {
const cx = equityCrosshairX;
const cy = equityCrosshairY;
ctx.beginPath();
ctx.moveTo(cx, paddingTop);
ctx.lineTo(cx, paddingTop + chartHeight);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(paddingLeft, cy);
ctx.lineTo(paddingLeft + chartWidth, cy);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
ctx.lineWidth = 1;
ctx.stroke();
}
if (equityHoverIndex !== null && equityHoverIndex >= 0 && equityHoverIndex < equityCurvePoints.length) {
const hp = equityCurvePoints[equityHoverIndex];
const x = xForIndex(equityHoverIndex);
const y = yForVal(hp.equity);
ctx.beginPath();
ctx.arc(x, y, 4, 0, Math.PI * 2);
ctx.fillStyle = '#38bdf8';
ctx.fill();
ctx.strokeStyle = '#0ea5e9';
ctx.lineWidth = 1.5;
ctx.stroke();
}
}
function getEquityAnalystsSource() {
if (Array.isArray(window.EQUITY_ANALYSTS_DYNAMIC) && window.EQUITY_ANALYSTS_DYNAMIC.length) {
return window.EQUITY_ANALYSTS_DYNAMIC.map(function (name) {
return { name: name };
});
}
return Array.isArray(ANALYSTS) ? ANALYSTS : [];
}
function setupEquityAnalystFilter() {
const container = document.getElementById('equity-analyst-checkboxes');
const allCheckbox = document.getElementById('equity-analyst-all');
if (!container || !allCheckbox)
return;
container.innerHTML = '';
const source = getEquityAnalystsSource();
if (Array.isArray(source)) {
source.forEach(function (a) {
const label = document.createElement('label');
label.className = 'equity-analyst-option';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.checked = true;
cb.setAttribute('data-analyst', a.name);
const span = document.createElement('span');
span.textContent = a.name;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
}
allCheckbox.checked = true;
function refreshCurve() {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
allCheckbox.addEventListener('change', function () {
const checked = allCheckbox.checked;
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
Array.prototype.forEach.call(boxes, function (cb) {
cb.checked = checked;
});
refreshCurve();
});
container.addEventListener('change', function (evt) {
const target = evt.target;
if (!target || target.type !== 'checkbox' || !target.hasAttribute('data-analyst'))
return;
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
let allChecked = true;
let anyChecked = false;
Array.prototype.forEach.call(boxes, function (cb) {
if (cb.checked) {
anyChecked = true;
}
else {
allChecked = false;
}
});
allCheckbox.checked = allChecked && anyChecked;
refreshCurve();
});
}
function getEquitySelectedAnalysts() {
const allCheckbox = document.getElementById('equity-analyst-all');
const container = document.getElementById('equity-analyst-checkboxes');
if (!allCheckbox || !container) {
return null;
}
if (allCheckbox.checked) {
return null;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const selected = [];
Array.prototype.forEach.call(boxes, function (cb) {
if (cb.checked) {
const name = cb.getAttribute('data-analyst') || '';
if (name)
selected.push(name);
}
});
return selected;
}
function tf_makeEquityTouchEvent(canvas, touch) {
return {
currentTarget: canvas,
clientX: touch ? touch.clientX : 0,
clientY: touch ? touch.clientY : 0
};
}
function tf_scheduleEquityTouchTooltipHide(delayMs) {
try {
if (tfEquityTouchHideTimer) clearTimeout(tfEquityTouchHideTimer);
tfEquityTouchHideTimer = setTimeout(function () {
try {
tfEquityTouchActive = false;
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}, Math.max(800, Number(delayMs) || 2600));
}
catch (e) { }
}
function tf_equityTouchDistance(a, b) {
try {
const dx = Number(a.clientX || 0) - Number(b.clientX || 0);
const dy = Number(a.clientY || 0) - Number(b.clientY || 0);
return Math.sqrt(dx * dx + dy * dy);
}
catch (e) { return 0; }
}
function tf_startEquityPinch(evt) {
try {
if (equityChartMode !== 'candle' || !evt.touches || evt.touches.length < 2) return false;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length) return false;
const canvas = evt.currentTarget;
if (!canvas) return false;
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.chartWidth)) drawEquityCurve();
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.chartWidth) || m.chartWidth <= 0) return false;
const n = equityDailyCandles.length;
if (equityCandleViewEnd === null) equityCandleViewEnd = n - 1;
tf_clampEquityCandleViewport();
const d = tf_equityTouchDistance(evt.touches[0], evt.touches[1]);
if (!(d > 2)) return false;
const rect = canvas.getBoundingClientRect();
const midX = ((evt.touches[0].clientX + evt.touches[1].clientX) / 2) - rect.left;
const frac = Math.max(0, Math.min(1, (midX - m.paddingLeft) / m.chartWidth));
const span = Math.max(1, equityCandleViewEnd - equityCandleViewStart + 1);
tfEquityPinchActive = true;
tfEquityPinchStartDistance = d;
tfEquityPinchStartSpan = span;
tfEquityPinchAnchorFrac = frac;
tfEquityPinchAnchorIndex = equityCandleViewStart + frac * span;
equityCandleHoverIndex = null;
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
return true;
}
catch (e) { return false; }
}
function tf_moveEquityPinch(evt) {
try {
if (!tfEquityPinchActive || !evt.touches || evt.touches.length < 2) return false;
const n = Array.isArray(equityDailyCandles) ? equityDailyCandles.length : 0;
if (!n) return false;
const d = tf_equityTouchDistance(evt.touches[0], evt.touches[1]);
if (!(d > 2) || !(tfEquityPinchStartDistance > 2)) return false;
const scale = d / tfEquityPinchStartDistance;
let newSpan = Math.round(tfEquityPinchStartSpan / Math.max(0.18, Math.min(5.5, scale)));
const minSpan = Math.min(10, n);
newSpan = Math.max(minSpan, Math.min(n, newSpan));
let newStart = Math.round(tfEquityPinchAnchorIndex - tfEquityPinchAnchorFrac * newSpan);
let newEnd = newStart + newSpan - 1;
if (newStart < 0) { newStart = 0; newEnd = newSpan - 1; }
if (newEnd > n - 1) { newEnd = n - 1; newStart = Math.max(0, newEnd - newSpan + 1); }
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
drawEquityCurve();
return true;
}
catch (e) { return false; }
}
function tf_handleEquityCanvasTouchStart(evt) {
try {
if (!evt.touches || !evt.touches.length) return;
const canvas = evt.currentTarget;
if (!canvas) return;
if (tfEquityTouchHideTimer) { clearTimeout(tfEquityTouchHideTimer); tfEquityTouchHideTimer = 0; }
if (evt.touches.length >= 2) {
if (tf_startEquityPinch(evt) && evt.cancelable) evt.preventDefault();
return;
}
const t = evt.touches[0];
if (!t) return;
tfEquityPinchActive = false;
tfEquityTouchActive = true;
tfEquityTouchStartX = t.clientX;
tfEquityTouchStartY = t.clientY;
tf_handleEquityCanvasMouseMove(tf_makeEquityTouchEvent(canvas, t));
}
catch (e) { }
}
function tf_handleEquityCanvasTouchMove(evt) {
try {
if (!evt.touches || !evt.touches.length) return;
if (evt.touches.length >= 2) {
if (!tfEquityPinchActive) tf_startEquityPinch(evt);
if (tf_moveEquityPinch(evt) && evt.cancelable) evt.preventDefault();
return;
}
if (tfEquityPinchActive) return;
const canvas = evt.currentTarget;
const t = evt.touches[0];
if (!canvas || !t) return;
const dx = Math.abs(t.clientX - tfEquityTouchStartX);
const dy = Math.abs(t.clientY - tfEquityTouchStartY);
// Touchscreen laptop/tablet: horizontal touch inspects the chart while a clear
// vertical swipe can still move the page.
if ((dx >= dy * 0.72 || dy < 7) && evt.cancelable) evt.preventDefault();
tfEquityTouchActive = true;
tf_handleEquityCanvasMouseMove(tf_makeEquityTouchEvent(canvas, t));
}
catch (e) { }
}
function tf_handleEquityCanvasTouchEnd(evt) {
try {
if (tfEquityPinchActive && (!evt.touches || evt.touches.length < 2)) {
tfEquityPinchActive = false;
tfEquityPinchStartDistance = 0;
}
tfEquityTouchActive = false;
tf_scheduleEquityTouchTooltipHide(2800);
}
catch (e) { }
}
function tf_handleEquityCanvasTouchCancel(evt) {
try {
tfEquityPinchActive = false;
tfEquityPinchStartDistance = 0;
tfEquityTouchActive = false;
tf_scheduleEquityTouchTooltipHide(900);
}
catch (e) { }
}
function setupEquityCurveInteractions() {
const canvas = document.getElementById('equity-curve-canvas');
if (!canvas)
return;
canvas.addEventListener('mousemove', tf_handleEquityCanvasMouseMove);
canvas.addEventListener('mouseleave', tf_handleEquityCanvasMouseLeave);
canvas.addEventListener('mousedown', tf_handleEquityCanvasMouseDown);
canvas.addEventListener('dblclick', tf_handleEquityCanvasDoubleClick);
canvas.addEventListener('wheel', tf_handleEquityCanvasWheel, { passive: false });
// REV295: desktop mouse/wheel remains unchanged; touchscreen laptops gain
// one-finger detail inspection and two-finger candlestick pinch zoom.
canvas.style.touchAction = 'pan-y';
canvas.style.webkitUserSelect = 'none';
canvas.style.userSelect = 'none';
canvas.addEventListener('touchstart', tf_handleEquityCanvasTouchStart, { passive: false });
canvas.addEventListener('touchmove', tf_handleEquityCanvasTouchMove, { passive: false });
canvas.addEventListener('touchend', tf_handleEquityCanvasTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', tf_handleEquityCanvasTouchCancel, { passive: false });
window.addEventListener('mouseup', tf_handleEquityCanvasMouseUp);
window.addEventListener('resize', function () {
if (!equityCurvePoints.length)
return;
drawEquityCurve();
});
}
function setupEquityChartModeSelector() {
try {
tf_loadEquityChartModePreference();
}
catch (e) { }
try {
tf_syncEquityChartModeButtonsUI();
}
catch (e) { }
const wrap = document.getElementById('tf-equity-chartmode-buttons');
if (!wrap)
return;
wrap.addEventListener('click', function (e) {
try {
const btn = e.target && e.target.closest ? e.target.closest('button[data-mode]') : null;
if (!btn)
return;
const mode = btn.getAttribute('data-mode');
if (mode !== 'line' && mode !== 'candle')
return;
if (mode === equityChartMode)
return;
equityChartMode = mode;
if (equityChartMode === 'candle') {
try {
if (Array.isArray(equityDailyCandles) && equityDailyCandles.length)
tf_resetEquityCandleViewportToFull();
}
catch (e) { }
try {
tf_clampEquityCandleViewport();
}
catch (e) { }
}
tf_saveEquityChartModePreference();
tf_syncEquityChartModeButtonsUI();
try {
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (x) { }
drawEquityCurve();
}
catch (x) { }
});
}
function handleEquityCanvasMouseMove(evt) {
const canvas = evt.currentTarget;
const rect = canvas.getBoundingClientRect();
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const x = evt.clientX - rect.left;
const y = evt.clientY - rect.top;
if (!equityCurvePoints.length)
return;
const paddingLeft = 48;
const paddingRight = 18;
const paddingTop = 18;
const paddingBottom = 44;
const width = rect.width;
const height = rect.height;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = height - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const inX = (x >= paddingLeft && x <= paddingLeft + chartWidth);
const inY = (y >= paddingTop && y <= paddingTop + chartHeight);
if (!inX || !inY) {
equityCrosshairX = null;
equityCrosshairY = null;
if (equityHoverIndex !== null) {
equityHoverIndex = null;
drawEquityCurve();
}
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
return;
}
equityCrosshairX = Math.max(paddingLeft, Math.min(paddingLeft + chartWidth, x));
equityCrosshairY = Math.max(paddingTop, Math.min(paddingTop + chartHeight, y));
function xForIndex(i) {
if (equityCurvePoints.length === 1) {
return paddingLeft + chartWidth / 2;
}
const t = i / (equityCurvePoints.length - 1);
return paddingLeft + t * chartWidth;
}
let closestIndex = 0;
let minDist = Infinity;
equityCurvePoints.forEach((p, idx) => {
const px = xForIndex(idx);
const d = Math.abs(px - x);
if (d < minDist) {
minDist = d;
closestIndex = idx;
}
});
equityHoverIndex = closestIndex;
drawEquityCurve();
const point = equityCurvePoints[closestIndex];
const tooltip = document.getElementById('equity-tooltip');
if (!tooltip)
return;
const netValue = equityMetric === 'usd' ? (point.pnlDollar || 0) : (point.pnlPips || 0);
const tpText = point.dollarTP ? formatMoney(point.dollarTP) : '-';
const slText = point.dollarSL ? formatMoney(point.dollarSL) : '-';
const netText = netValue === 0
? (equityMetric === 'usd' ? '$0.00' : formatPips(0, 1))
: formatEquityMetricSigned(netValue);
const resultClass = netValue > 0 ? 'tp' : netValue < 0 ? 'sl' : '';
const equityLabel = equityMetric === 'usd' ? 'Equity' : 'Akumulasi';
tooltip.innerHTML =
'<div><span class="label">Tanggal:</span> <span class="value">' + (point.date || '-') + '</span></div>' +
'<div><span class="label">Analis:</span> <span class="value">' + (point.analyst || '-') + '</span></div>' +
'<div><span class="label">Pair:</span> <span class="value">' + (point.pair ? String(point.pair).toUpperCase() : '-') + '</span></div>' +
'<div><span class="label">Hasil trade:</span> <span class="value ' + resultClass + '">' + netText + '</span></div>' +
'<div><span class="label">$TP / $SL:</span> <span class="value"><span class="tp">' + tpText + '</span> / <span class="sl">' + slText + '</span></span></div>' +
'<div><span class="label">' + equityLabel + ':</span> <span class="value">' + formatEquityMetricValue(point.equity) + '</span></div>';
tooltip.style.display = 'block';
const wrapRect = wrapper.getBoundingClientRect();
let tx = evt.clientX - wrapRect.left + 8;
let ty = evt.clientY - wrapRect.top - 8;
const tooltipRect = tooltip.getBoundingClientRect();
const maxX = wrapRect.width - tooltipRect.width - 8;
const maxY = wrapRect.height - tooltipRect.height - 8;
if (tx < 8)
tx = 8;
if (ty < 8)
ty = 8;
if (tx > maxX)
tx = maxX;
if (ty > maxY)
ty = maxY;
tooltip.style.left = tx + 'px';
tooltip.style.top = ty + 'px';
}
function handleEquityCanvasMouseLeave() {
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
drawEquityCurve();
const tooltip = document.getElementById('equity-tooltip');
if (tooltip) {
tooltip.style.display = 'none';
}
}
function tf_hideEquityTooltip() {
try {
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
}
function tf_handleEquityCanvasMouseMove(evt) {
if (equityChartMode === 'candle')
return tf_handleEquityCandleMouseMove(evt);
return handleEquityCanvasMouseMove(evt);
}
function tf_handleEquityCanvasMouseLeave(evt) {
if (equityChartMode === 'candle')
return tf_handleEquityCandleMouseLeave(evt);
return handleEquityCanvasMouseLeave(evt);
}
function tf_handleEquityCanvasMouseDown(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (evt.button !== 0)
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
equityCandleIsDragging = true;
equityCandleDragStartX = evt.clientX;
equityCandleDragStartStart = equityCandleViewStart || 0;
try {
evt.currentTarget.style.cursor = 'grabbing';
}
catch (e) { }
tf_hideEquityTooltip();
evt.preventDefault();
}
catch (e) { }
}
function tf_handleEquityCanvasMouseUp(evt) {
try {
if (!equityCandleIsDragging)
return;
equityCandleIsDragging = false;
const canvas = document.getElementById('equity-curve-canvas');
if (canvas)
canvas.style.cursor = (equityChartMode === 'candle') ? 'grab' : '';
}
catch (e) { }
}
function tf_handleEquityCanvasDoubleClick(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
tf_resetEquityCandleViewportToFull();
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}
function tf_handleEquityCanvasWheel(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
evt.preventDefault();
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.stepX)) {
drawEquityCurve();
}
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.chartWidth) || m.chartWidth <= 0)
return;
const n = equityDailyCandles.length;
if (equityCandleViewEnd === null)
equityCandleViewEnd = n - 1;
tf_clampEquityCandleViewport();
const curSpan = Math.max(1, (equityCandleViewEnd - equityCandleViewStart + 1));
const rect = evt.currentTarget.getBoundingClientRect();
const mx = evt.clientX - rect.left;
const frac = Math.max(0, Math.min(1, (mx - m.paddingLeft) / m.chartWidth));
const anchor = equityCandleViewStart + frac * curSpan;
const zoomIn = (evt.deltaY < 0);
const factor = zoomIn ? 0.85 : 1.15;
let newSpan = Math.round(curSpan * factor);
const minSpan = Math.min(10, n);
newSpan = Math.max(minSpan, Math.min(n, newSpan));
let newStart = Math.round(anchor - frac * newSpan);
let newEnd = newStart + newSpan - 1;
if (newStart < 0) {
newStart = 0;
newEnd = newSpan - 1;
}
if (newEnd > n - 1) {
newEnd = n - 1;
newStart = Math.max(0, newEnd - newSpan + 1);
}
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}
function tf_handleEquityCandleMouseMove(evt) {
const canvas = evt.currentTarget;
if (!canvas)
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length) {
return handleEquityCanvasMouseMove(evt);
}
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.stepX)) {
drawEquityCurve();
}
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.stepX) || m.stepX <= 0)
return;
if (equityCandleIsDragging) {
const dx = evt.clientX - equityCandleDragStartX;
const shift = Math.round(dx / m.stepX);
const span = m.visCount || Math.max(1, (m.viewEnd - m.viewStart + 1));
const n = equityDailyCandles.length;
let newStart = (equityCandleDragStartStart || 0) - shift;
let newEnd = newStart + span - 1;
if (newStart < 0) {
newStart = 0;
newEnd = span - 1;
}
if (newEnd > n - 1) {
newEnd = n - 1;
newStart = Math.max(0, newEnd - span + 1);
}
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
drawEquityCurve();
return;
}
const rect = canvas.getBoundingClientRect();
const mx = evt.clientX - rect.left;
const my = evt.clientY - rect.top;
const x0 = m.paddingLeft;
const x1 = m.paddingLeft + m.chartWidth;
const y0 = m.paddingTop;
const y1 = m.paddingTop + m.chartHeight;
if (mx < x0 || mx > x1 || my < y0 || my > y1) {
equityCrosshairX = null;
equityCrosshairY = null;
if (equityCandleHoverIndex !== null) {
equityCandleHoverIndex = null;
drawEquityCurve();
}
tf_hideEquityTooltip();
canvas.style.cursor = 'grab';
return;
}
canvas.style.cursor = 'grab';
equityCrosshairX = Math.max(x0, Math.min(x1, mx));
equityCrosshairY = Math.max(y0, Math.min(y1, my));
const j = Math.max(0, Math.min(m.visCount - 1, Math.floor((mx - x0) / m.stepX)));
const absIdx = (m.viewStart || 0) + j;
if (absIdx !== equityCandleHoverIndex) {
equityCandleHoverIndex = absIdx;
drawEquityCurve();
}
const c = equityDailyCandles[absIdx];
if (!c) {
tf_hideEquityTooltip();
return;
}
try {
const tooltip = document.getElementById('equity-tooltip');
if (!tooltip)
return;
function tf_escapeHtml(s) {
try {
return String(s)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}
catch (e) {
return '';
}
}
function tf_formatAnalystsTwoPerLine(arr) {
const list = Array.isArray(arr) ? arr.map((x) => String(x || '').trim()).filter(Boolean) : [];
if (!list.length)
return '<div class="tf-analyst-line">-</div>';
let html = '';
for (let i = 0; i < list.length; i += 2) {
const a1 = list[i];
const a2 = (i + 1 < list.length) ? list[i + 1] : '';
const line = a2 ? (a1 + ',' + a2) : a1;
html += '<div class="tf-analyst-line">' + tf_escapeHtml(line) + '</div>';
}
return html;
}
const equityVal = Number(c.close);
const dailyPnl = Number(c.close) - Number(c.open);
const equityClass = (isFinite(equityVal) && equityVal >= 0) ? 'positive' : 'negative';
const pnlClass = (isFinite(dailyPnl) && dailyPnl >= 0) ? 'positive' : 'negative';
tooltip.innerHTML =
'<div><span class="label">Tanggal:</span> <span class="value">' + (c.label || c.dayKey || '-') + '</span></div>' +
'<div><span class="label">Analis:</span></div>' +
'<div class="tf-analyst-lines">' + tf_formatAnalystsTwoPerLine(c.analysts) + '</div>' +
'<div><span class="label">Equity:</span> <span class="value ' + equityClass + '">' +
formatEquityMetricValue(equityVal) +
'</span></div>' +
'<div><span class="label">' + (equityMetric === 'usd' ? 'PnL $ Daily' : 'PnL Pips Daily') + ':</span> <span class="value ' + pnlClass + '">' +
formatEquityMetricSigned(dailyPnl) +
'</span></div>';
tooltip.style.display = 'block';
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const wrapRect = wrapper.getBoundingClientRect();
let tx = evt.clientX - wrapRect.left + 8;
let ty = evt.clientY - wrapRect.top - 8;
const tooltipRect = tooltip.getBoundingClientRect();
const maxX = wrapRect.width - tooltipRect.width - 8;
const maxY = wrapRect.height - tooltipRect.height - 8;
if (tx < 8)
tx = 8;
if (ty < 8)
ty = 8;
if (tx > maxX)
tx = maxX;
if (ty > maxY)
ty = maxY;
tooltip.style.left = tx + 'px';
tooltip.style.top = ty + 'px';
}
catch (e) { }
}
function tf_handleEquityCandleMouseLeave(evt) {
try {
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
const canvas = evt && evt.currentTarget;
if (canvas)
canvas.style.cursor = (equityChartMode === 'candle') ? 'grab' : '';
drawEquityCurve();
}
catch (e) { }
}
function formatMoneySigned(v) {
const n = Number(v) || 0;
return (n >= 0 ? '+' : '') + formatMoney(n);
}
function formatPipsSigned(v) {
const n = Number(v) || 0;
return (n >= 0 ? '+' : '') + formatPips(n);
}
async function exportHistoryToCSV() {
if (!lastHistoryRowsForExport || lastHistoryRowsForExport.length === 0) {
alert('Tidak ada data history di Table 3 untuk di-export.');
return;
}
try {
const cfgToSave = (window && window.__tf_isignalUsersMgmtCfg) ? window.__tf_isignalUsersMgmtCfg : null;
if (cfgToSave) {
cfgToSave.updatedAt = Date.now();
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfgToSave });
}
}
catch (e) { }
const sep = ',';
const newline = '\r\n';
const balanceHeader = (lastHistoryRiskMode === 'compound') ? 'Balance Compounded' : 'Balance';
const visibleKeys = new Set(tf_getVisibleHistoryColumnKeys());
const columnDefs = [
{ key: 'created', header: 'Tanggal (Created At)', value: (row) => row.createdDate || '' },
{ key: 'closed', header: 'Tanggal (Closed At)', value: (row) => row.displayDate || '' },
{ key: 'analyst', header: 'Nama Analis', value: (row) => row.analyst || '' },
{ key: 'balance', header: balanceHeader, value: (row) => isFinite(row.balanceCompound) ? row.balanceCompound.toFixed(2) : '' },
{ key: 'entry', header: 'Entry', value: (row) => row.entry ?? row.price ?? '' },
{ key: 'takeProfit', header: 'Take Profit', value: (row) => row.takeProfit ?? row.take_profit ?? row.tp ?? '' },
{ key: 'stopLoss', header: 'Stop Loss', value: (row) => row.stopLoss ?? row.stop_loss ?? row.sl ?? '' },
{ key: 'type', header: 'Type', value: (row) => row.type ?? row.side ?? row.orderType ?? '' },
{ key: 'pair', header: 'Pair', value: (row) => row.pair || '' },
{ key: 'lot', header: 'Lot Size', value: (row) => isFinite(row.lot) ? row.lot.toFixed(2) : '' },
{ key: 'pnlPips', header: 'PnL (pips)', value: (row) => isFinite(row.pnlPips) ? row.pnlPips.toFixed(1) : '0' },
{ key: 'pnlDollar', header: 'PnL ($)', value: (row) => isFinite(row.pnlDollar) ? row.pnlDollar.toFixed(2) : '0' },
{ key: 'pnlPercent', header: 'PnL %', value: (row) => isFinite(row.pnlPercent) ? (row.pnlPercent.toFixed(2) + '%') : '' },
{ key: 'balancePnl', header: 'Balance PnL ($)', value: (row) => isFinite(row.balancePnl) ? row.balancePnl.toFixed(2) : '' }
].filter((col) => visibleKeys.has(col.key));
const headers = columnDefs.map((col) => col.header);
function esc(value) {
if (value === null || value === undefined)
return '';
const str = String(value);
if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
return '"' + str.replace(/"/g, '""') + '"';
}
return str;
}
let csv = headers.map(esc).join(sep) + newline;
try {
const startLabel = (lastHistoryRiskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
const startBalanceValue = isFinite(currentBalance) ? Number(currentBalance).toFixed(2) : '0.00';
const startValues = {
created: startLabel,
balance: startBalanceValue,
pnlPips: '0.0',
pnlDollar: '0.00',
balancePnl: startBalanceValue
};
const startLine = columnDefs.map((col) => esc(startValues[col.key] ?? '')).join(sep);
csv += startLine + newline;
}
catch (e) { }
lastHistoryRowsForExport.forEach((row) => {
const line = columnDefs.map((col) => esc(col.value(row))).join(sep);
csv += line + newline;
});
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
const now = new Date();
const ts = [
now.getFullYear(),
String(now.getMonth() + 1).padStart(2, '0'),
String(now.getDate()).padStart(2, '0'),
'_',
String(now.getHours()).padStart(2, '0'),
String(now.getMinutes()).padStart(2, '0')
].join('');
a.href = url;
a.download = 'tf_table3_history_' + ts + '.csv';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}
function tf_formatDateTimeForTitle(d) {
try {
const pad2 = (n) => String(n).padStart(2, '0');
const dd = pad2(d.getDate());
const mm = pad2(d.getMonth() + 1);
const yyyy = d.getFullYear();
const HH = pad2(d.getHours());
const MM = pad2(d.getMinutes());
return dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + MM;
}
catch (e) {
return '';
}
}
function escapeHtml(str) {
return String(str == null ? '' : str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
function tf_formatDateTimeForFilename(d) {
try {
const pad2 = (n) => String(n).padStart(2, '0');
const dd = pad2(d.getDate());
const mm = pad2(d.getMonth() + 1);
const yyyy = d.getFullYear();
const HH = pad2(d.getHours());
const MM = pad2(d.getMinutes());
const SS = pad2(d.getSeconds());
return yyyy + '-' + mm + '-' + dd + '_' + HH + MM + SS;
}
catch (e) {
return '';
}
}
function tf_buildCompactPdfExportRows(sourceRows) {
try {
return (Array.isArray(sourceRows) ? sourceRows : []).map((r) => ({
isWithdraw: !!(r && r.isWithdraw),
sortKey: Number.isFinite(Number(r && r.sortKey)) ? Number(r.sortKey) : null,
createdSortKey: Number.isFinite(Number(r && r.createdSortKey)) ? Number(r.createdSortKey) : null,
createdDate: r && r.createdDate != null ? String(r.createdDate) : '',
displayDate: r && r.displayDate != null ? String(r.displayDate) : '',
analyst: r && r.analyst != null ? String(r.analyst) : '',
balanceCompound: Number(r && r.balanceCompound) || 0,
entry: r && (r.entry ?? r.price) != null ? String(r.entry ?? r.price) : '',
takeProfit: r && (r.takeProfit ?? r.take_profit ?? r.tp) != null ? String(r.takeProfit ?? r.take_profit ?? r.tp) : '',
stopLoss: r && (r.stopLoss ?? r.stop_loss ?? r.sl) != null ? String(r.stopLoss ?? r.stop_loss ?? r.sl) : '',
type: r && (r.type ?? r.side ?? r.orderType) != null ? String(r.type ?? r.side ?? r.orderType) : '',
pair: r && r.pair != null ? String(r.pair) : '',
lot: Number(r && r.lot) || 0,
pnlPips: Number(r && r.pnlPips) || 0,
pnlDollar: Number(r && r.pnlDollar) || 0,
pnlPercent: Number.isFinite(Number(r && r.pnlPercent)) ? Number(r.pnlPercent) : null,
balancePnl: Number.isFinite(Number(r && r.balancePnl)) ? Number(r.balancePnl) : null
}));
}
catch (e) {
return [];
}
}
async function exportHistoryToPDF() {
if (!lastHistoryRowsForExport || !Array.isArray(lastHistoryRowsForExport) || lastHistoryRowsForExport.length === 0) {
alert('Table 3 masih kosong. Silakan Scan / Import data dulu.');
return;
}
try {
const cfgToSave = (window && window.__tf_isignalUsersMgmtCfg) ? window.__tf_isignalUsersMgmtCfg : null;
if (cfgToSave) {
cfgToSave.updatedAt = Date.now();
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfgToSave });
}
}
catch (e) { }
const now = new Date();
const tsTitle = (typeof tf_formatDateTimeForTitle === 'function') ? tf_formatDateTimeForTitle(now) : now.toLocaleString();
const tsFile = (typeof tf_formatDateTimeForFilename === 'function') ? tf_formatDateTimeForFilename(now) : String(Date.now());
const baseTitle = 'Table 3 - History Signal - Perhitungan Hasil per Trade';
const fullTitle = baseTitle + ' (Tanggal update: ' + tsTitle + ')';
const rm = (typeof lastHistoryRiskMode === 'string' && lastHistoryRiskMode) ? lastHistoryRiskMode : 'fixed';
const balanceHeader = (rm === 'compound') ? 'Balance Compounded' : 'Balance';
const exportId = String(Date.now()) + '_' + Math.random().toString(16).slice(2);
const payload = {
exportId,
createdAt: Date.now(),
title: fullTitle,
baseTitle,
tsTitle,
tsFile,
riskMode: rm,
balanceHeader,
startBalance: (typeof currentBalance === 'number' && isFinite(currentBalance)) ? currentBalance : 0,
startBalanceLabel: (rm === 'compound') ? 'Start Balance Compounded' : 'Start Balance',
visibleColumns: tf_getVisibleHistoryColumnKeys(),
rows: tf_buildCompactPdfExportRows(lastHistoryRowsForExport)
};
const storageKey = 'tf_export_history_pdf_' + exportId;
chrome.storage.local.set({ [storageKey]: payload }, () => {
const url = chrome.runtime.getURL('export_table3_pdf.html?id=' + encodeURIComponent(exportId));
chrome.tabs.create({ url });
});
}
function setupHistoryPdfExportButton() {
const btn = document.getElementById('export-history-pdf-btn');
if (!btn)
return;
btn.addEventListener('click', exportHistoryToPDF);
}
let historyFormInitialized = false;
function setupHistoryForm() {
if (historyFormInitialized) {
return;
}
historyFormInitialized = true;
const clearBtn = document.getElementById('clear-history-btn');
const resetBtn = document.getElementById('reset-history-btn');
if (clearBtn) {
clearBtn.addEventListener('click', () => {
if (!historySignals || historySignals.length === 0)
return;
const ok = confirm('Hapus semua baris History di Dashboard (data di extension tidak ikut terhapus)?');
if (!ok)
return;
historySignals = [];
recomputeHistoryRows();
});
}
if (resetBtn) {
resetBtn.addEventListener('click', () => {
if (Array.isArray(initialHistorySignals)) {
historySignals = initialHistorySignals.map((item) => {
return {
...item,
displayDate: normalizeWIBSuffix(item.displayDate),
createdDate: normalizeWIBSuffix(item.createdDate)
};
});
recomputeHistoryRows();
}
});
}
}
function setupBalanceAndRiskControls() {
const balanceInput = document.getElementById('balance-input');
const riskInput = document.getElementById('risk-input');
const applyBalanceBtn = document.getElementById('apply-balance-btn');
const applyRiskBtn = document.getElementById('apply-risk-btn');
const resetBtn = document.getElementById('reset-defaults-btn');
const withdrawToggle = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInput = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelect = document.getElementById('withdraw-months-select');
const withdrawSubmitBtn = document.getElementById('withdraw-submit-btn');
const withdrawToggleEquity = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEquity = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEquity = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEquity = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawToggles = [withdrawToggle, withdrawToggleEquity, withdrawToggleHistory].filter(Boolean);
const withdrawAmountInputs = [withdrawAmountInput, withdrawAmountInputEquity, withdrawAmountInputHistory].filter(Boolean);
const withdrawMonthsSelects = [withdrawMonthsSelect, withdrawMonthsSelectEquity, withdrawMonthsSelectHistory].filter(Boolean);
const withdrawSubmitBtns = [withdrawSubmitBtn, withdrawSubmitBtnEquity, withdrawSubmitBtnHistory].filter(Boolean);
function syncInputs() {
if (balanceInput)
balanceInput.value = currentBalance;
if (riskInput)
riskInput.value = currentRiskPercent;
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawDraftEnabled = !!withdrawEnabled;
let _hasStoredWithdrawAmt = false;
let _storedWithdrawAmt = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
_hasStoredWithdrawAmt = (raw !== null && raw !== undefined && String(raw).trim() !== '');
_storedWithdrawAmt = safeParseFloat(raw);
}
}
catch (e) { }
withdrawDraftAmount = (_hasStoredWithdrawAmt && Number.isFinite(_storedWithdrawAmt)) ? Math.max(0, _storedWithdrawAmt) : null;
withdrawDraftEveryMonths = (Number.isFinite(withdrawEveryMonths) ? withdrawEveryMonths : 1);
withdrawDraftTouched = false;
withdrawDraftAutoFilled = false;
withdrawToggles.forEach((t) => {
try {
t.checked = !!withdrawDraftEnabled;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !withdrawDraftEnabled;
btn.title = withdrawDraftEnabled ? "" : "Enable Withdraw to apply";
});
const amtStr = (withdrawDraftAmount === null || !Number.isFinite(withdrawDraftAmount)) ? '' : String(withdrawDraftAmount);
withdrawAmountInputs.forEach((inp) => {
if (!inp)
return;
inp.value = amtStr;
inp.disabled = false;
});
const monthsStr = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((sel) => {
if (!sel)
return;
sel.value = monthsStr;
sel.disabled = false;
});
try {
tf_enforceWithdrawAmountMax(false, withdrawAmountInputs[0]);
}
catch (e) { }
try {
tf_setWithdrawAverageText(tf_getWithdrawMaxAllowedOrNull(), false);
}
catch (e) { }
try {
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) { }
}
}
syncInputs();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawToggles.forEach((toggleEl) => {
toggleEl.addEventListener('change', () => {
const checked = !!toggleEl.checked;
withdrawDraftEnabled = checked;
withdrawToggles.forEach((t) => {
if (t === toggleEl)
return;
try {
t.checked = checked;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !checked;
btn.title = checked ? "" : "Enable Withdraw to apply";
});
if (!checked) {
withdrawEnabled = false;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
renderMonthlyTotals();
}
catch (e) { }
}
});
});
withdrawAmountInputs.forEach((inp) => {
inp.addEventListener('input', () => {
withdrawDraftTouched = true;
const raw = String(inp.value || '').trim();
if (raw === '') {
withdrawDraftAmount = null;
}
else {
const v = safeParseFloat(raw);
withdrawDraftAmount = (v === null || v < 0) ? 0 : v;
}
try {
tf_enforceWithdrawAmountMax(true, inp);
}
catch (e) { }
});
});
withdrawMonthsSelects.forEach((sel) => {
sel.addEventListener('change', () => {
const v = parseInt(sel.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
const str = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((s) => {
if (s === sel)
return;
try {
s.value = str;
}
catch (e) { }
});
});
});
}
if (hasWithdrawUi && withdrawSubmitBtns.length) {
withdrawSubmitBtns.forEach((btn) => {
btn.addEventListener('click', () => {
if (equityMetric !== 'usd') {
alert('Withdraw hanya tersedia saat Filter by: PnL ($).');
return;
}
const toggleRef = withdrawToggles[0];
const inputRef = withdrawAmountInputs[0];
const monthsRef = withdrawMonthsSelects[0];
if (!toggleRef || !inputRef || !monthsRef)
return;
withdrawDraftEnabled = !!toggleRef.checked;
const v0 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v0 === null || v0 < 0) ? 0 : v0;
const m0 = parseInt(monthsRef.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(m0) && m0 >= 1 && m0 <= 12) ? m0 : 1;
try {
tf_enforceWithdrawAmountMax(true, inputRef);
}
catch (e) { }
const v1 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v1 === null || v1 < 0) ? 0 : v1;
withdrawEnabled = !!withdrawDraftEnabled;
withdrawAmount = withdrawDraftAmount;
withdrawEveryMonths = withdrawDraftEveryMonths;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
recomputeHistoryRows();
renderMonthlyTotals();
});
});
}
applyBalanceBtn.addEventListener('click', () => {
const v = safeParseFloat(balanceInput.value);
if (v === null || v <= 0) {
alert('Balance tidak valid. Isi angka lebih besar dari 0.');
if (balanceInput)
balanceInput.value = currentBalance;
return;
}
currentBalance = v;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
applyRiskBtn.addEventListener('click', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
alert('Risk % / Trade tidak valid.');
if (riskInput)
riskInput.value = currentRiskPercent;
return;
}
currentRiskPercent = v;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
resetBtn.addEventListener('click', () => {
currentBalance = 5000;
currentRiskPercent = 1;
withdrawEnabled = false;
withdrawAmount = 0;
withdrawEveryMonths = 1;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
syncInputs();
renderSummaryTable();
recomputeHistoryRows();
});
}
function makeEmptyStreakState() {
return {
currentProfitTrades: 0,
currentProfitPips: 0,
currentProfitDollar: 0,
maxProfitTrades: 0,
maxProfitPips: 0,
maxProfitDollar: 0,
currentLossTrades: 0,
currentLossPips: 0,
currentLossDollar: 0,
maxLossTrades: 0,
maxLossPips: 0,
maxLossDollar: 0,
profitRuns: {},
lossRuns: {}
};
}
function commitProfitRun(state) {
try {
const len = state.currentProfitTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentProfitPips) ? state.currentProfitPips : 0;
const dollar = isFinite(state.currentProfitDollar) ? state.currentProfitDollar : 0;
const runs = state.profitRuns || (state.profitRuns = {});
const cur = runs[len] || { count: 0, bestPips: 0, bestDollar: 0 };
cur.count += 1;
if (cur.count === 1 || dollar > cur.bestDollar || (dollar === cur.bestDollar && pips > cur.bestPips)) {
cur.bestDollar = dollar;
cur.bestPips = pips;
}
runs[len] = cur;
if (len > (state.maxProfitTrades || 0) || (len === (state.maxProfitTrades || 0) && dollar > (state.maxProfitDollar || 0))) {
state.maxProfitTrades = len;
state.maxProfitPips = pips;
state.maxProfitDollar = dollar;
}
}
catch (e) { }
}
function commitLossRun(state) {
try {
const len = state.currentLossTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentLossPips) ? state.currentLossPips : 0;
const dollar = isFinite(state.currentLossDollar) ? state.currentLossDollar : 0;
const runs = state.lossRuns || (state.lossRuns = {});
const cur = runs[len] || { count: 0, bestPips: 0, bestDollar: 0 };
cur.count += 1;
if (cur.count === 1 || dollar > cur.bestDollar || (dollar === cur.bestDollar && pips > cur.bestPips)) {
cur.bestDollar = dollar;
cur.bestPips = pips;
}
runs[len] = cur;
if (len > (state.maxLossTrades || 0) || (len === (state.maxLossTrades || 0) && dollar > (state.maxLossDollar || 0))) {
state.maxLossTrades = len;
state.maxLossPips = pips;
state.maxLossDollar = dollar;
}
}
catch (e) { }
}
function finalizeStreakState(state) {
try {
commitProfitRun(state);
}
catch (e) { }
try {
commitLossRun(state);
}
catch (e) { }
try {
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
catch (e) { }
}
function updateStreakState(state, row) {
const pips = isFinite(row.pips) ? row.pips : 0;
const profitDollar = isFinite(row.dollarTP) ? row.dollarTP : (row.dollarTP || 0);
const lossDollar = isFinite(row.dollarSL) ? row.dollarSL : (row.dollarSL || 0);
if (pips > 0) {
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
state.currentProfitTrades += 1;
state.currentProfitPips += pips;
state.currentProfitDollar += profitDollar;
}
else if (pips < 0) {
const absPips = Math.abs(pips);
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
}
state.currentLossTrades += 1;
state.currentLossPips += absPips;
state.currentLossDollar += lossDollar;
}
else {
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
}
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
}
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
}
function tf_updateStreakStateFixedLot(state, row) {
const pips = isFinite(row.pips) ? row.pips : 0;
const lotFixed = Number(row.lotFixed);
const dpp = Math.abs(Number(row.dollarPerPip) || 0);
const pnlDollarFixed = (isFinite(lotFixed) ? lotFixed : 0) * dpp * (Number(pips) || 0);
const profitDollar = pnlDollarFixed > 0 ? pnlDollarFixed : 0;
const lossDollar = pnlDollarFixed < 0 ? Math.abs(pnlDollarFixed) : 0;
if (pips > 0) {
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
state.currentProfitTrades += 1;
state.currentProfitPips += pips;
state.currentProfitDollar += profitDollar;
}
else if (pips < 0) {
const absPips = Math.abs(pips);
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
}
state.currentLossTrades += 1;
state.currentLossPips += absPips;
state.currentLossDollar += lossDollar;
}
else {
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
}
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
}
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
}
function computeAndRenderEquityDrawdownSummary() {
const container = document.getElementById('equity-drawdown-summary');
const detailEl = document.getElementById('equity-drawdown-detail');
if (!container || !detailEl) {
return;
}
if (!Array.isArray(equityCurvePoints) || equityCurvePoints.length === 0) {
detailEl.textContent =
'Belum ada data drawdown. Tambahkan history di Table 3 atau lakukan Scan terlebih dahulu.';
return;
}
let peakEquity = null;
let peakIdx = 0;
let maxEquityDrawdown = 0;
let ddPeakIdx = 0;
let ddTroughIdx = 0;
equityCurvePoints.forEach((p, idx) => {
const e = p && typeof p.equity === 'number' ? p.equity : null;
if (e === null || !isFinite(e))
return;
if (peakEquity === null) {
peakEquity = e;
peakIdx = idx;
ddPeakIdx = idx;
ddTroughIdx = idx;
return;
}
if (e > peakEquity) {
peakEquity = e;
peakIdx = idx;
}
const dd = e - peakEquity;
if (dd < maxEquityDrawdown) {
maxEquityDrawdown = dd;
ddPeakIdx = peakIdx;
ddTroughIdx = idx;
}
});
const ddPeakPoint = equityCurvePoints[ddPeakIdx] || null;
const ddTroughPoint = equityCurvePoints[ddTroughIdx] || null;
const ddPeakDate = ddPeakPoint && ddPeakPoint.date ? ddPeakPoint.date : '-';
const ddTroughDate = ddTroughPoint && ddTroughPoint.date ? ddTroughPoint.date : '-';
const ddDetailTrades = [];
let ddDetailTotalDollar = 0;
// REV175: drawdown percentage is calculated from the signed PnL % of each
// actual trade between the equity peak and trough. Withdraw rows remain part
// of the dollar equity curve, but are deliberately excluded from this
// percentage because they are cash movements, not trade PnL.
let ddTradePercentNet = null;
if (ddTroughIdx > ddPeakIdx) {
let ddTradePctTotal = 0;
let ddTradePctHasValue = false;
for (let i = ddPeakIdx + 1; i <= ddTroughIdx; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const pnlDollar = typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar) ? p.pnlDollar : 0;
ddDetailTrades.push({
analyst: (p.isWithdraw ? 'Withdraw' : (p.analyst || 'Unknown')),
pair: (p.isWithdraw ? 'User' : (p.pair || '-')),
pnlDollar: pnlDollar
});
ddDetailTotalDollar += pnlDollar;
if (!p.isWithdraw) {
const pnlPct = Number(p.pnlPercent);
if (Number.isFinite(pnlPct)) {
ddTradePctTotal += pnlPct;
ddTradePctHasValue = true;
}
}
}
if (ddTradePctHasValue && Number.isFinite(ddTradePctTotal)) {
ddTradePercentNet = ddTradePctTotal;
}
}
let maxStreakLength = 0;
let maxStreakLoss = 0;
let bestStartIndex = -1;
let bestEndIndex = -1;
let currentLength = 0;
let currentLoss = 0;
let currentStartIndex = -1;
equityCurvePoints.forEach((point, index) => {
const pnl = equityMetric === 'usd'
? (point && typeof point.pnlDollar === 'number' ? point.pnlDollar : 0)
: (point && typeof point.pnlPips === 'number' ? point.pnlPips : 0);
if (pnl < 0) {
if (currentLength === 0) {
currentStartIndex = index;
currentLength = 1;
currentLoss = pnl;
}
else {
currentLength += 1;
currentLoss += pnl;
}
if (currentLength > maxStreakLength ||
(currentLength === maxStreakLength && currentLoss < maxStreakLoss)) {
maxStreakLength = currentLength;
maxStreakLoss = currentLoss;
bestStartIndex = currentStartIndex;
bestEndIndex = index;
}
}
else {
currentLength = 0;
currentLoss = 0;
currentStartIndex = -1;
}
});
let html = '';
const priceBusy = tf_isMyfxbookPriceLoading();
// REV177: summary values are rendered as separate metric cards so consecutive
// loss drawdown and maximum equity drawdown cannot be confused.
function tf_summarySectionStart(title, subtitle, accentColor) {
return '<section style="margin-top:7.2px;padding:7.2px 9px;border:1px solid rgba(148,163,184,.18);border-radius:10.8px;background:linear-gradient(180deg,rgba(15,23,42,.22),rgba(2,6,23,.12));">' +
'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:7.2px;flex-wrap:wrap;margin-bottom:5.4px;">' +
'<div><div style="font-weight:800;color:' + accentColor + ';font-size:10.8px;line-height:1.2;">' + title + '</div>' +
'<div style="margin-top:1.8px;font-size:8.1px;opacity:.70;line-height:1.35;max-width:810px;">' + subtitle + '</div></div></div>';
}
function tf_summaryMetric(label, valueHtml, accentColor, noteHtml) {
return '<div style="min-width:153px;max-width:198px;flex:0 0 210px;padding:6.3px 7.2px;border:1px solid rgba(148,163,184,.16);border-radius:8.1px;background:rgba(2,6,23,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.02);">' +
'<div style="font-size:7.2px;opacity:.72;margin-bottom:2.7px;line-height:1.18;text-transform:uppercase;letter-spacing:.02em;">' + label + '</div>' +
'<div class="mono" style="font-size:9.9px;font-weight:700;line-height:1.32;overflow-wrap:anywhere;color:' + accentColor + ';">' + (valueHtml || '-') + '</div>' +
(noteHtml ? '<div style="font-size:6.3px;opacity:.58;margin-top:1.8px;line-height:1.22;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + noteHtml + '</div>' : '') + '</div>';
}
function tf_summaryDateRangeMetric(label, startHtml, endHtml, accentColor, noteHtml) {
return tf_summaryMetric(label, '<div style="display:grid;grid-template-columns:43.2px 1fr;column-gap:5.4px;row-gap:1.8px;align-items:start;"><span style="opacity:.78;">MULAI</span><span>' + (startHtml || '-') + '</span><span style="opacity:.78;">SELESAI</span><span>' + (endHtml || '-') + '</span></div>', accentColor, noteHtml);
}
function tf_summaryGridStart(minWidth) {
const w = (Number.isFinite(Number(minWidth)) && Number(minWidth) > 0) ? Math.max(160, Math.min(220, Number(minWidth))) : 190;
return '<div style="display:flex;flex-wrap:wrap;align-items:stretch;gap:5.4px;">';
}
function escHtml(str) {
return String(str || '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
function tf_pctStr(lossAbs, baseEquity) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(baseEquity);
const l = Number(lossAbs);
if (!isFinite(b) || !isFinite(l) || b === 0)
return '';
const pct = (l / Math.abs(b)) * 100;
if (!isFinite(pct))
return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
const s = showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '');
return s + '%';
}
catch (e) {
return '';
}
}
function tf_pctRemainStr(lastEquity, baseEquity) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(baseEquity);
const l = Number(lastEquity);
if (!isFinite(b) || !isFinite(l) || b === 0)
return '';
const pct = (l / Math.abs(b)) * 100;
if (!isFinite(pct))
return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
const s = showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '');
return s + '%';
}
catch (e) {
return '';
}
}
function tf_tradePnlPctSignedStr(value) {
try {
const v = Number(value);
if (!Number.isFinite(v))
return '';
const rounded2 = Math.round(v * 100) / 100;
const rounded1 = Math.round(v * 10) / 10;
const rounded0 = Math.round(v);
let text = '';
if (Math.abs(v - rounded0) < 0.005) text = String(rounded0);
else if (Math.abs(v - rounded1) < 0.005) text = String(rounded1).replace(/\.0$/, '');
else text = String(rounded2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
if (v > 0 && text.charAt(0) !== '+') text = '+' + text;
return text + '%';
}
catch (e) {
return '';
}
}
function tf_balanceMoneyStr(val) {
try {
const v = Number(val);
if (!isFinite(v))
return '-';
if (v < 0)
return '-' + formatMoney(Math.abs(v));
return formatMoney(v);
}
catch (e) {
return '-';
}
function tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity) {
try {
if (equityMetric !== 'usd')
return ddBaseEquity;
let startBal = null;
if (riskMode === 'compound') {
const mk = ddPeakPoint && (ddPeakPoint.sortKey != null) ? tf_monthKeyFromSortKey(ddPeakPoint.sortKey) : null;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (mk && Array.isArray(srcRows) && srcRows.length) {
const sk = ddPeakPoint ? ddPeakPoint.sortKey : null;
const a = ddPeakPoint && ddPeakPoint.analyst ? String(ddPeakPoint.analyst) : '';
const p = ddPeakPoint && ddPeakPoint.pair ? String(ddPeakPoint.pair) : '';
if (sk != null) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
if (r.sortKey === sk && String(r.analyst || '') === a && String(r.pair || '') === p && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
const rmk = tf_monthKeyFromSortKey(r.sortKey);
if (rmk === mk && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
if (Number.isFinite(currentBalance) && currentBalance > 0)
startBal = currentBalance;
}
}
else {
if (Number.isFinite(currentBalance) && currentBalance > 0)
startBal = currentBalance;
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
startBal = ddBaseEquity;
}
return (Number.isFinite(startBal) ? startBal : ddBaseEquity);
}
catch (e) {
return ddBaseEquity;
}
}
}
if (maxStreakLength > 0 && bestStartIndex !== -1 && bestEndIndex !== -1) {
const startPoint = equityCurvePoints[bestStartIndex];
const endPoint = equityCurvePoints[bestEndIndex];
// REV174: consecutive-loss capital statistics always use the actual USD balance,
// even when the visible Equity Curve metric is PnL Pips. The starting capital is
// the balance immediately BEFORE the first losing trade in the selected streak.
const streakStartCapital = (function () {
try {
const initialCapital = Number(currentBalance);
let capital = Number.isFinite(initialCapital) ? initialCapital : 0;
for (let i = 1; i < bestStartIndex; i++) {
const p = equityCurvePoints[i];
const d = p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
capital += d;
}
return Number.isFinite(capital) ? capital : null;
}
catch (e) { return null; }
})();
const streakDollarLoss = (function () {
try {
let total = 0;
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const p = equityCurvePoints[i];
const d = p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
total += d;
}
return Number.isFinite(total) ? total : null;
}
catch (e) { return null; }
})();
const streakEndCapital = (streakStartCapital !== null && streakDollarLoss !== null)
? (streakStartCapital + streakDollarLoss)
: null;
const tf_streakCapitalPctStr = function (value, base) {
try {
const v = Number(value);
const b = Number(base);
if (!Number.isFinite(v) || !Number.isFinite(b) || b === 0) return '';
const pct = (v / Math.abs(b)) * 100;
if (!Number.isFinite(pct)) return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
return (showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '')) + '%';
}
catch (e) { return ''; }
};
// REV174: the percentage beside consecutive loss is the accumulated PnL %
// of every losing trade in the selected streak. Example: 25 trades at -1%
// each are displayed as 25%, regardless of the dollar balance growth before
// the streak. The actual capital impact remains shown separately below.
const streakTradePercentLoss = (function () {
try {
let total = 0;
let hasValue = false;
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const p = equityCurvePoints[i];
const pct = p && Number.isFinite(Number(p.pnlPercent)) ? Number(p.pnlPercent) : null;
if (pct !== null && pct < 0) {
total += Math.abs(pct);
hasValue = true;
}
}
return hasValue && Number.isFinite(total) ? total : null;
}
catch (e) { return null; }
})();
const tf_streakTradePctStr = function (value) {
try {
const v = Number(value);
if (!Number.isFinite(v)) return '';
const rounded2 = Math.round(v * 100) / 100;
const rounded1 = Math.round(v * 10) / 10;
const rounded0 = Math.round(v);
let text = '';
if (Math.abs(v - rounded0) < 0.005) text = String(rounded0);
else if (Math.abs(v - rounded1) < 0.005) text = String(rounded1).replace(/\.0$/, '');
else text = String(rounded2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
return text + '%';
}
catch (e) { return ''; }
};
const streakPct = tf_streakTradePctStr(streakTradePercentLoss);
// REV176: separate the two percentage bases clearly.
// 1) Drawdown actual uses the USD balance immediately before the first loss.
// 2) Cons Loss uses the accumulated PnL % of every loss trade in the streak.
// 3) The capital overview always starts from the user's original Balance input.
const streakActualDrawdownPct = (streakDollarLoss !== null && streakStartCapital !== null)
? tf_streakCapitalPctStr(Math.abs(streakDollarLoss), streakStartCapital)
: '';
const streakPeriodRemainPct = tf_streakCapitalPctStr(streakEndCapital, streakStartCapital);
const streakInputCapital = (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : null);
const streakInputRemainPct = tf_streakCapitalPctStr(streakEndCapital, streakInputCapital);
const streakValText = (priceBusy
? tf_spinnerHTML(true)
: (streakDollarLoss === null ? '-' : formatSignedMoney(streakDollarLoss))) +
(streakActualDrawdownPct ? ' (' + streakActualDrawdownPct + ')' : '');
const streakStartCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakStartCapital === null ? '-' : tf_balanceMoneyStr(streakStartCapital));
const streakEndCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakEndCapital === null ? '-' : tf_balanceMoneyStr(streakEndCapital));
const streakInputCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakInputCapital === null ? '-' : tf_balanceMoneyStr(streakInputCapital));
const ddBaseEquity = ddPeakPoint && typeof ddPeakPoint.equity === 'number' && isFinite(ddPeakPoint.equity) ? ddPeakPoint.equity : null;
const ddPct = tf_pctStr(Math.abs(maxEquityDrawdown), ddBaseEquity);
const ddPctNeg = ddPct ? ('-' + String(ddPct).replace(/^[-+]/, '')) : '';
const ddMoneyHtml = (priceBusy ? tf_spinnerHTML(true) : formatEquityMetricSigned(maxEquityDrawdown));
const startDate = startPoint && startPoint.date ? startPoint.date : '-';
const endDate = endPoint && endPoint.date ? endPoint.date : '-';
html += tf_summarySectionStart(
'1. Consecutive Loss Drawdown',
'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya. Tidak sama dengan penurunan High Equity → Low Equity.',
'#ef4444'
);
html += tf_summaryGridStart(155);
html += tf_summaryDateRangeMetric('Rentang streak loss', startDate, endDate, '#ef4444');
html += tf_summaryMetric('Jumlah loss berturut-turut', maxStreakLength + 'x', '#ef4444', 'Gabungan seluruh Analis–Pair sesuai filter.');
html += tf_summaryMetric('Total loss aktual', (priceBusy ? tf_spinnerHTML(true) : (streakDollarLoss === null ? '-' : formatSignedMoney(streakDollarLoss))), '#ef4444');
html += tf_summaryMetric('Drawdown aktual streak', (streakActualDrawdownPct || '-'), '#ef4444', 'Total loss aktual ÷ modal tepat sebelum loss pertama.');
html += tf_summaryMetric('Cons Loss (Σ PnL % trade)', (streakPct || '-'), '#ef4444', 'Akumulasi PnL % dari setiap trade loss dalam streak.');
html += '</div>';
html += '<div style="margin-top:7.2px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Modal awal input', streakInputCapitalText, '#ef4444', 'Mengikuti input Balance awal pengguna.');
html += tf_summaryMetric('Modal setelah streak', streakEndCapitalText, '#ef4444');
html += tf_summaryMetric('Sisa modal vs input awal', (streakInputRemainPct || '-'), '#ef4444', 'Modal setelah streak ÷ modal awal input.');
html += '</div></div>';
html += '<div style="margin-top:7.2px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Modal sebelum loss pertama', streakStartCapitalText, '#ef4444');
html += tf_summaryMetric('Modal setelah loss terakhir', streakEndCapitalText, '#ef4444');
html += tf_summaryMetric('Sisa modal periode streak', (streakPeriodRemainPct || '-'), '#ef4444', 'Modal setelah streak ÷ modal sebelum streak.');
html += '</div></div></section>';
html += tf_summarySectionStart(
'2. Maximum Equity Drawdown — High Equity → Low Equity',
'Penurunan paling tajam dari puncak equity tertinggi menuju titik equity terendah berikutnya. Periode ini dapat berisi trade loss dan trade profit.',
'#fbbf24'
);
const ddLowEquity = ddTroughPoint && typeof ddTroughPoint.equity === 'number' && isFinite(ddTroughPoint.equity)
? ddTroughPoint.equity
: null;
const ddRangeStartBalance = (function () {
try {
if (equityMetric !== 'usd')
return null;
if (riskMode === 'compound') {
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (!Array.isArray(srcRows) || !srcRows.length)
return null;
let firstRow = null;
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r || r.sortKey == null || !isFinite(r.sortKey))
continue;
if (!firstRow || r.sortKey < firstRow.sortKey)
firstRow = r;
}
if (!firstRow)
return null;
const mk = (firstRow.sortKey != null) ? tf_monthKeyFromSortKey(firstRow.sortKey) : null;
let bestRow = null;
if (mk) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r || r.sortKey == null || !isFinite(r.sortKey))
continue;
if (tf_monthKeyFromSortKey(r.sortKey) !== mk)
continue;
if (Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
if (!bestRow || r.sortKey < bestRow.sortKey)
bestRow = r;
}
}
}
if (bestRow && Number.isFinite(bestRow.balanceCompound) && bestRow.balanceCompound > 0)
return bestRow.balanceCompound;
if (Number.isFinite(firstRow.balanceCompound) && firstRow.balanceCompound > 0)
return firstRow.balanceCompound;
return null;
}
if (typeof currentBalance === 'number' && isFinite(currentBalance) && currentBalance > 0)
return currentBalance;
return null;
}
catch (e) {
return null;
}
})();
function tf_pctSignedStr(delta, base) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(base);
const d = Number(delta);
if (!isFinite(b) || b === 0 || !isFinite(d))
return '';
const mag = tf_pctStr(Math.abs(d), b);
if (!mag)
return '';
const sign = d > 0 ? '+' : (d < 0 ? '-' : '');
return sign + String(mag).replace(/^[-+]/, '');
}
catch (e) {
return '';
}
}
function tf_pctFromBaseStr(value, base) {
try {
const v = Number(value);
const b = Number(base);
if (!isFinite(v) || !isFinite(b) || b === 0)
return '';
return tf_pctSignedStr(v - b, b);
}
catch (e) {
return '';
}
}
const ddHighHtml = (priceBusy ? tf_spinnerHTML(true) : (ddBaseEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddBaseEquity) : formatPlainNumber(ddBaseEquity, 2))));
const ddLowHtml = (priceBusy ? tf_spinnerHTML(true) : (ddLowEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddLowEquity) : formatPlainNumber(ddLowEquity, 2))));
const ddHighPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddBaseEquity, ddRangeStartBalance) : '';
const ddLowPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddLowEquity, ddRangeStartBalance) : '';
const ddHighPctColor = ddHighPct.startsWith('+') ? '#22c55e' : (ddHighPct.startsWith('-') ? '#ef4444' : '#9ca3af');
const ddLowPctColor = ddLowPct.startsWith('+') ? '#22c55e' : (ddLowPct.startsWith('-') ? '#ef4444' : '#9ca3af');
const ddLossFromHighDollar = (function () {
try {
const h = Number(ddBaseEquity);
const l = Number(ddLowEquity);
if (!isFinite(h) || !isFinite(l) || h === 0)
return null;
return (l - h);
}
catch (e) {
return null;
}
})();
const ddLossFromHighHtml = (priceBusy ? tf_spinnerHTML(true) : (ddLossFromHighDollar === null ? '-' : formatEquityMetricSigned(ddLossFromHighDollar)));
const ddLossFromHighPct = tf_tradePnlPctSignedStr(ddTradePercentNet);
const __ddMaxLabel = (equityMetric === 'usd') ? 'Drawdown equity-MAX :' : 'Drawdown Pips-MAX :';
const __ddHighLabel = (equityMetric === 'usd') ? 'High equity :' : 'High Pips :';
const __ddLowLabel = (equityMetric === 'usd') ? 'Low equity :' : 'Low Pips :';
html += tf_summaryGridStart();
html += tf_summaryDateRangeMetric('Rentang High → Low', ddPeakDate, ddTroughDate, '#fbbf24');
html += tf_summaryMetric(__ddHighLabel.replace(/\s*:\s*$/, ''), ddHighHtml + (ddHighPct ? ' <span style="color:' + ddHighPctColor + ';">(' + ddHighPct + ')</span>' : ''), '#fbbf24');
html += tf_summaryMetric(__ddLowLabel.replace(/\s*:\s*$/, ''), ddLowHtml + (ddLowPct ? ' <span style="color:' + ddLowPctColor + ';">(' + ddLowPct + ')</span>' : ''), '#fbbf24');
html += tf_summaryMetric('Penurunan equity aktual', '<span style="color:#ef4444;">' + ddLossFromHighHtml + '</span>', '#ef4444');
html += tf_summaryMetric('Drawdown PnL % (Σ trade)', (ddLossFromHighPct || '-'), '#ef4444', 'Akumulasi PnL % seluruh trade dalam rentang High → Low; withdraw tidak dihitung sebagai PnL trade.');
html += '</div>';
const ddStartEquity = tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity);
const ddLossAbsDollar = (typeof ddDetailTotalDollar === 'number' && isFinite(ddDetailTotalDollar))
? Math.abs(ddDetailTotalDollar)
: 0;
const ddLastEquity = (ddStartEquity !== null && isFinite(ddStartEquity))
? (ddStartEquity - ddLossAbsDollar)
: null;
const ddLossPctNeg = tf_tradePnlPctSignedStr(ddTradePercentNet);
const ddStartHtml = (priceBusy ? tf_spinnerHTML(true) : (ddStartEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddStartEquity) : formatPlainNumber(ddStartEquity, 2))));
const ddLastHtml = (priceBusy ? tf_spinnerHTML(true) : (ddLastEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddLastEquity) : formatPlainNumber(ddLastEquity, 2))));
const ddDeltaDollar = (ddStartEquity !== null && ddLastEquity !== null && isFinite(ddStartEquity) && isFinite(ddLastEquity))
? (ddLastEquity - ddStartEquity)
: null;
const ddDeltaHtml = (priceBusy ? tf_spinnerHTML(true) : (ddDeltaDollar === null ? '-' : formatEquityMetricSigned(ddDeltaDollar)));
const __ddStartLabel = (equityMetric === 'usd')
? ((typeof riskMode !== 'undefined' && riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance')
: 'Start Pips';
const __ddLastLabel = (equityMetric === 'usd') ? 'Last Balance' : 'Last Pips';
const __isMarginCall = (ddStartEquity !== null && isFinite(ddStartEquity) && ddStartEquity > 0 &&
ddLastEquity !== null && isFinite(ddLastEquity) && ddLastEquity <= 0);
const __marginCallHtml = __isMarginCall
? ' <span class="mono" style="color:#ef4444; font-weight:800;">MARGIN CALL!</span>'
: '';
html += '<div style="margin-top:7.2px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric(__ddStartLabel + ' (basis)', ddStartHtml + ' <span style="opacity:.7;">(100%)</span>', '#fbbf24');
html += tf_summaryMetric(__ddLastLabel + ' setelah drawdown', ddLastHtml, '#fbbf24');
html += tf_summaryMetric('Perubahan balance pada periode', '<span style="color:#ef4444;">' + ddDeltaHtml + '</span>', '#ef4444');
html += tf_summaryMetric('Drawdown PnL % periode', (ddLossPctNeg || '-'), '#ef4444');
if (__marginCallHtml) html += tf_summaryMetric('Status risiko', __marginCallHtml, '#ef4444');
html += '</div></div>';
if (equityMetric === 'usd') {
try {
const __startBalOverall = Number.isFinite(currentBalance) ? currentBalance : 0;
const __srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
let __lastRow = null;
let __lastSk = null;
for (let i = 0; i < __srcRows.length; i++) {
const r = __srcRows[i];
if (!r)
continue;
if (r.isStart)
continue;
const sk = tf_getPrimarySortKey(r);
if (!Number.isFinite(sk))
continue;
if (__lastRow === null || sk > __lastSk) {
__lastRow = r;
__lastSk = sk;
}
}
const __lastBalOverall = (__lastRow && Number.isFinite(__lastRow.balancePnl))
? __lastRow.balancePnl
: (__lastRow && Number.isFinite(__lastRow.balanceCompound))
? __lastRow.balanceCompound
: null;
const __deltaOverall = (__lastBalOverall !== null) ? (__lastBalOverall - __startBalOverall) : null;
const __deltaColor = (typeof __deltaOverall === 'number' && isFinite(__deltaOverall))
? (__deltaOverall > 0 ? '#22c55e' : (__deltaOverall < 0 ? '#ef4444' : '#9ca3af'))
: '#9ca3af';
const __startHtml = priceBusy ? tf_spinnerHTML(true) : tf_balanceMoneyStr(__startBalOverall);
const __lastHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__lastBalOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + tf_balanceMoneyStr(__lastBalOverall) + '</span>'));
const __deltaHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__deltaOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + formatSignedMoney(__deltaOverall) + '</span>'));
const __pctHtml = (__deltaOverall !== null && __startBalOverall) ? tf_pctSignedStr(__deltaOverall, __startBalOverall) : '';
const __pctHtmlColored = __pctHtml
? (' <span class="mono" style="color:' + __deltaColor + '; opacity:.95;">(' + __pctHtml + ')</span>')
: '';
html += '<div style="margin-top:9px;padding-top:9px;border-top:1px solid rgba(148,163,184,.22);">' +
'<div style="font-size:9.9px;font-weight:700;margin-bottom:6.3px;">Ringkasan Balance Keseluruhan</div>' + tf_summaryGridStart() +
tf_summaryMetric('Modal awal input', __startHtml, '#cbd5e1') +
tf_summaryMetric('Last Balance', __lastHtmlColored, __deltaColor) +
tf_summaryMetric('Kenaikan / penurunan balance', __deltaHtmlColored + __pctHtmlColored, __deltaColor) +
'</div></div>';
}
catch (e) { }
}
if (ddDetailTrades.length > 0) {
html += '<div style="margin-top:5.4px;"><strong>Detail Trade Max Drawdown</strong></div>';
html += '<div style="margin-top:3.6px; max-height:126px; overflow:auto; border:1px solid rgba(148,163,184,0.35); border-radius:9px;">';
html += '<table style="width:100%; border-collapse:collapse; font-size:9.9px;">';
html += '<thead><tr>';
html += '<th style="text-align:left; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">Analis</th>';
html += '<th style="text-align:left; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">Pair</th>';
html += '<th style="text-align:right; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">PnL $</th>';
html += '</tr></thead><tbody>';
ddDetailTrades.forEach((t) => {
const __pnl = Number(t.pnlDollar);
const __pnlColor = (isFinite(__pnl) && __pnl >= 0) ? '#22c55e' : '#ef4444';
const __pnlHtml = priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + __pnlColor + ';">' + formatSignedMoney(t.pnlDollar) + '</span>');
html += '<tr>' +
'<td style="padding:2.7px 5.4px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.analyst) + '</span></td>' +
'<td style="padding:2.7px 5.4px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.pair) + '</span></td>' +
'<td style="padding:2.7px 5.4px; text-align:right; border-bottom:1px solid rgba(148,163,184,0.12);">' + __pnlHtml + '</td>' +
'</tr>';
});
html += '</tbody><tfoot><tr>' +
'<td colspan="2" style="padding:3.6px 5.4px; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">Total</td>' +
'<td style="padding:3.6px 5.4px; text-align:right; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">' + (priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + ((Number(ddDetailTotalDollar) >= 0) ? '#22c55e' : '#ef4444') + ';">' + formatSignedMoney(ddDetailTotalDollar) + '</span>')) + '</td>' +
'</tr></tfoot></table></div>';
}
html += '</section>';
}
else {
html += tf_summarySectionStart(
'1. Consecutive Loss Drawdown',
'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya.',
'#ef4444'
);
html += '<div style="font-size:9.9px;opacity:.75;">Belum ada periode consecutive loss yang dapat dihitung untuk filter saat ini.</div></section>';
html += tf_summarySectionStart(
'2. Maximum Equity Drawdown — High Equity → Low Equity',
'Penurunan paling tajam dari puncak equity tertinggi menuju titik equity terendah berikutnya.',
'#fbbf24'
);
const ddBaseEquity2 = ddPeakPoint && typeof ddPeakPoint.equity === 'number' && isFinite(ddPeakPoint.equity) ? ddPeakPoint.equity : null;
const ddPctNeg2 = tf_tradePnlPctSignedStr(ddTradePercentNet);
const ddMoneyHtml2 = (priceBusy ? tf_spinnerHTML(true) : formatEquityMetricSigned(maxEquityDrawdown));
html += tf_summaryGridStart();
html += tf_summaryDateRangeMetric('Rentang High → Low', ddPeakDate, ddTroughDate, '#fbbf24');
html += tf_summaryMetric('Penurunan equity aktual', '<span style="color:#ef4444;">' + ddMoneyHtml2 + '</span>', '#ef4444');
html += tf_summaryMetric('Drawdown PnL % (Σ trade)', (ddPctNeg2 || '-'), '#ef4444');
html += '</div>';
const ddStartEquity2 = tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity2);
const ddLossAbsDollar2 = (typeof ddDetailTotalDollar === 'number' && isFinite(ddDetailTotalDollar))
? Math.abs(ddDetailTotalDollar)
: 0;
const ddLastEquity2 = (ddStartEquity2 !== null && isFinite(ddStartEquity2))
? (ddStartEquity2 - ddLossAbsDollar2)
: null;
const ddLossPctNeg2 = tf_tradePnlPctSignedStr(ddTradePercentNet);
const ddLastHtml2 = (priceBusy ? tf_spinnerHTML(true) : (ddLastEquity2 === null ? '-' : tf_balanceMoneyStr(ddLastEquity2)));
html += '<div style="margin-top:7.2px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Start Balance (basis)', (priceBusy ? tf_spinnerHTML(true) : (ddStartEquity2 === null ? '-' : tf_balanceMoneyStr(ddStartEquity2))), '#fbbf24');
html += tf_summaryMetric('Last Balance setelah drawdown', ddLastHtml2, '#fbbf24');
html += tf_summaryMetric('Drawdown PnL % periode', (ddLossPctNeg2 || '-'), '#ef4444');
html += '</div></div>';
if (equityMetric === 'usd') {
try {
const __startBalOverall = Number.isFinite(currentBalance) ? currentBalance : 0;
const __srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
let __lastRow = null;
let __lastSk = null;
for (let i = 0; i < __srcRows.length; i++) {
const r = __srcRows[i];
if (!r)
continue;
if (r.isStart)
continue;
const sk = tf_getPrimarySortKey(r);
if (!Number.isFinite(sk))
continue;
if (__lastRow === null || sk > __lastSk) {
__lastRow = r;
__lastSk = sk;
}
}
const __lastBalOverall = (__lastRow && Number.isFinite(__lastRow.balancePnl))
? __lastRow.balancePnl
: (__lastRow && Number.isFinite(__lastRow.balanceCompound))
? __lastRow.balanceCompound
: null;
const __deltaOverall = (__lastBalOverall !== null) ? (__lastBalOverall - __startBalOverall) : null;
const __deltaColor = (typeof __deltaOverall === 'number' && isFinite(__deltaOverall))
? (__deltaOverall > 0 ? '#22c55e' : (__deltaOverall < 0 ? '#ef4444' : '#9ca3af'))
: '#9ca3af';
const __startHtml = priceBusy ? tf_spinnerHTML(true) : tf_balanceMoneyStr(__startBalOverall);
const __lastHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__lastBalOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + tf_balanceMoneyStr(__lastBalOverall) + '</span>'));
const __deltaHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__deltaOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + formatSignedMoney(__deltaOverall) + '</span>'));
const __pctHtml = (__deltaOverall !== null && __startBalOverall) ? tf_pctSignedStr(__deltaOverall, __startBalOverall) : '';
const __pctHtmlColored = __pctHtml
? (' <span class="mono" style="color:' + __deltaColor + '; opacity:.95;">(' + __pctHtml + ')</span>')
: '';
html += '<div style="margin-top:9px;padding-top:9px;border-top:1px solid rgba(148,163,184,.22);">' +
'<div style="font-size:9.9px;font-weight:700;margin-bottom:6.3px;">Ringkasan Balance Keseluruhan</div>' + tf_summaryGridStart() +
tf_summaryMetric('Modal awal input', __startHtml, '#cbd5e1') +
tf_summaryMetric('Last Balance', __lastHtmlColored, __deltaColor) +
tf_summaryMetric('Kenaikan / penurunan balance', __deltaHtmlColored + __pctHtmlColored, __deltaColor) +
'</div></div>';
}
catch (e) { }
}
if (ddDetailTrades.length > 0) {
html += '<div style="margin-top:5.4px;"><strong>Detail Trade Max Drawdown</strong></div>';
html += '<div style="margin-top:3.6px; max-height:126px; overflow:auto; border:1px solid rgba(148,163,184,0.35); border-radius:9px;">';
html += '<table style="width:100%; border-collapse:collapse; font-size:9.9px;">';
html += '<thead><tr>';
html += '<th style="text-align:left; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">Analis</th>';
html += '<th style="text-align:left; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">Pair</th>';
html += '<th style="text-align:right; padding:3.6px 5.4px; border-bottom:1px solid rgba(148,163,184,0.25);">PnL $</th>';
html += '</tr></thead><tbody>';
ddDetailTrades.forEach((t) => {
const __pnl = Number(t.pnlDollar);
const __pnlColor = (isFinite(__pnl) && __pnl >= 0) ? '#22c55e' : '#ef4444';
const __pnlHtml = priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + __pnlColor + ';">' + formatSignedMoney(t.pnlDollar) + '</span>');
html += '<tr>' +
'<td style="padding:2.7px 5.4px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.analyst) + '</span></td>' +
'<td style="padding:2.7px 5.4px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.pair) + '</span></td>' +
'<td style="padding:2.7px 5.4px; text-align:right; border-bottom:1px solid rgba(148,163,184,0.12);">' + __pnlHtml + '</td>' +
'</tr>';
});
html += '</tbody><tfoot><tr>' +
'<td colspan="2" style="padding:3.6px 5.4px; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">Total</td>' +
'<td style="padding:3.6px 5.4px; text-align:right; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">' + (priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + ((Number(ddDetailTotalDollar) >= 0) ? '#22c55e' : '#ef4444') + ';">' + formatSignedMoney(ddDetailTotalDollar) + '</span>')) + '</td>' +
'</tr></tfoot></table></div>';
}
html += '</section>';
}
detailEl.innerHTML = html;
}
function computeAndRenderDrawdownStats(rows) {
const overall = makeEmptyStreakState();
const perAnalystStates = new Map();
const priceBusy = tf_isMyfxbookPriceLoading();
rows.forEach((row) => {
tf_updateStreakStateFixedLot(overall, row);
const key = (row && row.isWithdraw) ? 'Withdraw' : (row.analyst || 'Unknown');
if (!perAnalystStates.has(key)) {
perAnalystStates.set(key, makeEmptyStreakState());
}
updateStreakState(perAnalystStates.get(key), row);
});
try {
finalizeStreakState(overall);
}
catch (e) { }
try {
perAnalystStates.forEach((st) => { try {
finalizeStreakState(st);
}
catch (e) { } });
}
catch (e) { }
const chipsContainer = document.getElementById('drawdown-overall-chips');
if (chipsContainer) {
chipsContainer.innerHTML = '';
const chip1 = document.createElement('span');
chip1.className = 'chip';
chip1.textContent =
'Max Consecutive Profit (Total): ' +
overall.maxProfitTrades +
' trades, ' +
formatNumber(overall.maxProfitPips || 0, 1) +
' pips, ' +
formatMoney(overall.maxProfitDollar || 0);
chipsContainer.appendChild(chip1);
const chip2 = document.createElement('span');
chip2.className = 'chip';
chip2.textContent =
'Max Consecutive Loss (Total Drawdown): ' +
overall.maxLossTrades +
' trades, ' +
formatNumber(overall.maxLossPips || 0, 1) +
' pips, ' +
formatMoney(overall.maxLossDollar || 0);
chipsContainer.appendChild(chip2);
const chip3 = document.createElement('span');
chip3.className = 'chip';
chip3.textContent = 'Total trades di history: ' + rows.length;
chipsContainer.appendChild(chip3);
}
const tbody = document.querySelector('#drawdown-table tbody');
if (tbody) {
tbody.innerHTML = '';
const analystNames = Array.from(perAnalystStates.keys()).sort((a, b) => a.localeCompare(b));
const detailByAnalyst = {};
analystNames.forEach((name) => {
const st = perAnalystStates.get(name);
detailByAnalyst[name] = st;
const tr = document.createElement('tr');
try {
tr.dataset.analyst = name;
}
catch (e) { }
const ctrlCell = document.createElement('td');
ctrlCell.className = 'dd-details-control';
ctrlCell.textContent = '▶';
tr.appendChild(ctrlCell);
const nameCell = document.createElement('td');
nameCell.textContent = name;
tr.appendChild(nameCell);
const maxProfitTradesCell = document.createElement('td');
maxProfitTradesCell.className = 'mono tp';
maxProfitTradesCell.textContent = st.maxProfitTrades || 0;
tr.appendChild(maxProfitTradesCell);
const profitBucket = st && st.profitRuns ? st.profitRuns[st.maxProfitTrades || 0] : null;
const maxProfitCountCell = document.createElement('td');
maxProfitCountCell.className = 'mono tp';
maxProfitCountCell.textContent = (st.maxProfitTrades || 0) ? ((profitBucket && profitBucket.count) ? profitBucket.count : 0) : '-';
tr.appendChild(maxProfitCountCell);
const maxProfitPipsCell = document.createElement('td');
maxProfitPipsCell.className = 'mono tp';
maxProfitPipsCell.textContent = st.maxProfitPips ? formatNumber(st.maxProfitPips, 1) : '-';
tr.appendChild(maxProfitPipsCell);
const maxProfitDollarCell = document.createElement('td');
maxProfitDollarCell.className = 'mono tp';
if (priceBusy) {
maxProfitDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
maxProfitDollarCell.textContent = st.maxProfitDollar ? formatMoney(st.maxProfitDollar) : '-';
}
tr.appendChild(maxProfitDollarCell);
const maxLossTradesCell = document.createElement('td');
maxLossTradesCell.className = 'mono sl';
maxLossTradesCell.textContent = st.maxLossTrades || 0;
tr.appendChild(maxLossTradesCell);
const lossBucket = st && st.lossRuns ? st.lossRuns[st.maxLossTrades || 0] : null;
const maxLossCountCell = document.createElement('td');
maxLossCountCell.className = 'mono sl';
maxLossCountCell.textContent = (st.maxLossTrades || 0) ? ((lossBucket && lossBucket.count) ? lossBucket.count : 0) : '-';
tr.appendChild(maxLossCountCell);
const maxLossPipsCell = document.createElement('td');
maxLossPipsCell.className = 'mono sl';
maxLossPipsCell.textContent = st.maxLossPips ? formatNumber(st.maxLossPips, 1) : '-';
tr.appendChild(maxLossPipsCell);
const maxLossDollarCell = document.createElement('td');
maxLossDollarCell.className = 'mono sl';
if (priceBusy) {
maxLossDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
maxLossDollarCell.textContent = st.maxLossDollar ? formatMoney(st.maxLossDollar) : '-';
}
tr.appendChild(maxLossDollarCell);
tbody.appendChild(tr);
});
try {
window.__tfDrawdownDetailByAnalyst = detailByAnalyst;
}
catch (e) { }
try {
tf_bindDrawdownDetailsHandler();
}
catch (e) { }
}
const totalTbody = document.querySelector('#drawdown-total-table tbody');
if (totalTbody) {
totalTbody.innerHTML = '';
const trProfit = document.createElement('tr');
const typeProfit = document.createElement('td');
typeProfit.textContent = 'Consecutive Profit (Total)';
trProfit.appendChild(typeProfit);
const profitTrades = document.createElement('td');
profitTrades.className = 'text-right mono tp';
profitTrades.textContent = overall.maxProfitTrades || 0;
trProfit.appendChild(profitTrades);
const profitPips = document.createElement('td');
profitPips.className = 'text-right mono tp';
profitPips.textContent = overall.maxProfitPips ? formatNumber(overall.maxProfitPips, 1) : '-';
trProfit.appendChild(profitPips);
const profitDollar = document.createElement('td');
profitDollar.className = 'text-right mono tp';
if (priceBusy) {
profitDollar.innerHTML = tf_spinnerHTML(true);
}
else {
profitDollar.textContent = overall.maxProfitDollar ? formatMoney(overall.maxProfitDollar) : '-';
}
trProfit.appendChild(profitDollar);
const trLoss = document.createElement('tr');
const typeLoss = document.createElement('td');
typeLoss.textContent = 'Consecutive Loss (Total)';
trLoss.appendChild(typeLoss);
const lossTrades = document.createElement('td');
lossTrades.className = 'text-right mono sl';
lossTrades.textContent = overall.maxLossTrades || 0;
trLoss.appendChild(lossTrades);
const lossPips = document.createElement('td');
lossPips.className = 'text-right mono sl';
lossPips.textContent = overall.maxLossPips ? formatNumber(overall.maxLossPips, 1) : '-';
trLoss.appendChild(lossPips);
const lossDollar = document.createElement('td');
lossDollar.className = 'text-right mono sl';
if (priceBusy) {
lossDollar.innerHTML = tf_spinnerHTML(true);
}
else {
lossDollar.textContent = overall.maxLossDollar ? formatMoney(overall.maxLossDollar) : '-';
}
trLoss.appendChild(lossDollar);
totalTbody.appendChild(trProfit);
totalTbody.appendChild(trLoss);
}
}
function loadFromChromeStorageIfAvailable() {
const hasChromeAPI = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
if (!hasChromeAPI)
return;
chrome.storage.local.get(['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips'], (data) => {
const rawMonthlyStats = data.tfMonthlyStats || {};
const rawHistory = data.tfHistorySignals || [];
const rawSources = data.tfAnalystSources || {};
noDataPairsByAnalyst = (data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object') ? data.tfNoDataPairs : {};
avgSlPipsByAnalystPair = (data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object') ? data.tfAvgSlPips : {};
analystSourcesByName = {};
Object.keys(rawSources).forEach((name) => {
if (!name)
return;
analystSourcesByName[name] = {
url: rawSources[name].url,
pairs: Array.isArray(rawSources[name].pairs) ? rawSources[name].pairs.slice() : []
};
});
fillMonthlyFromStorage(rawMonthlyStats || {});
const validHistory = (rawHistory || []).filter((item) => {
if (!item || !item.analyst)
return false;
if (typeof item.pips === 'number')
return Number.isFinite(item.pips);
if (typeof item.pips === 'string' && item.pips.trim() !== '')
return Number.isFinite(parseFloat(item.pips));
return false;
});
historySignals = validHistory.map((item) => {
const parsedPips = (typeof item.pips === 'number') ? item.pips : parseFloat(item.pips);
return {
...item,
analyst: item.analyst,
pair: item.pair,
pips: Number.isFinite(parsedPips) ? parsedPips : 0,
displayDate: normalizeWIBSuffix(item.displayDate),
sortKey: item.sortKey,
createdDate: normalizeWIBSuffix(item.createdDate),
createdSortKey: item.createdSortKey
};
});
try {
initialHistorySignals = historySignals.map((item) => {
return {
...item,
displayDate: normalizeWIBSuffix(item.displayDate),
createdDate: normalizeWIBSuffix(item.createdDate)
};
});
}
catch (e) {
initialHistorySignals = Array.isArray(historySignals) ? historySignals.slice() : [];
}
rebuildAnalystListFromSources();
setupAnalystTickerFilter();
applyAnalystPairFilterAll();
setupHistoryForm();
chrome.storage.local.set({
tfAnalystSources: analystSourcesByName
}, () => {
recomputeHistoryRows();
});
});
}
function applyHistoryTableScroll() {
const section = document.getElementById('section-history');
if (!section)
return;
const scrollDiv = section.querySelector('.table-scroll');
const table = section.querySelector('#history-table');
if (!scrollDiv || !table)
return;
const tbody = table.querySelector('tbody');
if (!tbody)
return;
const rows = tbody.querySelectorAll('tr');
const rowCount = rows.length;
if (rowCount === 0) {
scrollDiv.style.maxHeight = '';
scrollDiv.style.overflowY = 'auto';
try {
tf_restoreHistoryTableScrollIfRequested(scrollDiv);
}
catch (e) { }
return;
}
if (rowCount <= 15) {
scrollDiv.style.maxHeight = '';
scrollDiv.style.overflowY = 'auto';
if (tf_restoreHistoryTableScrollIfRequested(scrollDiv))
return;
return;
}
const headerRow = table.querySelector('thead tr');
if (!headerRow)
return;
const headerRect = headerRow.getBoundingClientRect();
const fifteenthRow = rows[14];
const fifteenthRect = fifteenthRow.getBoundingClientRect();
if (!headerRect || !fifteenthRect)
return;
const top = headerRect.top;
const bottom = fifteenthRect.bottom;
const desiredHeight = Math.max(0, Math.ceil(bottom - top + 4));
scrollDiv.style.maxHeight = desiredHeight + 'px';
scrollDiv.style.overflowY = 'auto';
if (tf_restoreHistoryTableScrollIfRequested(scrollDiv))
return;
scrollDiv.scrollTop = scrollDiv.scrollHeight;
}
function setupEquityMetricSelector() {
loadEquityMetricPreference();
updateEquityCurveCopyForMetric();
const sel = document.getElementById('equity-metric-select');
if (!sel) {
return;
}
try {
sel.value = equityMetric;
}
catch (e) {
}
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
sel.addEventListener('change', function () {
const v = sel.value === 'usd' ? 'usd' : 'pips';
if (v === equityMetric)
return;
equityMetric = v;
saveEquityMetricPreference();
updateEquityCurveCopyForMetric();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
if (Array.isArray(lastHistoryRows)) {
updateEquityCurveFromRows(lastHistoryRows);
}
});
}
function setupRiskModeSelector() {
loadRiskModePreference();
loadCompoundMonthsPreference();
const riskSels = tf_getAllRiskModeSelects();
const compoundSels = tf_getAllCompoundMonthsSelects();
function syncRiskModeToAll() {
riskSels.forEach((s) => {
try {
if (s.value !== riskMode)
s.value = riskMode;
}
catch (e) { }
});
}
function syncCompoundMonthsToAll() {
compoundSels.forEach((s) => {
try {
if (s.value !== String(compoundMonths))
s.value = String(compoundMonths);
}
catch (e) { }
});
}
syncRiskModeToAll();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
tf_renderCompoundMonthsOptions(0);
syncCompoundMonthsToAll();
riskSels.forEach((sel) => {
sel.addEventListener('change', function () {
const v = (sel.value === 'compound') ? 'compound' : 'fixed';
if (v !== riskMode) {
riskMode = v;
saveRiskModePreference();
}
syncRiskModeToAll();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
recomputeHistoryRows();
updateMonthlyTableCells();
});
});
compoundSels.forEach((sel) => {
sel.addEventListener('change', function () {
const v = parseInt(sel.value, 10);
const next = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
if (next !== compoundMonths) {
compoundMonths = next;
saveCompoundMonthsPreference();
}
syncCompoundMonthsToAll();
if (riskMode === 'compound') {
recomputeHistoryRows();
updateMonthlyTableCells();
}
});
});
}
function tf_loadTradeTimeRangePreference() {
try {
const v = localStorage.getItem(TF_TRADE_RANGE_STORAGE_KEY);
if (!v)
return;
if (TF_TRADE_RANGE_OPTIONS.some((o) => o.key === v)) {
tfTradeTimeRangeKey = v;
}
}
catch (e) { }
}
function tf_saveTradeTimeRangePreference() {
try {
localStorage.setItem(TF_TRADE_RANGE_STORAGE_KEY, String(tfTradeTimeRangeKey || 'all'));
}
catch (e) { }
}
function tf_monthKeyToIndex(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo) || mo < 1 || mo > 12)
return null;
return (y * 12) + (mo - 1);
}
function tf_sortKeyToMonthIndex(sortKey) {
try {
const k = tf_monthKeyFromSortKey(sortKey);
return tf_monthKeyToIndex(k);
}
catch (e) {
return null;
}
}
function tf_getRangeOptByKey(key) {
const k = String(key || '').trim();
return TF_TRADE_RANGE_OPTIONS.find((o) => o.key === k) || TF_TRADE_RANGE_OPTIONS[0];
}
function tf_pickBestTradeRangeForMonthsAvailable(monthsAvail) {
const n = Number.isFinite(monthsAvail) ? monthsAvail : 0;
if (n <= 0)
return 'all';
for (let i = TF_TRADE_RANGE_OPTIONS.length - 1; i >= 0; i--) {
const opt = TF_TRADE_RANGE_OPTIONS[i];
if (!opt)
continue;
if (!opt.monthsBack || opt.monthsBack <= 0)
continue;
if (opt.monthsBack <= n)
return opt.key;
}
return 'm1';
}
function tf_syncTradeRangeButtonsUI() {
const ids = ['tf-time-range-buttons-equity', 'tf-time-range-buttons-history', 'tf-time-range-buttons-monthly', 'tf-time-range-buttons-perf'];
ids.forEach((id) => {
const cont = document.getElementById(id);
if (!cont)
return;
const btns = cont.querySelectorAll('button.tf-time-range-btn');
btns.forEach((b) => {
const k = b && b.dataset ? String(b.dataset.range || '') : '';
const isActive = (k && k === tfTradeTimeRangeKey);
try {
if (isActive)
b.classList.add('active');
else
b.classList.remove('active');
}
catch (e) { }
});
});
}
function tf_renderTradeRangeButtons(containerId) {
const cont = document.getElementById(containerId);
if (!cont)
return;
cont.innerHTML = '';
TF_TRADE_RANGE_OPTIONS.forEach((opt) => {
const b = document.createElement('button');
b.type = 'button';
b.className = 'tf-time-range-btn';
b.dataset.range = opt.key;
b.textContent = opt.label;
b.title = opt.title;
b.addEventListener('click', () => {
if (b.disabled)
return;
tf_setTradeTimeRange(opt.key);
});
cont.appendChild(b);
});
}
function tf_setTradeTimeRange(key) {
const next = tf_getRangeOptByKey(key).key;
if (next === tfTradeTimeRangeKey)
return;
tfTradeTimeRangeKey = next;
tf_saveTradeTimeRangePreference();
// REV295: changing timeframe always starts from the full viewport of that
// newly selected range; no double-click/double-tap recovery is required.
tf_markEquityCandleViewportForFullReset();
tf_syncTradeRangeButtonsUI();
try {
equityFilterStart = null;
}
catch (e) { }
try {
equityFilterEnd = null;
}
catch (e) { }
try {
equityHoverIndex = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
function tf_updateTradeRangeAvailabilityFromMonthSpan(minIdx, maxIdx) {
const minI = Number.isFinite(minIdx) ? minIdx : null;
const maxI = Number.isFinite(maxIdx) ? maxIdx : null;
const monthsAvail = (minI == null || maxI == null) ? 0 : Math.max(0, (maxI - minI + 1));
const ids = ['tf-time-range-buttons-equity', 'tf-time-range-buttons-history', 'tf-time-range-buttons-monthly', 'tf-time-range-buttons-perf'];
ids.forEach((id) => {
const cont = document.getElementById(id);
if (!cont)
return;
const btns = cont.querySelectorAll('button.tf-time-range-btn');
btns.forEach((b) => {
const k = b && b.dataset ? String(b.dataset.range || '') : '';
const opt = tf_getRangeOptByKey(k);
const disable = (opt.monthsBack && opt.monthsBack > 0) ? (monthsAvail < opt.monthsBack) : false;
try {
b.disabled = !!disable;
}
catch (e) { }
});
});
const curOpt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const curDisabled = (curOpt.monthsBack && curOpt.monthsBack > 0) ? (monthsAvail < curOpt.monthsBack) : false;
if (curDisabled) {
const fallback = tf_pickBestTradeRangeForMonthsAvailable(monthsAvail);
tfTradeTimeRangeKey = fallback;
tf_saveTradeTimeRangePreference();
}
tf_syncTradeRangeButtonsUI();
}
function tf_filterRowsByTradeTimeRange(rows, maxMonthIdx) {
const opt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const monthsBack = opt.monthsBack || 0;
if (!monthsBack || monthsBack <= 0)
return rows;
const endIdx = Number.isFinite(maxMonthIdx) ? maxMonthIdx : null;
if (endIdx == null)
return rows;
const startIdx = endIdx - (monthsBack - 1);
return (rows || []).filter((r) => {
const mi = tf_sortKeyToMonthIndex(tf_getPrimarySortKey(r));
if (mi == null)
return false;
return mi >= startIdx;
});
}
function setupTradeTimeRangeButtons() {
tf_loadTradeTimeRangePreference();
tf_renderTradeRangeButtons('tf-time-range-buttons-equity');
tf_renderTradeRangeButtons('tf-time-range-buttons-history');
tf_renderTradeRangeButtons('tf-time-range-buttons-monthly');
tf_renderTradeRangeButtons('tf-time-range-buttons-perf');
tf_syncTradeRangeButtonsUI();
}
function tf_isignalUsers_getPremiumPlanValue() {
return 'ISIGNAL USERS PREMIUM';
}
function tf_isignalUsers_getPremiumPrice() {
return 'Rp299.000';
}
let __tfISignalPremiumLockActive = false;
let __tfISignalPremiumPageUnlocked = false;
let __tfISignalPremiumExpiryTimer = null;
let __tfISignalPremiumWatcherStarted = false;
function tf_isignalUsers_accessStateFromStored(rawValue) {
const raw = rawValue && typeof rawValue === 'object' ? rawValue : {};
const known = raw.isignalUsersAccessKnown === true ||
typeof raw.isignalUsersAccess === 'boolean' ||
typeof raw.isignalUsersIncluded === 'boolean' ||
typeof raw.isignalUsersAddonRequired === 'boolean' ||
Boolean(raw.isignalUsersAccessReason);
const duration = String(raw.duration || '').trim().toUpperCase();
const includedByMainPlan = ['TRIAL (1 HARI)', '6 BULAN', '1 TAHUN', 'PERMANENT'].includes(duration);
const effectiveKnown = known || includedByMainPlan;
const included = raw.isignalUsersIncluded === true || includedByMainPlan;
const addonRequired = raw.isignalUsersAddonRequired === true;
const expiresAt = String(raw.isignalUsersExpiresAt || '');
let access = raw.valid === true && (raw.isignalUsersAccess === true || includedByMainPlan);
let reason = String(raw.isignalUsersAccessReason || '').trim().toUpperCase();
let remainingSeconds = Number.isFinite(Number(raw.isignalUsersRemainingSeconds))
? Math.max(0, Math.floor(Number(raw.isignalUsersRemainingSeconds)))
: null;
if (access && !included && expiresAt) {
const expiryMs = Date.parse(expiresAt);
const serverMs = Date.parse(String(raw.serverTime || ''));
const checkedAt = Number(raw.checkedAt || 0);
const estimatedNow = Number.isFinite(serverMs) && Number.isFinite(checkedAt) && checkedAt > 0
? serverMs + Math.max(0, Date.now() - checkedAt)
: Date.now();
if (Number.isFinite(expiryMs)) {
remainingSeconds = Math.max(0, Math.floor((expiryMs - estimatedNow) / 1000));
if (remainingSeconds <= 0) {
access = false;
reason = 'ADDON_EXPIRED';
}
}
}
return {
known: effectiveKnown,
access,
included,
addonRequired,
duration,
expiresAt,
remainingSeconds,
reason: access ? (reason || (included ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE')) : (reason || 'ACCESS_NOT_AVAILABLE'),
email: String(raw.email || '').trim().toLowerCase()
};
}
function tf_isignalUsers_schedulePremiumExpiry(accessState) {
try {
if (__tfISignalPremiumExpiryTimer)
clearTimeout(__tfISignalPremiumExpiryTimer);
}
catch (e) { }
__tfISignalPremiumExpiryTimer = null;
const state = accessState || {};
if (!state.access || state.included || !Number.isFinite(Number(state.remainingSeconds)))
return;
const delay = Math.max(0, Math.floor(Number(state.remainingSeconds)) * 1000);
__tfISignalPremiumExpiryTimer = setTimeout(() => {
if (__tfISignalPremiumLockActive)
return;
tf_isignalUsers_renderPremiumLock({
...state,
access: false,
remainingSeconds: 0,
reason: 'ADDON_EXPIRED'
});
}, Math.min(delay, 2147483647));
}
function tf_isignalUsers_startPremiumWatcher() {
if (__tfISignalPremiumWatcherStarted)
return;
__tfISignalPremiumWatcherStarted = true;
try {
chrome.storage.onChanged.addListener((changes, areaName) => {
if (areaName !== 'local' || !changes || !changes.tfLicenseState)
return;
const state = tf_isignalUsers_accessStateFromStored(changes.tfLicenseState.newValue || {});
if (state.access) {
if (__tfISignalPremiumLockActive) {
setTimeout(() => location.reload(), 100);
return;
}
tf_isignalUsers_schedulePremiumExpiry(state);
return;
}
if (__tfISignalPremiumPageUnlocked && !__tfISignalPremiumLockActive) {
tf_isignalUsers_renderPremiumLock(state);
}
});
}
catch (e) { }
}
function tf_isignalUsers_openUpgradePlan(accessState) {
const state = accessState || {};
const planValue = tf_isignalUsers_getPremiumPlanValue(state.duration);
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
if (state.email)
subscribeUrl.searchParams.set('email', String(state.email));
subscribeUrl.searchParams.set('plan', planValue);
if (state.duration)
subscribeUrl.searchParams.set('currentPlan', String(state.duration));
subscribeUrl.searchParams.set('feature', 'isignal-users');
try {
chrome.tabs.create({ url: subscribeUrl.toString(), active: true });
}
catch (error) {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
}
function tf_isignalUsers_renderPremiumLock(accessState) {
if (__tfISignalPremiumLockActive || document.getElementById('tf-isignal-premium-lock'))
return;
const state = accessState || {};
const duration = String(state.duration || '').trim().toUpperCase();
if (duration === 'PERMANENT')
return;
__tfISignalPremiumLockActive = true;
const reason = String(state.reason || '').trim().toUpperCase();
const price = tf_isignalUsers_getPremiumPrice(duration);
let explanation = 'Paket Anda belum menyertakan akses ke fitur iSignal Users.';
if (duration === '1 BULAN' || duration === '3 BULAN') {
explanation = `Paket ${duration} memerlukan add-on iSignal Users. Pilih akses 1 Hari Rp50.000 atau Premium Rp299.000 yang mengikuti sisa masa paket utama.`;
}
if (reason === 'ADDON_EXPIRED') {
explanation = 'Masa aktif add-on iSignal Users telah berakhir. Silakan perpanjang add-on untuk mengaktifkan fitur ini kembali.';
}
else if (reason === 'ADDON_NOT_PURCHASED') {
explanation = `Paket ${duration || 'Anda'} belum memiliki add-on iSignal Users.`;
}
else if (!state.known) {
explanation = 'Status akses premium belum dapat diverifikasi. Sambungkan internet, lalu klik hyperlink Refresh pada sidebar plugin.';
}
const style = document.createElement('style');
style.id = 'tf-isignal-premium-lock-style';
style.textContent = `
html, body { min-height: 100%; }
body.tf-isignal-premium-locked { overflow: hidden !important; }
#tf-isignal-premium-lock {
position: fixed;
inset: 0;
z-index: 2147483000;
display: flex;
align-items: center;
justify-content: center;
padding: 21.6px;
background:
radial-gradient(circle at 18% 12%, rgba(56,189,248,.14), transparent 34%),
radial-gradient(circle at 86% 18%, rgba(34,197,94,.11), transparent 30%),
#020617;
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
color: #f8fafc;
}
#tf-isignal-premium-lock * { box-sizing: border-box; }
.tf-isignal-premium-card {
width: min(468px, 100%);
padding: 25.2px;
border: 1px solid rgba(148,163,184,.28);
border-radius: 18px;
background: rgba(15,23,42,.96);
box-shadow: 0 28px 80px rgba(0,0,0,.48);
text-align: center;
}
.tf-isignal-premium-badge {
display: inline-flex;
padding: 5.4px 9px;
border: 1px solid rgba(250,204,21,.35);
border-radius: 899.1px;
color: #fde047;
background: rgba(250,204,21,.08);
font-size: 9.9px;
font-weight: 900;
letter-spacing: .06em;
text-transform: uppercase;
}
.tf-isignal-premium-card h1 {
margin: 14.4px 0 8.1px;
font-size: 22.5px;
line-height: 1.2;
}
.tf-isignal-premium-card p {
margin: 0;
color: #aeb8c8;
font-size: 11.7px;
line-height: 1.65;
}
.tf-isignal-premium-plan {
margin: 16.2px 0;
padding: 11.7px 13.5px;
border: 1px solid rgba(56,189,248,.24);
border-radius: 10.8px;
background: rgba(56,189,248,.07);
color: #e0f2fe;
font-size: 10.8px;
line-height: 1.55;
}
.tf-isignal-premium-actions {
display: flex;
flex-direction: column;
gap: 8.1px;
margin-top: 16.2px;
}
.tf-isignal-premium-primary,
.tf-isignal-premium-secondary {
width: 100%;
min-height: 39.6px;
padding: 9px 12.6px;
border-radius: 9px;
cursor: pointer;
font-size: 11.7px;
font-weight: 850;
}
.tf-isignal-premium-primary {
border: 0;
background: #22c55e;
color: #052e16;
}
.tf-isignal-premium-secondary {
border: 1px solid #334155;
background: #020617;
color: #cbd5e1;
}
.tf-isignal-premium-note {
margin-top: 11.7px !important;
color: #64748b !important;
font-size: 9px !important;
}
`;
document.head.appendChild(style);
const root = document.createElement('div');
root.id = 'tf-isignal-premium-lock';
root.innerHTML = `
<section class="tf-isignal-premium-card" role="dialog" aria-modal="true" aria-labelledby="tf-isignal-premium-title">
<div class="tf-isignal-premium-badge">Fitur Premium</div>
<h1 id="tf-isignal-premium-title">iSignal Users</h1>
<p>${explanation}</p>
<div class="tf-isignal-premium-plan">
Paket utama: <strong>${duration || '-'}</strong><br>
${duration === '1 BULAN' || duration === '3 BULAN'
? `Pilihan add-on: <strong>1 Hari — Rp50.000</strong><br><strong>Premium — ${price}</strong> (mengikuti sisa paket utama)`
: 'Silakan pilih paket atau add-on yang sesuai.'}
</div>
<div class="tf-isignal-premium-actions">
<button type="button" class="tf-isignal-premium-primary" id="tf-isignal-premium-upgrade">Upgrade Plan / Check Status</button>
<button type="button" class="tf-isignal-premium-secondary" id="tf-isignal-premium-back">Kembali ke Dashboard</button>
</div>
<p class="tf-isignal-premium-note">Setelah add-on diaktifkan oleh admin, buka sidebar plugin lalu klik hyperlink Refresh.</p>
</section>
`;
document.body.classList.add('tf-isignal-premium-locked');
document.body.appendChild(root);
root.querySelector('#tf-isignal-premium-upgrade')?.addEventListener('click', () => {
tf_isignalUsers_openUpgradePlan(state);
});
root.querySelector('#tf-isignal-premium-back')?.addEventListener('click', () => {
window.location.href = chrome.runtime.getURL('dashboard.html');
});
}
async function tf_isignalUsers_requirePremiumAccess() {
let state = typeof window.tfGetISignalUsersAccessState === 'function'
? window.tfGetISignalUsersAccessState()
: null;
if (!state || state.known !== true) {
try {
if (typeof window.tfRefreshLicenseStatus === 'function') {
await window.tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: true
});
}
}
catch (e) { }
state = typeof window.tfGetISignalUsersAccessState === 'function'
? window.tfGetISignalUsersAccessState()
: state;
}
if (state && state.access === true)
return true;
tf_isignalUsers_renderPremiumLock(state || { known: false });
return false;
}
document.addEventListener('DOMContentLoaded', async () => {
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
const __tfEarlyPageMode = (document.body && (document.body.getAttribute('data-page') || (document.body.dataset ? document.body.dataset.page : ''))) || '';
if (__tfEarlyPageMode === 'isignal-users') {
tf_isignalUsers_startPremiumWatcher();
const __tfPremiumAllowed = await tf_isignalUsers_requirePremiumAccess();
if (!__tfPremiumAllowed)
return;
__tfISignalPremiumPageUnlocked = true;
try {
if (typeof window.tfGetISignalUsersAccessState === 'function') {
tf_isignalUsers_schedulePremiumExpiry(window.tfGetISignalUsersAccessState());
}
}
catch (e) { }
}
try {
const logoLink = document.getElementById('tfInvestingProLogoLink') || document.querySelector('a.fxLogoLink');
if (logoLink) {
logoLink.addEventListener('click', () => {
try {
if (typeof window.trackInvestingProTopMenuLogoClick === 'function') {
window.trackInvestingProTopMenuLogoClick();
}
}
catch (e) { }
});
}
}
catch (e) { }
function tf_openNavLinkActiveTab(rawUrl) {
try {
if (rawUrl == null)
return;
let url = String(rawUrl).trim();
if (!url || url === '#' || url === 'javascript:void(0)' || url === 'javascript:void(0);')
return;
const isHttp = /^https?:\/\//i.test(url);
const isChromeExt = /^chrome-extension:\/\//i.test(url);
if (!isHttp && !isChromeExt) {
try {
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
url = chrome.runtime.getURL(url.replace(/^\//, ''));
}
}
catch (e) { }
try {
window.location.href = url;
}
catch (e) {
try {
location.assign(url);
}
catch (x) { }
}
return;
}
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: true });
}
else {
window.open(url, '_blank', 'noopener');
}
}
catch (e) {
try {
const u = String(rawUrl);
if (u && u !== '#')
window.open(u, '_blank', 'noopener');
}
catch (x) { }
}
}
function tf_initTopNavigatorMenu() {
try {
const links = document.querySelectorAll('a[data-tf-url]');
links.forEach(a => {
a.addEventListener('click', (e) => {
try {
if (e.button !== 0)
return;
if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
return;
}
catch (x) { }
try {
if ((a.getAttribute('data-tf-parent') || '') === '1') {
e.preventDefault();
const li = a.closest('.tf-dropdown');
if (li) {
const wasOpen = li.classList.contains('open');
document.querySelectorAll('.tf-top-nav .tf-dropdown.open').forEach(x => { if (x !== li)
x.classList.remove('open'); });
if (wasOpen)
li.classList.remove('open');
else
li.classList.add('open');
}
return;
}
}
catch (x) { }
try {
e.preventDefault();
}
catch (x) { }
const url = a.getAttribute('data-tf-url') || a.getAttribute('href');
tf_openNavLinkActiveTab(url);
});
});
const dropdowns = document.querySelectorAll('.tf-top-nav .tf-dropdown');
dropdowns.forEach(li => {
const mainA = li.querySelector(':scope > a');
if (!mainA)
return;
mainA.addEventListener('touchstart', (e) => {
try {
if (!li.classList.contains('open')) {
e.preventDefault();
dropdowns.forEach(x => x !== li && x.classList.remove('open'));
li.classList.add('open');
}
}
catch (x) { }
}, { passive: false });
});
document.addEventListener('click', (e) => {
try {
const nav = document.getElementById('tf-top-nav-wrap');
if (!nav)
return;
if (nav.contains(e.target))
return;
document.querySelectorAll('.tf-top-nav .tf-dropdown.open').forEach(x => x.classList.remove('open'));
}
catch (x) { }
});
}
catch (e) { }
}
try {
tf_initTopNavigatorMenu();
}
catch (e) { }
const __tfPageMode = (document.body && (document.body.getAttribute('data-page') || (document.body.dataset ? document.body.dataset.page : ''))) || '';
const __tfIsUsersPage = (__tfPageMode === 'isignal-users');
if (__tfIsUsersPage) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
window.tf_isignalUsers_initPage = tf_isignalUsers_initPage;
document.documentElement.dataset.tfISignalUsersInit = 'running';
await tf_isignalUsers_initPage();
document.documentElement.dataset.tfISignalUsersInit = 'done';
}
catch (e) {
try { document.documentElement.dataset.tfISignalUsersInit = 'error'; } catch (x) { }
console.error('TF iSignal Users init failed:', e);
try {
const errBox = document.getElementById('tf-users-mgmt-error');
if (errBox) {
errBox.textContent = 'iSignal Users gagal dimuat: ' + String(e && e.message ? e.message : e);
errBox.style.display = 'block';
}
}
catch (x) { }
}
return;
}
try {
const refreshLink = document.getElementById('tf-refresh-price-link');
if (refreshLink) {
refreshLink.addEventListener('click', (e) => {
try {
e.preventDefault();
}
catch (x) { }
try {
tf_refreshMyfxbookPricesForce();
}
catch (x) { }
});
}
}
catch (e) { }
try {
tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
chrome.storage.onChanged.addListener(async (changes, area) => {
if (area !== 'local')
return;
if (!changes)
return;
if (changes[TF_MYFXBOOK_PRICES_KEY] || changes[TF_MYFXBOOK_PRICES_AT_KEY]) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
if (!__tfDashboardMainReady) {
if (typeof tf_isInvestingPriceReadyNow === 'function' && tf_isInvestingPriceReadyNow()) {
try {
tf_initDashboardMainAfterPrice();
}
catch (e) { }
}
return;
}
}
catch (e) { }
if (tfMyfxbookRefreshInProgress)
return;
try {
await tf_schedulePriceDependentUiRefresh(35);
}
catch (e) { }
}
});
}
catch (e) { }
try {
initDashboardScanOverlay();
}
catch (e) { }
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
let __tfDashboardMainReady = false;
function tf_isInvestingPriceReadyNow() {
try {
if (tf_isMyfxbookPriceLoading())
return false;
const pm = tfMyfxbookPriceMapLatest;
if (!pm || typeof pm !== 'object')
return false;
const ks = Object.keys(pm);
if (!ks.length)
return false;
for (let i = 0; i < ks.length; i++) {
const v = pm[ks[i]];
if (v != null && String(v).trim() !== '')
return true;
}
return false;
}
catch (e) {
return false;
}
}
function tf_setWaitPriceMode(on) {
try {
if (!document.body)
return;
if (on)
document.body.classList.add('tf-wait-price');
else
document.body.classList.remove('tf-wait-price');
}
catch (e) { }
}
function tf_initDashboardMainAfterPrice() {
try {
if (__tfDashboardMainReady)
return;
__tfDashboardMainReady = true;
tf_setWaitPriceMode(false);
buildMonthlyTableSkeleton();
setupAnalystTickerFilter();
setupHistoryColumnFilter();
setupBalanceAndRiskControls();
setupHistoryForm();
setupHistoryPdfExportButton();
setupEquityCurveInteractions();
setupEquityChartModeSelector();
setupEquityMetricSelector();
setupRiskModeSelector();
setupTradeTimeRangeButtons();
const equityApplyBtn = document.getElementById('equity-apply-filter-btn');
if (equityApplyBtn) {
equityApplyBtn.addEventListener('click', applyEquityDateFilterFromInputs);
}
const equityResetBtn = document.getElementById('equity-reset-filter-btn');
if (equityResetBtn) {
equityResetBtn.addEventListener('click', resetEquityDateFilterToFullRange);
}
const historyApplyBtn = document.getElementById('history-apply-filter-btn');
if (historyApplyBtn) {
historyApplyBtn.addEventListener('click', applyHistoryDateFilterFromInputs);
}
const historyResetBtn = document.getElementById('history-reset-filter-btn');
if (historyResetBtn) {
historyResetBtn.addEventListener('click', resetHistoryDateFilterToFullRange);
}
const historyAllCb = document.getElementById('history-all-checkbox');
if (historyAllCb) {
historyAllCb.addEventListener('change', () => {
tf_captureHistoryTableScrollForRestore();
const desired = !!historyAllCb.checked;
try {
const ids = Array.isArray(tf_lastEligibleHistoryRowIds) ? tf_lastEligibleHistoryRowIds : [];
for (let i = 0; i < ids.length; i++) {
tf_setHistoryRowEnabled(ids[i], desired);
}
}
catch (e) { }
recomputeHistoryRows();
});
}
renderSummaryTable();
recomputeHistoryRows();
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
loadFromChromeStorageIfAvailable();
}
catch (e) {
try {
tf_setWaitPriceMode(false);
}
catch (x) { }
try {
__tfDashboardMainReady = true;
}
catch (x) { }
try {
loadFromChromeStorageIfAvailable();
}
catch (x) { }
}
}
async function tf_waitForPriceThenInitMain() {
try {
if (__tfDashboardMainReady)
return;
tf_setWaitPriceMode(true);
const start = Date.now();
const maxMs = 60000;
while (Date.now() - start < maxMs) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
if (tf_isInvestingPriceReadyNow())
break;
await new Promise((r) => setTimeout(r, 250));
}
tf_initDashboardMainAfterPrice();
}
catch (e) {
try {
tf_initDashboardMainAfterPrice();
}
catch (x) { }
}
}
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table thead th');
if (!ths || ths.length !== 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 10)
return;
for (let i = 0; i < 10; i++) {
const w = ths[i] ? Math.round(ths[i].getBoundingClientRect().width) : 0;
if (w && w > 0)
cols[i].style.width = w + 'px';
}
}
catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table';
const cg = document.createElement('colgroup');
['4%', '16%', '12%', '8%', '10%', '12%', '12%', '8%', '10%', '12%'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);
tf_applyDrawdownDetailColWidthsPx(tbl);
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const tdArrowBlank = document.createElement('td');
tdArrowBlank.textContent = '';
tr.appendChild(tdArrowBlank);
const tdNameBlank = document.createElement('td');
tdNameBlank.textContent = '';
tr.appendChild(tdNameBlank);
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
const tdPTrades = document.createElement('td');
tdPTrades.className = 'mono tp';
tdPTrades.textContent = showP ? String(k) : '';
tr.appendChild(tdPTrades);
const tdPCount = document.createElement('td');
tdPCount.className = 'mono tp';
tdPCount.textContent = showP ? String(pCount) : '';
tr.appendChild(tdPCount);
const tdPPips = document.createElement('td');
tdPPips.className = 'mono tp';
tdPPips.textContent = showP ? formatNumber((pRun && (pRun.bestPips || 0)) || 0, 1) : '';
tr.appendChild(tdPPips);
const tdPDollar = document.createElement('td');
tdPDollar.className = 'mono tp';
tdPDollar.innerHTML = showP ? (priceBusy ? tf_spinnerHTML(true) : formatMoney((pRun && (pRun.bestDollar || 0)) || 0)) : '';
tr.appendChild(tdPDollar);
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) {
continue;
}
const tdLTrades = document.createElement('td');
tdLTrades.className = 'mono sl';
tdLTrades.textContent = showL ? String(k) : '';
tr.appendChild(tdLTrades);
const tdLCount = document.createElement('td');
tdLCount.className = 'mono sl';
tdLCount.textContent = showL ? String(lCount) : '';
tr.appendChild(tdLCount);
const tdLPips = document.createElement('td');
tdLPips.className = 'mono sl';
tdLPips.textContent = showL ? formatNumber((lRun && (lRun.bestPips || 0)) || 0, 1) : '';
tr.appendChild(tdLPips);
const tdLDollar = document.createElement('td');
tdLDollar.className = 'mono sl';
tdLDollar.innerHTML = showL ? (priceBusy ? tf_spinnerHTML(true) : formatMoney((lRun && (lRun.bestDollar || 0)) || 0)) : '';
tr.appendChild(tdLDollar);
tbl.appendChild(tr);
}
wrap.appendChild(tbl);
return wrap;
}
function tf_bindDrawdownDetailsHandler() {
if (__tfDrawdownDetailsBound)
return;
const tbody = document.querySelector('#drawdown-table tbody');
if (!tbody)
return;
tbody.addEventListener('click', (ev) => {
try {
let t = ev && ev.target ? ev.target : null;
try {
if (t && t.nodeType === 3)
t = t.parentElement;
}
catch (e) { }
const cell = t && t.closest ? t.closest('td.dd-details-control') : null;
if (!cell)
return;
const tr = cell.parentElement;
if (!tr)
return;
const next = tr.nextElementSibling;
if (next && next.classList && next.classList.contains('dd-child-row')) {
try {
next.remove();
}
catch (e) {
try {
next.parentNode.removeChild(next);
}
catch (e2) { }
}
try {
tr.classList.remove('dd-open');
}
catch (e) { }
try {
cell.textContent = '▶';
}
catch (e) { }
return;
}
const analyst = tr.dataset ? tr.dataset.analyst : '';
const map = (typeof window !== 'undefined' && window.__tfDrawdownDetailByAnalyst) ? window.__tfDrawdownDetailByAnalyst : {};
const st = map && analyst ? map[analyst] : null;
const childTr = document.createElement('tr');
childTr.className = 'dd-child-row';
const td = document.createElement('td');
td.colSpan = 10;
td.appendChild(tf_buildDrawdownDetailElement(st || {}));
childTr.appendChild(td);
if (tr.parentNode) {
tr.parentNode.insertBefore(childTr, tr.nextSibling);
}
try {
tr.classList.add('dd-open');
}
catch (e) { }
try {
cell.textContent = '▼';
}
catch (e) { }
}
catch (e) { }
});
__tfDrawdownDetailsBound = true;
}
function tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity) {
try {
if (typeof equityMetric !== 'undefined' && equityMetric !== 'usd')
return ddBaseEquity;
let startBal = null;
if (typeof riskMode !== 'undefined' && riskMode === 'compound') {
const mk = ddPeakPoint && (ddPeakPoint.sortKey != null) ? tf_monthKeyFromSortKey(ddPeakPoint.sortKey) : null;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (mk && Array.isArray(srcRows) && srcRows.length) {
const sk = ddPeakPoint ? ddPeakPoint.sortKey : null;
const a = ddPeakPoint && ddPeakPoint.analyst ? String(ddPeakPoint.analyst) : '';
const p = ddPeakPoint && ddPeakPoint.pair ? String(ddPeakPoint.pair) : '';
if (sk != null) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
if (r.sortKey === sk &&
String(r.analyst || '') === a &&
String(r.pair || '') === p &&
Number.isFinite(r.balanceCompound) &&
r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
const rmk = tf_monthKeyFromSortKey(r.sortKey);
if (rmk === mk && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
if (typeof currentBalance !== 'undefined' && Number.isFinite(currentBalance) && currentBalance > 0) {
startBal = currentBalance;
}
}
}
else {
if (typeof currentBalance !== 'undefined' && Number.isFinite(currentBalance) && currentBalance > 0) {
startBal = currentBalance;
}
}
if (!(Number.isFinite(startBal) && startBal > 0))
startBal = ddBaseEquity;
return (Number.isFinite(startBal) ? startBal : ddBaseEquity);
}
catch (e) {
return ddBaseEquity;
}
}
const TF_ISIGNAL_USERS_MGMT_KEY = 'tfIsignalUsersMgmt_v1';
function tf_storageLocalSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
function tf_isFiniteNumber(v) {
return Number.isFinite(v) && !Number.isNaN(v);
}
function tf_safeNumber(v) {
const n = typeof v === 'number' ? v : safeParseFloat(v);
return tf_isFiniteNumber(n) ? n : null;
}
function tf_isignalUsers_parseDecimal(v) {
try {
const raw = String(v == null ? '' : v).trim().replace(/\s+/g, '').replace(',', '.');
if (!raw) return null;
const n = Number(raw);
return Number.isFinite(n) ? n : null;
}
catch (e) { return null; }
}
function tf_isignalUsers_formatRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2).replace('.', ',') : '';
}
function tf_isignalUsers_roundRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? (Math.round(n * 100) / 100) : null;
}
function tf_isignalUsers_formatNumberInput(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2) : '';
}
function tf_isignalUsers_calcActualRiskPercent(balance, lot, sl, dollarPerPip) {
const b = tf_isignalUsers_parseDecimal(balance);
const l = tf_isignalUsers_parseDecimal(lot);
const s = tf_isignalUsers_parseDecimal(sl);
const dpp = tf_isignalUsers_parseDecimal(dollarPerPip);
if (!(b != null && b > 0 && l != null && l > 0 && s != null && s > 0 && dpp != null && dpp > 0)) return null;
return tf_isignalUsers_roundRiskPercent(((l * s * dpp) / b) * 100);
}
function tf_isignalUsers_sendMessage(msg) {
return new Promise((resolve) => {
try {
chrome.runtime.sendMessage(msg, (resp) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(resp || null);
});
}
catch (e) {
resolve(null);
}
});
}
let __tfUsersMgmtSaveTimer = null;
function tf_isignalUsers_scheduleSave(cfg) {
try {
if (__tfUsersMgmtSaveTimer)
clearTimeout(__tfUsersMgmtSaveTimer);
}
catch (e) { }
__tfUsersMgmtSaveTimer = setTimeout(() => {
try {
tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfg });
}
catch (e) { }
}, 350);
}
async function tf_isignalUsers_fetchPlatformIds() {
const resp = await tf_isignalUsers_sendMessage({
type: 'tf_fetch_broker_platform_ids',
url: 'https://account.tradersfamily.id/profile/u/155921/?tab=settings'
});
return resp || { ok: false, error: 'No response' };
}
const TF_ISIGNAL_CHANNELS_URL = 'https://account.tradersfamily.id/channels/isignal/';
const __tfIsUsersVerifyState = {
state: 'idle',
map: {},
channels: [],
fetchedAt: 0,
error: ''
};
function tf_isignalUsers_normName(s) {
return String(s || '').trim().toLowerCase();
}
function tf_isignalUsers_truncAnalyst10(nameRaw) {
const t = String(nameRaw || '').trim();
if (!t)
return '';
return (t.length > 10) ? (t.slice(0, 10) + '...') : t;
}
function tf_isignalUsers_buildActiveMap(channels) {
const map = {};
try {
(channels || []).forEach((ch) => {
const name = ch && ch.name ? String(ch.name).trim() : '';
const id = ch && ch.isignalId ? String(ch.isignalId).trim() : '';
const status = ch && ch.statusText ? String(ch.statusText).trim() : '';
const subEndOn = ch && ch.subscriptionEndOn ? String(ch.subscriptionEndOn).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || map[k])
return;
map[k] = { id: id || '', status: status || '', subEndOn: subEndOn || '' };
});
}
catch (e) { }
return map;
}
function tf_isignalUsers_getIsignalInfoByName(name) {
const k = tf_isignalUsers_normName(name);
return (k && __tfIsUsersVerifyState.map && __tfIsUsersVerifyState.map[k]) ? __tfIsUsersVerifyState.map[k] : null;
}
const __tfUsersVerifyOkSvg = `
<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M15.1314 3.78317C16.572 1.88333 19.428 1.88333 20.8686 3.78317L21.5493 4.68092C22.3353 5.71754 23.6195 6.24944 24.9083 6.07224L26.0244 5.91878C28.3864 5.59402 30.406 7.61357 30.0812 9.97559L29.9278 11.0917C29.7506 12.3805 30.2825 13.6647 31.3191 14.4507L32.2168 15.1314C34.1167 16.572 34.1167 19.428 32.2168 20.8686L31.3191 21.5493C30.2825 22.3353 29.7506 23.6195 29.9278 24.9083L30.0812 26.0244C30.406 28.3864 28.3864 30.406 26.0244 30.0812L24.9083 29.9278C23.6195 29.7506 22.3353 30.2825 21.5493 31.3191L20.8686 32.2168C19.428 34.1167 16.572 34.1167 15.1314 32.2168L14.4507 31.3191C13.6647 30.2825 12.3805 29.7506 11.0917 29.9278L9.97559 30.0812C7.61357 30.406 5.59402 28.3864 5.91878 26.0244L6.07224 24.9083C6.24944 23.6195 5.71754 22.3353 4.68092 21.5493L3.78317 20.8686C1.88333 19.428 1.88333 16.572 3.78317 15.1314L4.68092 14.4507C5.71754 13.6647 6.24944 12.3805 6.07224 11.0917L5.91878 9.9756C5.59402 7.61358 7.61357 5.59402 9.97559 5.91878L11.0917 6.07224C12.3805 6.24944 13.6647 5.71754 14.4507 4.68092L15.1314 3.78317Z" fill="#00B451"></path>
<path d="M24.624 14.0039L16.596 21.9959L11.772 17.1359" stroke="#FCFCFC" stroke-width="2.7" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;
const __tfUsersVerifyBadSvg = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<circle cx="12" cy="12" r="10" fill="#EF4444"></circle>
<path d="M8 8l8 8M16 8l-8 8" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"></path>
</svg>`;
function tf_isignalUsers_getIsignalIdByName(name) {
const info = tf_isignalUsers_getIsignalInfoByName(name);
return info && info.id ? String(info.id) : '';
}
function tf_isignalUsers_getIsignalStatusByName(name) {
const info = tf_isignalUsers_getIsignalInfoByName(name);
return info && info.status ? String(info.status) : '';
}
function tf_isignalUsers_getIsignalSubscriptionEndOnByName(name) {
if (!name)
return '';
const k = tf_isignalUsers_normName(name);
if (!k)
return '';
const info = (__tfIsUsersVerifyState.map && __tfIsUsersVerifyState.map[k]) ? __tfIsUsersVerifyState.map[k] : null;
return info && info.subEndOn ? String(info.subEndOn).trim() : '';
}
function tf_isignalUsers_applyIsignalSubscriptionEndOn(el, nameRaw, mapState) {
if (!el)
return;
const name = String(nameRaw || '').trim();
const v = tf_isignalUsers_getIsignalSubscriptionEndOnByName(name, mapState);
const isPerAnalystLoading = (() => {
try {
if (el.classList && el.classList.contains('tf-isusers-sub-loading'))
return true;
const st = window.__tfIsUsersVerifyState;
const arr = st && Array.isArray(st.channels) ? st.channels : [];
const key = tf_isignalUsers_normName(name);
for (const c of arr) {
if (!c)
continue;
const nm = tf_isignalUsers_normName(c.name || c.baseName || '');
if (nm === key)
return !!c.subscriptionLoading;
}
}
catch (e) { }
return false;
})();
if (v) {
el.classList.remove('tf-isusers-sub-loading');
tf_applySubscription412(el, v);
return;
}
const state = (mapState && mapState.state) ? String(mapState.state) : '';
if (isPerAnalystLoading || state === 'loading') {
el.classList.add('tf-isusers-sub-loading');
el.innerHTML = tf_spinnerHTML(true);
return;
}
el.classList.remove('tf-isusers-sub-loading');
el.textContent = '—';
}
function tf_isignalUsers_getIsignalUrlByName(name) {
const id = tf_isignalUsers_getIsignalIdByName(name);
return id ? (`https://account.tradersfamily.id/channels/isignal/${id}`) : TF_ISIGNAL_CHANNELS_URL;
}
function tf_isignalUsers_applyVerifyBadge(badgeEl, analystName) {
if (!badgeEl)
return;
const name = String(analystName || '').trim();
const state = __tfIsUsersVerifyState.state || 'idle';
badgeEl.classList.remove('tf-users-verify-loading', 'tf-users-verify-ok', 'tf-users-verify-bad');
badgeEl.innerHTML = '';
badgeEl.removeAttribute('data-isignal-id');
if (state === 'loading' || state === 'idle') {
badgeEl.classList.add('tf-users-verify-loading');
badgeEl.title = 'Mencocokkan analis iSignal...';
return;
}
const id = tf_isignalUsers_getIsignalIdByName(name);
const status = tf_isignalUsers_getIsignalStatusByName(name);
if (state === 'done') {
if (id && String(status).trim().toLowerCase() === 'aktif') {
badgeEl.classList.add('tf-users-verify-ok');
badgeEl.innerHTML = __tfUsersVerifyOkSvg;
badgeEl.setAttribute('data-isignal-id', id);
badgeEl.title = 'Aktif (verified)';
}
else {
badgeEl.classList.add('tf-users-verify-bad');
badgeEl.innerHTML = __tfUsersVerifyBadSvg;
if (!id && !status) {
badgeEl.title = 'Tidak ditemukan di iSignal';
}
else if (!id && status) {
badgeEl.title = `${status} (id tidak ditemukan)`;
}
else {
badgeEl.title = status ? String(status) : 'Tidak aktif / belum diaktifkan';
}
}
return;
}
badgeEl.classList.add('tf-users-verify-bad');
badgeEl.innerHTML = __tfUsersVerifyBadSvg;
badgeEl.title = 'Gagal scan iSignal';
}
function tf_isignalUsers_applySetBadge(badgeEl, spinnerEl, cfg, platformId, analystName) {
try {
if (!badgeEl)
return;
const pid = String(platformId || '');
const aName = String(analystName || '');
const st = (cfg && cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) ? cfg.usersSetStatus[pid][aName] : null;
const status = st && st.status ? st.status : 'idle';
const reason = st && st.reason ? String(st.reason) : '';
badgeEl.classList.remove('tf-users-set-badge-idle', 'tf-users-set-badge-running', 'tf-users-set-badge-ok', 'tf-users-set-badge-fail', 'tf-users-set-badge-cooldown');
if (status === 'running')
badgeEl.classList.add('tf-users-set-badge-running');
else if (status === 'ok')
badgeEl.classList.add('tf-users-set-badge-ok');
else if (status === 'fail')
badgeEl.classList.add('tf-users-set-badge-fail');
else if (status === 'cooldown')
badgeEl.classList.add('tf-users-set-badge-cooldown');
else
badgeEl.classList.add('tf-users-set-badge-idle');
badgeEl.title =
reason ? reason :
(status === 'ok' ? 'Set berhasil' :
status === 'fail' ? 'Set gagal' :
status === 'running' ? 'Sedang proses...' :
status === 'cooldown' ? 'Cooldown 5 menit...' : '');
if (spinnerEl) {
const isRunning = (status === 'running');
spinnerEl.style.display = isRunning ? 'inline-flex' : 'none';
badgeEl.style.display = isRunning ? 'none' : 'inline-flex';
}
if (status === 'ok') {
badgeEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7.629 13.233 4.34 9.944l-1.06 1.06 4.35 4.35L17.72 5.263l-1.06-1.06z"/></svg>';
}
else if (status === 'fail') {
badgeEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M11.414 10l4.95-4.95-1.414-1.414L10 8.586 5.05 3.636 3.636 5.05 8.586 10l-4.95 4.95 1.414 1.414L10 11.414l4.95 4.95 1.414-1.414z"/></svg>';
}
else if (status === 'cooldown') {
const until = st && (st.cooldownUntil || st.until) ? Number(st.cooldownUntil || st.until) : null;
const totalMs = st && st.cooldownTotalMs ? Number(st.cooldownTotalMs) : (5 * 60 * 1000);
const end = (until && Number.isFinite(until)) ? until : (Date.now() + (5 * 60 * 1000));
badgeEl.textContent = tf_isignalUsers_formatMMSS(Math.ceil(Math.max(0, end - Date.now()) / 1000));
badgeEl.setAttribute('data-end-at', String(end));
badgeEl.setAttribute('data-total-ms', String(totalMs));
try {
tf_isignalUsers_ensureCooldownTicker();
}
catch (e) { }
}
else {
badgeEl.innerHTML = '';
}
}
catch (e) { }
}
function tf_isignalUsers_formatMMSS(totalSeconds) {
const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
const m = Math.floor(s / 60);
const r = s % 60;
return `${m}:${String(r).padStart(2, '0')}`;
}
function tf_isignalUsers_migrateLegacyCooldownStatus(cfg) {
try {
if (!cfg || typeof cfg !== 'object')
return false;
if (!cfg.usersSetStatus || typeof cfg.usersSetStatus !== 'object')
return false;
let changed = false;
const now = Date.now();
if (!cfg.usersSetCooldown || typeof cfg.usersSetCooldown !== 'object')
cfg.usersSetCooldown = {};
Object.keys(cfg.usersSetStatus || {}).forEach((pid) => {
const mp = cfg.usersSetStatus[pid];
if (!mp || typeof mp !== 'object')
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
if (!st || st.status !== 'cooldown')
return;
const until = Number(st.cooldownUntil || st.until);
const totalMs = Number(st.cooldownTotalMs || st.totalMs || (5 * 60 * 1000));
if (!cfg.usersSetCooldown[pid] || typeof cfg.usersSetCooldown[pid] !== 'object')
cfg.usersSetCooldown[pid] = {};
if (Number.isFinite(until) && until > now) {
cfg.usersSetCooldown[pid][aName] = {
until,
totalMs,
reason: st.reason ? String(st.reason) : 'Cooldown 5 menit',
updatedAt: now
};
}
mp[aName] = { status: 'fail', reason: st.reason ? String(st.reason) : 'Cooldown 5 menit', updatedAt: now };
changed = true;
});
});
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
}
return changed;
}
catch (e) {
return false;
}
}
function tf_isignalUsers_refreshSetCountdownUI(platformId, analystName, cfgOverride) {
try {
const cfg = cfgOverride || window.__tf_isignalUsersMgmtCfg || null;
const pid = String(platformId || '');
const aName = String(analystName || '').trim();
if (!pid || !aName)
return;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(pid) : pid;
const escA = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(aName) : aName;
const links = document.querySelectorAll(`.tf-users-detail-set-link[data-platform-id="${escPid}"][data-analyst="${escA}"]`);
if (!links || !links.length)
return;
const cd = (cfg && cfg.usersSetCooldown && cfg.usersSetCooldown[pid] && cfg.usersSetCooldown[pid][aName])
? cfg.usersSetCooldown[pid][aName]
: null;
const until = cd && cd.until ? Number(cd.until) : null;
const now = Date.now();
const active = (Number.isFinite(until) && until > now);
links.forEach((link) => {
try {
if (!link)
return;
let span = null;
const nxt = link.nextElementSibling;
if (nxt && nxt.classList && nxt.classList.contains('tf-users-set-countdown')) {
span = nxt;
}
else {
try {
span = link.parentElement ? link.parentElement.querySelector(`.tf-users-set-countdown[data-platform-id="${escPid}"][data-analyst="${escA}"]`) : null;
}
catch (e) { }
}
if (!span) {
span = document.createElement('span');
span.className = 'tf-users-set-countdown';
span.setAttribute('data-platform-id', pid);
span.setAttribute('data-analyst', aName);
span.style.display = 'none';
span.textContent = '';
try {
link.insertAdjacentElement('afterend', span);
}
catch (e) {
try {
link.parentNode && link.parentNode.insertBefore(span, link.nextSibling);
}
catch (e2) { }
}
}
if (!active) {
link.style.display = '';
span.style.display = 'none';
span.textContent = '';
span.removeAttribute('data-end-at');
span.removeAttribute('title');
return;
}
link.style.display = 'none';
span.style.display = 'inline-flex';
span.setAttribute('data-end-at', String(until));
span.title = (cd && cd.reason) ? String(cd.reason) : 'Anda harus menunggu 5 menit untuk melakukan perubahan lainnya';
const rem = Math.max(0, until - now);
span.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
}
catch (e) { }
});
}
catch (e) { }
}
function tf_isignalUsers_refreshAllSetCountdownUI(cfgOverride) {
try {
const cfg = cfgOverride || window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetCooldown)
return;
const now = Date.now();
Object.keys(cfg.usersSetCooldown || {}).forEach((pid) => {
const mp = cfg.usersSetCooldown[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
const until = st && st.until ? Number(st.until) : null;
if (Number.isFinite(until) && until > now) {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
});
});
}
catch (e) { }
}
function tf_isignalUsers_finalizeExpiredSetCooldowns() {
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetCooldown)
return;
const now = Date.now();
let changed = false;
try {
Object.keys(cfg.usersSetCooldown || {}).forEach((pid) => {
const mp = cfg.usersSetCooldown[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
const until = st && st.until ? Number(st.until) : null;
if (!Number.isFinite(until) || until > now)
return;
try {
delete mp[aName];
}
catch (e) {
mp[aName] = null;
}
changed = true;
try {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
catch (e) { }
});
try {
if (mp && typeof mp === 'object' && Object.keys(mp).filter(k => mp[k]).length === 0) {
delete cfg.usersSetCooldown[pid];
changed = true;
}
}
catch (e) { }
});
}
catch (e) { }
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
try {
tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
}
}
function tf_isignalUsers_updateSetCountdownTimers() {
try {
const now = Date.now();
try {
document.querySelectorAll('.tf-users-set-countdown[data-end-at]').forEach((span) => {
const end = Number(span.getAttribute('data-end-at') || (span.dataset ? span.dataset.endAt : null));
if (!Number.isFinite(end) || !end)
return;
const rem = Math.max(0, end - now);
span.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
if (rem <= 0) {
try {
const link = span.previousElementSibling;
if (link && link.classList && link.classList.contains('tf-users-detail-set-link')) {
link.style.display = '';
}
span.style.display = 'none';
}
catch (e) { }
}
});
}
catch (e) { }
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (cfg && cfg.usersSetCooldown) {
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
tf_isignalUsers_finalizeExpiredSetCooldowns();
}
}
catch (e) { }
}
function tf_isignalUsers_ensureSetCountdownTicker() {
if (window.__tfIsUsersSetCountdownTicker)
return;
window.__tfIsUsersSetCountdownTicker = setInterval(() => {
try {
tf_isignalUsers_updateSetCountdownTimers();
}
catch (e) { }
}, 1000);
try {
tf_isignalUsers_updateSetCountdownTimers();
}
catch (e) { }
}
function tf_isignalUsers_updateCooldownTextBadges() {
try {
const badges = document.querySelectorAll('.tf-users-set-badge.tf-users-set-badge-cooldown[data-end-at]');
if (!badges || !badges.length)
return;
const now = Date.now();
badges.forEach((badge) => {
const end = Number(badge.getAttribute('data-end-at') || (badge.dataset ? badge.dataset.endAt : null));
if (!Number.isFinite(end))
return;
const rem = Math.max(0, end - now);
badge.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
});
}
catch (e) { }
}
function tf_isignalUsers_finalizeExpiredCooldowns() {
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetStatus)
return;
const now = Date.now();
let changed = false;
try {
Object.keys(cfg.usersSetStatus || {}).forEach((pid) => {
const mp = cfg.usersSetStatus[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
if (!st || st.status !== 'cooldown')
return;
const until = Number(st.cooldownUntil || st.until);
if (Number.isFinite(until) && until > now)
return;
const finalStatus = (st.finalStatus === 'ok') ? 'ok' : (st.finalStatus === 'fail' ? 'fail' : (st.finalOk ? 'ok' : 'fail'));
const finalReason = st.finalReason ? String(st.finalReason) : (st.reason ? String(st.reason) : '');
mp[aName] = { status: finalStatus, reason: finalReason, updatedAt: now };
changed = true;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
});
});
}
catch (e) { }
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
try {
tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
}
}
function tf_isignalUsers_updateCooldownTimers() {
tf_isignalUsers_updateCooldownTextBadges();
tf_isignalUsers_finalizeExpiredCooldowns();
}
function tf_isignalUsers_ensureCooldownTicker() {
if (window.__tfIsUsersCooldownTicker)
return;
window.__tfIsUsersCooldownTicker = setInterval(() => {
try {
tf_isignalUsers_updateCooldownTimers();
}
catch (e) { }
}, 1000);
try {
tf_isignalUsers_updateCooldownTimers();
}
catch (e) { }
}
function tf_isignalUsers_applyAnalystLink(linkEl, analystName) {
if (!linkEl)
return;
const name = String(analystName || '').trim();
const id = tf_isignalUsers_getIsignalIdByName(name);
const url = id ? (`https://account.tradersfamily.id/channels/isignal/${id}`) : TF_ISIGNAL_CHANNELS_URL;
linkEl.setAttribute('href', url);
linkEl.setAttribute('data-isignal-url', url);
linkEl.setAttribute('data-analyst', name);
tf_applyLatestRiskColorOnly(linkEl, name, null);
}
function tf_isignalUsers_statusClassFromText(statusText) {
const s = String(statusText || '').trim().toLowerCase();
if (s === 'aktif')
return 'tf-isignal-status-aktif';
if (s.includes('belum'))
return 'tf-isignal-status-belum';
if (s.includes('tidak'))
return 'tf-isignal-status-tidak';
return 'tf-isignal-status-unknown';
}
function tf_isignalUsers_applyIsignalStatusPill(pillEl, analystName) {
if (!pillEl)
return;
const name = String(analystName || '').trim();
const state = __tfIsUsersVerifyState.state || 'idle';
pillEl.classList.remove('tf-isignal-status-aktif', 'tf-isignal-status-belum', 'tf-isignal-status-tidak', 'tf-isignal-status-unknown');
if (state === 'loading') {
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = 'Scanning...';
return;
}
if (state === 'idle') {
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = '—';
return;
}
if (state === 'done') {
const status = tf_isignalUsers_getIsignalStatusByName(name);
const txt = status ? String(status) : 'Tidak ditemukan';
pillEl.textContent = txt;
pillEl.classList.add(tf_isignalUsers_statusClassFromText(txt));
return;
}
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = 'Error';
}
function tf_isignalUsers_refreshIsignalAnalystStatusCells() {
try {
document.querySelectorAll('.tf-isignal-status-pill[data-analyst]').forEach((pill) => {
const name = pill.getAttribute('data-analyst') || '';
tf_isignalUsers_applyIsignalStatusPill(pill, name);
});
document.querySelectorAll('.tf-isignal-subend[data-analyst]').forEach((el) => {
const name = el.getAttribute('data-analyst') || '';
tf_isignalUsers_applyIsignalSubscriptionEndOn(el, name);
});
const loader = document.getElementById('tf-isignal-analysts-loader');
if (loader)
loader.style.display = (__tfIsUsersVerifyState.state === 'loading') ? 'flex' : 'none';
const errBox = document.getElementById('tf-isignal-analysts-error');
if (errBox) {
const show = (__tfIsUsersVerifyState.state === 'error');
errBox.style.display = show ? 'block' : 'none';
errBox.textContent = show ? (String(__tfIsUsersVerifyState.error || 'Gagal scan iSignal')) : '';
}
}
catch (e) { }
}
function tf_isignalUsers_getUniqueAnalystNamesFromEntries(entries) {
const out = [];
const seen = new Set();
try {
(entries || []).forEach((e) => {
const name = e && e.baseName ? String(e.baseName).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || seen.has(k))
return;
seen.add(k);
out.push(name);
});
}
catch (e) { }
out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
return out;
}
function tf_isignalUsers_getAllChannelsSorted() {
const list = Array.isArray(__tfIsUsersVerifyState.channels) ? __tfIsUsersVerifyState.channels.slice() : [];
const out = [];
const seen = new Set();
try {
list.forEach((ch) => {
const name = ch && ch.name ? String(ch.name).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || seen.has(k))
return;
seen.add(k);
const rawSub = ch && ch.subscriptionEndOn ? String(ch.subscriptionEndOn).trim() : '';
const sub = (rawSub === '—' || rawSub === '-' || rawSub.toLowerCase() === 'n/a') ? '' : rawSub;
const loadingFlag = (ch && typeof ch.subscriptionLoading === 'boolean') ? ch.subscriptionLoading : !sub;
out.push({
name,
statusText: ch && ch.statusText ? String(ch.statusText).trim() : '',
subscriptionEndOn: sub,
subscriptionLoading: !!loadingFlag
});
});
}
catch (e) { }
out.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' }));
return out;
}
function tf_isignalUsers_renderIsignalAnalystSkeleton(tbodies, rows) {
const bodies = Array.isArray(tbodies) ? tbodies : [];
const n = Math.max(3, parseInt(rows, 10) || 6);
bodies.forEach((tbody) => {
if (!tbody)
return;
tbody.innerHTML = '';
for (let i = 0; i < n; i++) {
const tr = document.createElement('tr');
const td1 = document.createElement('td');
const td2 = document.createElement('td');
const td3 = document.createElement('td');
td1.style.textAlign = 'left';
td2.style.textAlign = 'left';
td3.style.textAlign = 'left';
td1.innerHTML = '<div class="tf-skel-line" style="width: 78%;"></div>';
td2.innerHTML = '<div class="tf-skel-line" style="width: 62%;"></div>';
td3.innerHTML = '<div class="tf-skel-line" style="width: 72%;"></div>';
tr.appendChild(td1);
tr.appendChild(td2);
tr.appendChild(td3);
tbody.appendChild(tr);
}
});
}
function tf_isignalUsers_splitIntoColumns(arr, cols) {
const list = Array.isArray(arr) ? arr.slice() : [];
const n = Math.max(1, parseInt(cols, 10) || 1);
const per = Math.ceil(list.length / n) || 1;
const out = [];
for (let i = 0; i < n; i++) {
out.push(list.slice(i * per, (i + 1) * per));
}
return out;
}
function tf_isignalUsers_renderIsignalAnalystTables(entries) {
const tb1 = document.getElementById('tf-isignal-analyst-tbody-1');
const tb2 = document.getElementById('tf-isignal-analyst-tbody-2');
if (!tb1 || !tb2)
return;
tb1.innerHTML = '';
tb2.innerHTML = '';
const state = __tfIsUsersVerifyState.state || 'idle';
if (state === 'idle' || state === 'loading') {
tf_isignalUsers_renderIsignalAnalystSkeleton([tb1, tb2], 7);
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
if (state === 'error') {
const msg = String(__tfIsUsersVerifyState.error || 'Gagal scan iSignal');
[tb1, tb2].forEach((tbody) => {
tbody.innerHTML = '';
const tr = document.createElement('tr');
const td = document.createElement('td');
td.colSpan = 3;
td.style.textAlign = 'left';
td.textContent = msg;
tr.appendChild(td);
tbody.appendChild(tr);
});
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
const channels = Array.isArray(entries) ? entries : tf_isignalUsers_getAllChannelsSorted();
if (!channels.length) {
[tb1, tb2].forEach((tbody, index) => {
tbody.innerHTML = '';
const tr = document.createElement('tr');
const td = document.createElement('td');
td.colSpan = 3;
td.style.textAlign = 'left';
td.textContent = index === 0
? 'Belum ada data analis iSignal yang ditemukan.'
: '—';
tr.appendChild(td);
tbody.appendChild(tr);
});
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
const cols = tf_isignalUsers_splitIntoColumns(channels, 2);
const bodies = [tb1, tb2];
cols.forEach((col, colIdx) => {
const tbody = bodies[colIdx];
(col || []).forEach((item) => {
const name = item && item.name ? String(item.name).trim() : '';
if (!name)
return;
const tr = document.createElement('tr');
const tdName = document.createElement('td');
tdName.style.textAlign = 'left';
const wrap = document.createElement('div');
wrap.className = 'tf-users-analyst-cell';
const badge = document.createElement('span');
badge.className = 'tf-users-verify tf-users-verify-loading';
badge.setAttribute('data-analyst', name);
badge.title = 'Mencocokkan analis iSignal...';
const a = document.createElement('a');
a.className = 'tf-users-analyst-link';
a.textContent = (typeof formatAnalystDisplayName === 'function') ? formatAnalystDisplayName(name) : name;
a.title = name;
a.setAttribute('data-analyst', name);
a.setAttribute('href', TF_ISIGNAL_CHANNELS_URL);
a.setAttribute('target', '_blank');
a.setAttribute('rel', 'noopener noreferrer');
wrap.appendChild(badge);
wrap.appendChild(a);
tdName.appendChild(wrap);
const tdStatus = document.createElement('td');
tdStatus.style.textAlign = 'left';
const pill = document.createElement('span');
pill.className = 'tf-isignal-status-pill tf-isignal-status-unknown';
pill.setAttribute('data-analyst', name);
const st = item && item.statusText ? String(item.statusText).trim() : '';
pill.textContent = st || '—';
pill.classList.remove('tf-isignal-status-unknown');
pill.classList.add(tf_isignalUsers_statusClassFromText(st || ''));
tdStatus.appendChild(pill);
const tdSub = document.createElement('td');
tdSub.className = 'tf-subend-td';
tdSub.style.verticalAlign = 'middle';
tdSub.style.textAlign = 'left';
const subSpan = document.createElement('span');
subSpan.className = 'tf-isignal-subend';
subSpan.setAttribute('data-analyst', name);
const subTxt = item && item.subscriptionEndOn ? String(item.subscriptionEndOn).trim() : '';
if (!subTxt && item && item.subscriptionLoading) {
subSpan.classList.add('tf-isusers-sub-loading');
subSpan.innerHTML = tf_spinnerHTML(true);
}
else {
tf_applySubscription412(subSpan, subTxt || '—');
}
tdSub.appendChild(subSpan);
tr.appendChild(tdName);
tr.appendChild(tdStatus);
tr.appendChild(tdSub);
tbody.appendChild(tr);
});
});
tf_isignalUsers_refreshAllVerifyBadges();
}
function tf_isignalUsers_refreshAllVerifyBadges() {
try {
document.querySelectorAll('.tf-users-verify[data-analyst]').forEach((badge) => {
const name = badge.getAttribute('data-analyst') || '';
tf_isignalUsers_applyVerifyBadge(badge, name);
});
document.querySelectorAll('a.tf-users-analyst-link[data-analyst]').forEach((a) => {
const name = a.getAttribute('data-analyst') || '';
tf_isignalUsers_applyAnalystLink(a, name);
});
tf_isignalUsers_refreshIsignalAnalystStatusCells();
}
catch (e) { }
}
async function tf_isignalUsers_startActiveChannelsScan() {
try {
if (__tfIsUsersVerifyState.state === 'loading')
return;
if (__tfIsUsersVerifyState.state === 'done' && __tfIsUsersVerifyState.fetchedAt && (Date.now() - __tfIsUsersVerifyState.fetchedAt) < 5 * 60 * 1000) {
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
__tfIsUsersVerifyState.state = 'loading';
__tfIsUsersVerifyState.error = '';
tf_isignalUsers_refreshAllVerifyBadges();
const resp = await tf_isignalUsers_sendMessage({ type: 'tf_scan_active_isignal_channels', url: TF_ISIGNAL_CHANNELS_URL });
if (resp && resp.ok) {
const channelsRaw = Array.isArray(resp.channels) ? resp.channels : [];
const channels = channelsRaw.map((c) => {
const out = Object.assign({}, c);
const subRaw = (out.subscriptionEndOn || '').toString().trim();
const sub = (subRaw === '-' || subRaw === '—') ? '' : subRaw;
out.subscriptionEndOn = sub;
if (!sub)
out.subscriptionLoading = true;
return out;
});
__tfIsUsersVerifyState.channels = channels;
__tfIsUsersVerifyState.map = tf_isignalUsers_buildActiveMap(channels);
__tfIsUsersVerifyState.state = 'done';
__tfIsUsersVerifyState.fetchedAt = Date.now();
__tfIsUsersVerifyState.error = '';
}
else {
if (!Array.isArray(__tfIsUsersVerifyState.channels)) __tfIsUsersVerifyState.channels = [];
if (!__tfIsUsersVerifyState.map || typeof __tfIsUsersVerifyState.map !== 'object') __tfIsUsersVerifyState.map = {};
__tfIsUsersVerifyState.state = __tfIsUsersVerifyState.channels.length ? 'done' : 'error';
__tfIsUsersVerifyState.fetchedAt = Date.now();
__tfIsUsersVerifyState.error = resp && resp.error ? String(resp.error) : 'Unknown error';
}
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
tf_isignalUsers_refreshAllVerifyBadges();
}
catch (e) {
try {
__tfIsUsersVerifyState.state = 'error';
__tfIsUsersVerifyState.error = String(e);
__tfIsUsersVerifyState.fetchedAt = Date.now();
}
catch (x) { }
tf_isignalUsers_refreshAllVerifyBadges();
}
}
let __tfIsUsersAnalystMetaCache = null;
async function tf_isignalUsers_prepareAnalystMeta() {
if (__tfIsUsersAnalystMetaCache && __tfIsUsersAnalystMetaCache.ok)
return __tfIsUsersAnalystMetaCache;
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
const keys = ['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips', TF_MYFXBOOK_PRICES_KEY];
const data = await tf_storageLocalGet(keys);
try {
historySignals = Array.isArray(data.tfHistorySignals) ? data.tfHistorySignals : [];
}
catch (e) {
historySignals = [];
}
try {
analystSourcesByName = (data.tfAnalystSources && typeof data.tfAnalystSources === 'object') ? data.tfAnalystSources : {};
}
catch (e) {
analystSourcesByName = {};
}
// Fallback untuk data import lama: bila tfAnalystSources belum tersimpan tetapi
// tfMonthlyStats sudah ada, bentuk ulang Nama Analis dan Pair dari key
// "Nama Analis (PAIR)" yang dipakai Table 2 dashboard.
try {
const monthlyFallback = (data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object') ? data.tfMonthlyStats : {};
if (!Object.keys(analystSourcesByName || {}).length) {
Object.keys(monthlyFallback).forEach((rawKey) => {
const key = String(rawKey || '').trim();
if (!key)
return;
const match = key.match(/^(.*?)\s*\(([A-Z0-9._-]{3,20})\)\s*$/i);
const baseName = String(match && match[1] ? match[1] : key).trim();
const pair = String(match && match[2] ? match[2] : '').toUpperCase().replace(/[^A-Z0-9]/g, '');
if (!baseName)
return;
if (!analystSourcesByName[baseName])
analystSourcesByName[baseName] = { url: '', pairs: [] };
if (!Array.isArray(analystSourcesByName[baseName].pairs))
analystSourcesByName[baseName].pairs = [];
if (pair && !analystSourcesByName[baseName].pairs.includes(pair))
analystSourcesByName[baseName].pairs.push(pair);
});
}
}
catch (e) { }
try {
noDataPairsByAnalyst = (data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object') ? data.tfNoDataPairs : {};
}
catch (e) {
noDataPairsByAnalyst = {};
}
try {
avgSlPipsByAnalystPair = (data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object') ? data.tfAvgSlPips : {};
}
catch (e) {
avgSlPipsByAnalystPair = {};
}
try {
tfMyfxbookPriceMapLatest = (data && data[TF_MYFXBOOK_PRICES_KEY] && typeof data[TF_MYFXBOOK_PRICES_KEY] === 'object') ? data[TF_MYFXBOOK_PRICES_KEY] : null;
}
catch (e) {
tfMyfxbookPriceMapLatest = null;
}
try {
rebuildAnalystListFromSources();
}
catch (e) { }
if (!Array.isArray(ANALYSTS) || !ANALYSTS.length) {
__tfIsUsersAnalystMetaCache = { ok: false, error: 'Belum ada data analis. Silakan scan / import dulu di dashboard.' };
try {
window.__tfIsUsersAnalystMetaCache = __tfIsUsersAnalystMetaCache;
}
catch (e) { }
return __tfIsUsersAnalystMetaCache;
}
const entries = [];
try {
for (const a of ANALYSTS) {
const pair = (a && a.pair ? String(a.pair) : '').toUpperCase();
const base = a && a.baseName ? String(a.baseName) : '';
if (!base || !pair)
continue;
const slStats = computeSlStatsFromHistory(base, pair);
const effObj = getEffectiveSlForAnalyst(base, pair, slStats);
const effectiveSl = (effObj && typeof effObj === 'object') ? effObj.pips : effObj;
const suggestedRisk = getRiskPercentForAnalyst(base, pair);
const dollarPerPip = getDollarPerPipForAnalyst(a, pair);
entries.push({
baseName: base,
pair,
effectiveSlPips: (tf_isFiniteNumber(effectiveSl) && effectiveSl > 0) ? effectiveSl : null,
suggestedRisk: (tf_isFiniteNumber(suggestedRisk) && suggestedRisk > 0) ? suggestedRisk : null,
dollarPerPip: (tf_isFiniteNumber(dollarPerPip) && dollarPerPip > 0) ? dollarPerPip : null
});
}
}
catch (e) { }
__tfIsUsersAnalystMetaCache = { ok: true, entries };
try {
window.__tfIsUsersAnalystMetaCache = __tfIsUsersAnalystMetaCache;
}
catch (e) { }
return __tfIsUsersAnalystMetaCache;
}
function tf_isignalUsers_buildChildRowHtml(platformId) {
const tr = document.createElement('tr');
tr.className = 'tf-users-child-row';
tr.setAttribute('data-platform-id', platformId);
const td = document.createElement('td');
td.colSpan = 6;
const wrap = document.createElement('div');
wrap.className = 'tf-users-detail-wrap';
wrap.setAttribute('data-platform-id', platformId);
const grid = document.createElement('div');
grid.className = 'tf-users-detail-grid';
const makeTable = (tbodyClass) => {
const table = document.createElement('table');
table.className = 'tf-users-detail-table';
table.innerHTML = `
<thead>
<tr>
<th class="tf-col-action">Action</th>
<th class="tf-col-disconnect" style="text-align:left;">Disconnect</th>
<th class="tf-col-analyst" style="text-align:left;">Nama Analis</th>
<th class="tf-col-pair">Pair</th>
<th class="tf-col-lot">Lot<br>Size</th>
<th class="tf-col-risk">Risk % /<br>Trade</th>
</tr>
</thead>
<tbody class="${tbodyClass}"></tbody>
`;
return table;
};
grid.appendChild(makeTable('tf-users-detail-tbody-left'));
grid.appendChild(makeTable('tf-users-detail-tbody-right'));
wrap.appendChild(grid);
td.appendChild(wrap);
tr.appendChild(td);
return tr;
}
function tf_isignalUsers_renderDetailTable(childRow, cfg, analystEntries, platformId, defaultBalance, defaultRisk) {
const wrap = childRow ? childRow.querySelector('.tf-users-detail-wrap') : null;
const tbodyLeft = wrap ? wrap.querySelector('tbody.tf-users-detail-tbody-left') : null;
const tbodyRight = wrap ? wrap.querySelector('tbody.tf-users-detail-tbody-right') : null;
if (!tbodyLeft || !tbodyRight)
return;
const user = (cfg.users && cfg.users[platformId]) ? cfg.users[platformId] : {};
const bal = tf_safeNumber(user.balance);
const balance = (bal != null && bal > 0) ? bal : null;
const accRisk = tf_safeNumber(user.risk);
const accountRisk = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
tbodyLeft.innerHTML = '';
tbodyRight.innerHTML = '';
const entries = Array.isArray(analystEntries) ? analystEntries : [];
const mid = Math.ceil(entries.length / 2);
const leftEntries = entries.slice(0, mid);
const rightEntries = entries.slice(mid);
const appendRow = (entry, tbody) => {
const key = `${entry.baseName}||${entry.pair}`;
const analystRiskMap = (user.analystRisk && typeof user.analystRisk === 'object') ? user.analystRisk : {};
const overrideRisk = tf_safeNumber(analystRiskMap[key]);
const risk = (overrideRisk != null && overrideRisk > 0) ? overrideRisk : accountRisk;
const analystLotMap = (user.analystLot && typeof user.analystLot === 'object') ? user.analystLot : {};
const overrideLot = tf_safeNumber(analystLotMap[key]);
const sl = (entry.effectiveSlPips != null && entry.effectiveSlPips > 0) ? entry.effectiveSlPips : null;
const dpp = (entry.dollarPerPip != null && entry.dollarPerPip > 0) ? entry.dollarPerPip : null;
let defaultLot = null;
if (balance != null && sl && dpp) {
const rawLot = computeLot(balance, risk, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0)
defaultLot = lot;
}
const lotValue = (overrideLot != null && overrideLot > 0) ? overrideLot : defaultLot;
const actualRisk = tf_isignalUsers_calcActualRiskPercent(balance, lotValue, sl, dpp);
const displayedRisk = (actualRisk != null && actualRisk > 0) ? actualRisk : risk;
const tr = document.createElement('tr');
tr.dataset.entryKey = key;
if (sl)
tr.dataset.sl = String(sl);
if (dpp)
tr.dataset.dpp = String(dpp);
const tdAnalyst = document.createElement('td');
tdAnalyst.className = 'tf-col-analyst';
const analystLink = document.createElement('a');
analystLink.href = '#';
analystLink.className = 'tf-link tf-users-analyst-link';
analystLink.textContent = tf_isignalUsers_truncAnalyst10(entry.baseName || '');
analystLink.title = String(entry.baseName || '').trim();
analystLink.setAttribute('data-analyst', String(entry.baseName || ''));
tdAnalyst.appendChild(analystLink);
const setBadge = document.createElement('span');
setBadge.className = 'tf-users-set-badge tf-users-set-badge-idle';
setBadge.setAttribute('data-analyst', String(entry.baseName || ''));
setBadge.setAttribute('data-platform-id', String(platformId));
const setSpinner = document.createElement('span');
setSpinner.className = 'tf-users-set-spinner';
setSpinner.setAttribute('data-analyst', String(entry.baseName || ''));
setSpinner.setAttribute('data-platform-id', String(platformId));
try {
tf_isignalUsers_applyAnalystLink(analystLink, entry.baseName);
tf_isignalUsers_applySetBadge(setBadge, setSpinner, cfg, platformId, entry.baseName);
}
catch (e) { }
const tdPair = document.createElement('td');
tdPair.className = 'tf-col-pair';
tdPair.innerHTML = `<span class="tf-users-mono">${escapeHtml(entry.pair)}</span>`;
if (sl != null && Number.isFinite(Number(sl)) && Number(sl) > 0) {
const slNum = Number(sl);
const slLabel = Math.abs(slNum - Math.round(slNum)) < 0.000001
? String(Math.round(slNum))
: String(Number(slNum.toFixed(2)));
tdPair.title = slLabel + ' pips';
tdPair.style.cursor = 'help';
}
const tdLot = document.createElement('td');
tdLot.className = 'tf-users-detail-lot-cell tf-col-lot';
const lotInp = document.createElement('input');
lotInp.type = 'number';
lotInp.step = '0.01';
lotInp.min = '0.01';
lotInp.inputMode = 'decimal';
lotInp.className = 'form-input tf-users-detail-lot-input';
lotInp.dataset.entryKey = key;
lotInp.dataset.defaultLot = (defaultLot != null) ? String(defaultLot) : '';
lotInp.dataset.customLot = (overrideLot != null && overrideLot > 0) ? '1' : '0';
lotInp.value = (lotValue != null && lotValue > 0) ? String(lotValue) : '';
lotInp.placeholder = defaultLot != null ? String(defaultLot) : '—';
lotInp.title = (overrideLot != null && overrideLot > 0)
? 'Lot Size custom untuk baris ini. Kosongkan untuk kembali ke hasil perhitungan default.'
: 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
tdLot.appendChild(lotInp);
const tdRisk = document.createElement('td');
tdRisk.className = 'tf-col-risk';
const inp = document.createElement('input');
inp.type = 'number';
inp.step = '0.01';
inp.min = '0.01';
inp.inputMode = 'decimal';
inp.className = 'form-input tf-users-detail-risk-input';
inp.dataset.entryKey = key;
inp.dataset.targetRisk = String(risk);
inp.dataset.actualRisk = (actualRisk != null && actualRisk > 0) ? String(actualRisk) : '';
inp.value = tf_isignalUsers_formatNumberInput(displayedRisk);
inp.title = (actualRisk != null && actualRisk > 0)
? 'Risk aktual berdasarkan Lot Size yang dipakai setelah pembulatan 0.01 lot.'
: ((overrideRisk != null && overrideRisk > 0)
? 'Risk %/Trade custom untuk baris ini (Metatrader ID ini).'
: 'Risk %/Trade default mengikuti main row. Ubah angka untuk custom baris ini.');
tdRisk.appendChild(inp);
const tdAction = document.createElement('td');
tdAction.className = 'tf-col-action';
const safeAnalyst = String(entry.baseName || '');
const setWrap = document.createElement('div');
setWrap.className = 'tf-users-action-setwrap';
const setLink = document.createElement('a');
setLink.href = '#';
setLink.className = 'tf-link tf-users-detail-set-link';
setLink.setAttribute('data-platform-id', String(platformId));
setLink.setAttribute('data-analyst', safeAnalyst);
setLink.textContent = 'Set';
setWrap.appendChild(setLink);
try {
setWrap.appendChild(setSpinner);
}
catch (e) { }
try {
setWrap.appendChild(setBadge);
}
catch (e) { }
tdAction.appendChild(setWrap);
const tdDisconnect = document.createElement('td');
tdDisconnect.className = 'tf-col-disconnect';
let isignalId = '';
try {
isignalId = (typeof tf_isignalUsers_getIsignalIdByName === 'function') ? String(tf_isignalUsers_getIsignalIdByName(safeAnalyst) || '') : '';
}
catch (e) {
isignalId = '';
}
if (!isignalId) {
tdDisconnect.innerHTML = `<span class="tf-users-disconnect-x">X</span>`;
}
else {
tdDisconnect.innerHTML = `<a href="#" class="tf-link tf-users-detail-disconnect-link" data-platform-id="${escapeHtml(String(platformId))}" data-analyst="${escapeHtml(safeAnalyst)}" data-isignal-id="${escapeHtml(String(isignalId))}">Disconnect</a>`;
}
tr.appendChild(tdAction);
tr.appendChild(tdDisconnect);
tr.appendChild(tdAnalyst);
tr.appendChild(tdPair);
tr.appendChild(tdLot);
tr.appendChild(tdRisk);
tbody.appendChild(tr);
};
leftEntries.forEach((entry) => appendRow(entry, tbodyLeft));
rightEntries.forEach((entry) => appendRow(entry, tbodyRight));
}
function tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk) {
const table = document.getElementById('tf-users-mgmt-table');
if (!table)
return;
const tbody = table.querySelector('tbody');
if (!tbody)
return;
// Simpan konteks render terbaru supaya event handler yang sudah terpasang tetap
// memakai data Dashboard terbaru ketika chrome.storage.local berubah.
tbody.__tfUsersRenderContext = {
cfg,
analystEntries: Array.isArray(analystEntries) ? analystEntries : [],
defaultBalance,
defaultRisk
};
tbody.innerHTML = '';
const normalizedPlatformIds = Array.isArray(platformIds)
? platformIds.map((x) => String(x == null ? '' : x).trim()).filter(Boolean)
: [];
if (!normalizedPlatformIds.length) {
const emptyRow = document.createElement('tr');
emptyRow.className = 'tf-users-empty-row';
const emptyCell = document.createElement('td');
emptyCell.colSpan = 6;
emptyCell.style.textAlign = 'left';
emptyCell.textContent = 'Belum ada Platform ID MetaTrader yang ditemukan. Data analis Dashboard tetap disiapkan dan akan muncul setelah Platform ID berhasil dibaca.';
emptyRow.appendChild(emptyCell);
tbody.appendChild(emptyRow);
}
normalizedPlatformIds.forEach((pid) => {
const user = (cfg.users && cfg.users[pid]) ? cfg.users[pid] : {};
const tr = document.createElement('tr');
tr.setAttribute('data-platform-id', pid);
const tdAction = document.createElement('td');
tdAction.className = 'tf-col-action';
tdAction.innerHTML = `<a href="#" class="tf-link tf-users-set-link" data-platform-id="${escapeHtml(String(pid))}">Set ALL</a>`;
const tdId = document.createElement('td');
tdId.innerHTML = `<span class="tf-users-mono">${escapeHtml(String(pid))}</span>`;
const tdPass = document.createElement('td');
const passWrap = document.createElement('div');
passWrap.className = 'tf-pass-wrap';
const passInp = document.createElement('input');
passInp.type = 'password';
passInp.className = 'form-input tf-users-pass-input';
passInp.setAttribute('data-platform-id', pid);
passInp.placeholder = 'Password';
passInp.value = (user && typeof user.password === 'string') ? user.password : '';
const eyeBtn = document.createElement('button');
eyeBtn.type = 'button';
eyeBtn.className = 'tf-pass-eye';
eyeBtn.setAttribute('aria-label', 'Show/hide password');
eyeBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<g class="tf-eye-open">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
<circle cx="12" cy="12" r="3"/>
</g>
<g class="tf-eye-closed">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
<circle cx="12" cy="12" r="3"/>
<line x1="4" y1="4" x2="20" y2="20"/>
</g>
</svg>`;
passWrap.appendChild(passInp);
passWrap.appendChild(eyeBtn);
tdPass.appendChild(passWrap);
const tdBal = document.createElement('td');
const balInp = document.createElement('input');
balInp.type = 'number';
balInp.step = '0.01';
balInp.min = '0';
balInp.className = 'form-input tf-users-balance-input';
const bal = tf_safeNumber(user.balance);
balInp.value = (bal != null && bal > 0) ? String(bal) : '';
balInp.placeholder = 'Balance';
tdBal.appendChild(balInp);
const tdRisk = document.createElement('td');
const riskInp = document.createElement('input');
riskInp.type = 'number';
riskInp.step = '0.01';
riskInp.min = '0.01';
riskInp.inputMode = 'decimal';
riskInp.className = 'form-input tf-users-risk-input';
riskInp.title = 'Risk target utama. Perubahan di sini menghitung ulang seluruh Lot Size dan Risk aktual semua analis.';
const r = tf_safeNumber(user.risk);
riskInp.value = String((r != null && r > 0) ? r : defaultRisk);
tdRisk.appendChild(riskInp);
const tdDetail = document.createElement('td');
tdDetail.innerHTML = `<a href="#" class="tf-link tf-users-detail-link">Detail</a>`;
tr.appendChild(tdAction);
tr.appendChild(tdId);
tr.appendChild(tdPass);
tr.appendChild(tdBal);
tr.appendChild(tdRisk);
tr.appendChild(tdDetail);
tbody.appendChild(tr);
});
if (!tbody.__tfUsersMgmtBound) {
tbody.__tfUsersMgmtBound = true;
tbody.addEventListener('click', (ev) => {
const __ctx = tbody.__tfUsersRenderContext || {};
cfg = __ctx.cfg || cfg;
analystEntries = Array.isArray(__ctx.analystEntries) ? __ctx.analystEntries : analystEntries;
defaultBalance = __ctx.defaultBalance != null ? __ctx.defaultBalance : defaultBalance;
defaultRisk = __ctx.defaultRisk != null ? __ctx.defaultRisk : defaultRisk;
const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
if (!a)
return;
if (a.classList.contains('tf-users-analyst-link')) {
ev.preventDefault();
const name = a.getAttribute('data-analyst') || (a.textContent || '');
const url = a.getAttribute('data-isignal-url') || tf_isignalUsers_getIsignalUrlByName(name);
try {
if (chrome && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: true });
}
else {
window.open(url, '_blank');
}
}
catch (e) {
try {
window.open(url, '_blank');
}
catch (x) { }
}
return;
}
if (a.classList.contains('tf-users-detail-link')) {
ev.preventDefault();
const row = a.closest('tr[data-platform-id]');
if (!row)
return;
const pid = row.getAttribute('data-platform-id') || '';
const next = row.nextElementSibling;
if (next && next.classList && next.classList.contains('tf-users-child-row')) {
next.remove();
return;
}
const child = tf_isignalUsers_buildChildRowHtml(pid);
row.insertAdjacentElement('afterend', child);
tf_isignalUsers_renderDetailTable(child, cfg, analystEntries, pid, defaultBalance, defaultRisk);
return;
}
});
tbody.addEventListener('input', (ev) => {
const __ctx = tbody.__tfUsersRenderContext || {};
cfg = __ctx.cfg || cfg;
analystEntries = Array.isArray(__ctx.analystEntries) ? __ctx.analystEntries : analystEntries;
defaultBalance = __ctx.defaultBalance != null ? __ctx.defaultBalance : defaultBalance;
defaultRisk = __ctx.defaultRisk != null ? __ctx.defaultRisk : defaultRisk;
const tr = ev.target && ev.target.closest ? ev.target.closest('tr[data-platform-id]') : null;
const pid = tr ? tr.getAttribute('data-platform-id') : null;
if (!pid)
return;
cfg.users = cfg.users || {};
cfg.users[pid] = cfg.users[pid] || { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
const u = cfg.users[pid];
if (!u.analystRisk || typeof u.analystRisk !== 'object')
u.analystRisk = {};
if (!u.analystLot || typeof u.analystLot !== 'object')
u.analystLot = {};
const target = ev.target;
if (target.classList.contains('tf-users-pass-input')) {
u.password = String(target.value || '');
}
else if (target.classList.contains('tf-users-balance-input')) {
const n = tf_safeNumber(target.value);
u.balance = (n != null && n > 0) ? n : null;
}
else if (target.classList.contains('tf-users-risk-input')) {
const n = tf_safeNumber(target.value);
u.risk = (n != null && n > 0) ? n : null;
// Main Risk %/Trade adalah master untuk seluruh analis pada Metatrader ID ini.
// Saat nilainya diubah, hapus override per-analis agar semua Lot Size dihitung
// ulang dari target utama dan kolom detail menampilkan Risk aktual hasil pembulatan.
if (n != null && n > 0) {
u.analystRisk = {};
u.analystLot = {};
}
}
else if (target.classList.contains('tf-users-detail-lot-input')) {
const key = (target.dataset && target.dataset.entryKey)
? String(target.dataset.entryKey)
: (target.closest('tr') && target.closest('tr').dataset ? String(target.closest('tr').dataset.entryKey || '') : '');
const n = tf_isignalUsers_parseDecimal(target.value);
const rowEl = target.closest('tr');
const riskInput = rowEl ? rowEl.querySelector('.tf-users-detail-risk-input') : null;
const sl = tf_isignalUsers_parseDecimal(rowEl && rowEl.dataset ? rowEl.dataset.sl : null);
const dpp = tf_isignalUsers_parseDecimal(rowEl && rowEl.dataset ? rowEl.dataset.dpp : null);
const bal = tf_isignalUsers_parseDecimal(u.balance);
const balanceNow = (bal != null && bal > 0) ? bal : null;
if (key) {
if (n != null && n > 0) {
u.analystLot[key] = n;
target.dataset.customLot = '1';
target.title = 'Lot Size diubah manual; Risk %/Trade otomatis menyesuaikan.';
if (balanceNow != null && sl && dpp) {
const riskLinked = tf_isignalUsers_calcActualRiskPercent(balanceNow, n, sl, dpp);
if (riskLinked != null && riskLinked > 0) {
u.analystRisk[key] = riskLinked;
if (riskInput) {
riskInput.value = tf_isignalUsers_formatNumberInput(riskLinked);
riskInput.dataset.actualRisk = String(riskLinked);
riskInput.dataset.targetRisk = String(riskLinked);
riskInput.title = 'Risk aktual otomatis mengikuti Lot Size manual setelah pembulatan.';
}
}
}
}
else {
delete u.analystLot[key];
delete u.analystRisk[key];
target.dataset.customLot = '0';
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
const accRisk = tf_isignalUsers_parseDecimal(u.risk);
const riskReset = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
let resetLot = null;
if (balanceNow != null && sl && dpp) {
const rawLot = computeLot(balanceNow, riskReset, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0) resetLot = lot;
}
const resetActualRisk = tf_isignalUsers_calcActualRiskPercent(balanceNow, resetLot, sl, dpp);
if (riskInput) {
const shownRisk = (resetActualRisk != null && resetActualRisk > 0) ? resetActualRisk : riskReset;
riskInput.value = tf_isignalUsers_formatNumberInput(shownRisk);
riskInput.dataset.actualRisk = (resetActualRisk != null && resetActualRisk > 0) ? String(resetActualRisk) : '';
riskInput.dataset.targetRisk = String(riskReset);
riskInput.title = 'Risk aktual berdasarkan Lot Size otomatis setelah pembulatan 0.01 lot.';
}
target.dataset.defaultLot = resetLot != null ? String(resetLot) : '';
target.placeholder = resetLot != null ? String(resetLot) : '—';
}
}
}
else if (target.classList.contains('tf-users-detail-risk-input')) {
const key = (target.dataset && target.dataset.entryKey)
? String(target.dataset.entryKey)
: (target.closest('tr') && target.closest('tr').dataset ? String(target.closest('tr').dataset.entryKey || '') : '');
u.analystRisk = (u.analystRisk && typeof u.analystRisk === 'object') ? u.analystRisk : {};
u.analystLot = (u.analystLot && typeof u.analystLot === 'object') ? u.analystLot : {};
const desiredRisk = tf_isignalUsers_roundRiskPercent(target.value);
const rowEl = target.closest('tr[data-entry-key]') || target.closest('tr');
const lotInput = rowEl ? rowEl.querySelector('.tf-users-detail-lot-input') : null;
const sl = tf_isignalUsers_parseDecimal(rowEl && rowEl.dataset ? rowEl.dataset.sl : null);
const dpp = tf_isignalUsers_parseDecimal(rowEl && rowEl.dataset ? rowEl.dataset.dpp : null);
const bal = tf_isignalUsers_parseDecimal(u.balance);
const balanceNow = (bal != null && bal > 0) ? bal : null;
const accRisk = tf_isignalUsers_parseDecimal(u.risk);
const accountRiskNow = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
const requestedRisk = (desiredRisk != null && desiredRisk > 0) ? desiredRisk : accountRiskNow;
let linkedLot = null;
let actualRisk = requestedRisk;
if (balanceNow != null && sl && dpp) {
const rawLot = computeLot(balanceNow, requestedRisk, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0) {
linkedLot = lot;
const calculatedActual = tf_isignalUsers_calcActualRiskPercent(balanceNow, linkedLot, sl, dpp);
if (calculatedActual != null && calculatedActual > 0) actualRisk = calculatedActual;
}
}
if (key) {
if (desiredRisk != null && desiredRisk > 0) u.analystRisk[key] = requestedRisk;
else delete u.analystRisk[key];
// Mengubah Risk per analis selalu kembali ke Lot Size otomatis.
delete u.analystLot[key];
}
target.dataset.targetRisk = String(requestedRisk);
target.dataset.actualRisk = (actualRisk != null && actualRisk > 0) ? String(actualRisk) : '';
target.title = 'Risk aktual berdasarkan Lot Size otomatis setelah pembulatan 0.01 lot.';
if (lotInput) {
lotInput.dataset.customLot = '0';
lotInput.dataset.defaultLot = linkedLot != null ? String(linkedLot) : '';
lotInput.placeholder = linkedLot != null ? String(linkedLot) : '—';
lotInput.value = linkedLot != null ? String(linkedLot) : '';
lotInput.title = 'Lot Size otomatis mengikuti Risk %/Trade dan dibulatkan ke 0.01 lot.';
}
}
cfg.updatedAt = Date.now();
tf_isignalUsers_scheduleSave(cfg);
if (target.classList.contains('tf-users-balance-input') || target.classList.contains('tf-users-risk-input')) {
const child = tr.nextElementSibling && tr.nextElementSibling.classList.contains('tf-users-child-row') ? tr.nextElementSibling : null;
if (child) {
tf_isignalUsers_renderDetailTable(child, cfg, analystEntries, pid, defaultBalance, defaultRisk);
}
}
});
tbody.addEventListener('change', (ev) => {
const __ctx = tbody.__tfUsersRenderContext || {};
cfg = __ctx.cfg || cfg;
analystEntries = Array.isArray(__ctx.analystEntries) ? __ctx.analystEntries : analystEntries;
defaultBalance = __ctx.defaultBalance != null ? __ctx.defaultBalance : defaultBalance;
defaultRisk = __ctx.defaultRisk != null ? __ctx.defaultRisk : defaultRisk;
const target = ev.target;
if (!target || !target.classList)
return;
if (target.classList.contains('tf-users-detail-risk-input')) {
const actual = tf_isignalUsers_roundRiskPercent(target.dataset ? target.dataset.actualRisk : null);
const typed = tf_isignalUsers_roundRiskPercent(target.value);
const finalRisk = (actual != null && actual > 0) ? actual : typed;
if (finalRisk != null && finalRisk > 0) target.value = tf_isignalUsers_formatNumberInput(finalRisk);
else {
const trRisk = target.closest ? target.closest('tr[data-platform-id]') : null;
const pidRisk = trRisk ? trRisk.getAttribute('data-platform-id') : null;
const uRisk = pidRisk && cfg.users && cfg.users[pidRisk] ? cfg.users[pidRisk] : null;
const accRisk = tf_isignalUsers_parseDecimal(uRisk && uRisk.risk);
target.value = tf_isignalUsers_formatNumberInput((accRisk != null && accRisk > 0) ? accRisk : defaultRisk);
}
return;
}
if (!target.classList.contains('tf-users-detail-lot-input'))
return;
const tr = target.closest ? target.closest('tr[data-platform-id]') : null;
const pid = tr ? tr.getAttribute('data-platform-id') : null;
if (!pid)
return;
const n = tf_safeNumber(target.value);
if (n != null && n > 0)
return;
cfg.users = cfg.users || {};
cfg.users[pid] = cfg.users[pid] || { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
const u = cfg.users[pid];
if (!u.analystLot || typeof u.analystLot !== 'object')
u.analystLot = {};
const key = target.dataset ? String(target.dataset.entryKey || '') : '';
if (key) {
delete u.analystLot[key];
if (u.analystRisk && typeof u.analystRisk === 'object') delete u.analystRisk[key];
}
const detailRow = target.closest ? (target.closest('tr[data-entry-key]') || target.closest('tr')) : null;
const sl = tf_isignalUsers_parseDecimal(detailRow && detailRow.dataset ? detailRow.dataset.sl : null);
const dpp = tf_isignalUsers_parseDecimal(detailRow && detailRow.dataset ? detailRow.dataset.dpp : null);
const bal = tf_isignalUsers_parseDecimal(u.balance);
const balanceNow = (bal != null && bal > 0) ? bal : null;
const accRisk = tf_isignalUsers_parseDecimal(u.risk);
const accountRiskNow = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
let defaultLot = null;
if (balanceNow != null && sl && dpp) {
const rawLot = computeLot(balanceNow, accountRiskNow, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0) defaultLot = lot;
}
const riskInput = detailRow ? detailRow.querySelector('.tf-users-detail-risk-input') : null;
const actualRisk = tf_isignalUsers_calcActualRiskPercent(balanceNow, defaultLot, sl, dpp);
if (riskInput) {
const shownRisk = (actualRisk != null && actualRisk > 0) ? actualRisk : accountRiskNow;
riskInput.value = tf_isignalUsers_formatNumberInput(shownRisk);
riskInput.dataset.actualRisk = (actualRisk != null && actualRisk > 0) ? String(actualRisk) : '';
riskInput.dataset.targetRisk = String(accountRiskNow);
riskInput.title = 'Risk aktual berdasarkan Lot Size otomatis setelah pembulatan 0.01 lot.';
}
target.value = (defaultLot != null && defaultLot > 0) ? String(defaultLot) : '';
target.dataset.defaultLot = (defaultLot != null && defaultLot > 0) ? String(defaultLot) : '';
target.dataset.customLot = '0';
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
cfg.updatedAt = Date.now();
tf_isignalUsers_scheduleSave(cfg);
});
}
}
function tf_isignalUsers_showSetOverlay() {
try {
const sec = document.getElementById('section-set-progress');
if (sec && typeof sec.scrollIntoView === 'function') {
}
}
catch (e) { }
}
function tf_isignalUsers_hideSetOverlay() {
}
function tf_isignalUsers_showOkModal(title, message, buttonLabel, onAction) {
const modal = document.getElementById('tf-iset-ok-modal');
if (!modal)
return;
if (typeof buttonLabel === 'function') {
onAction = buttonLabel;
buttonLabel = null;
}
const t = modal.querySelector('#tf-iset-ok-title') ||
modal.querySelector('.tf-iset-ok-title');
const msgEl = modal.querySelector('#tf-iset-ok-msg') ||
modal.querySelector('.tf-iset-ok-msg') ||
modal.querySelector('#tf-iset-ok-message') ||
modal.querySelector('.tf-iset-ok-message');
const btn = modal.querySelector('#tf-iset-ok-btn') ||
modal.querySelector('.tf-iset-ok-btn');
if (t)
t.textContent = title || 'Info';
if (msgEl)
msgEl.textContent = message || '';
const label = (typeof buttonLabel === 'string' && buttonLabel.trim()) ? buttonLabel.trim() : 'OK';
if (btn)
btn.textContent = label;
window.__tf_iset_ok_action = (typeof onAction === 'function') ? onAction : null;
modal.style.display = 'flex';
document.body.classList.add('tf-modal-open');
}
function tf_isignalUsers_showConnectModal(title, message, onConnect, onNo, yesLabel, noLabel) {
const modal = document.getElementById('tf-iset-connect-modal');
if (!modal)
return;
try {
tf_isignalUsers_hideOkModal();
}
catch (e) { }
const t = modal.querySelector('#tf-iset-connect-title') ||
modal.querySelector('.tf-iset-connect-title') ||
modal.querySelector('.tf-iset-ok-title');
const msgEl = modal.querySelector('#tf-iset-connect-msg') ||
modal.querySelector('.tf-iset-connect-msg') ||
modal.querySelector('.tf-iset-ok-msg');
if (t)
t.textContent = (title && String(title).trim()) ? String(title).trim() : 'Sambungkan akun MetaTrader baru';
if (msgEl) {
const m = (message == null) ? '' : String(message);
const looksLikeHtml = /<\s*span\b|<\s*br\b|<\s*\/[a-z]/i.test(m);
if (looksLikeHtml) {
msgEl.innerHTML = m;
}
else {
msgEl.textContent = m;
}
}
try {
const btnNo = modal.querySelector('#tf-iset-connect-no');
const btnYes = modal.querySelector('#tf-iset-connect-yes');
if (btnNo)
btnNo.textContent = (typeof noLabel === 'string' && noLabel.trim()) ? noLabel.trim() : 'No';
if (btnYes)
btnYes.textContent = (typeof yesLabel === 'string' && yesLabel.trim()) ? yesLabel.trim() : 'Sambungkan';
}
catch (e) { }
window.__tf_iset_connect_action = (typeof onConnect === 'function') ? onConnect : null;
window.__tf_iset_connect_no_action = (typeof onNo === 'function') ? onNo : null;
modal.style.display = 'flex';
document.body.classList.add('tf-modal-open');
}
function tf_isignalUsers_hideConnectModal() {
const modal = document.getElementById('tf-iset-connect-modal');
if (!modal)
return;
modal.style.display = 'none';
try {
const btnNo = modal.querySelector('#tf-iset-connect-no');
const btnYes = modal.querySelector('#tf-iset-connect-yes');
if (btnNo)
btnNo.textContent = 'No';
if (btnYes)
btnYes.textContent = 'Sambungkan';
}
catch (e) { }
document.body.classList.remove('tf-modal-open');
window.__tf_iset_connect_action = null;
window.__tf_iset_connect_no_action = null;
}
function tf_isignalUsers_hideOkModal() {
const modal = document.getElementById('tf-iset-ok-modal');
if (!modal)
return;
modal.style.display = 'none';
document.body.classList.remove('tf-modal-open');
const btn = modal.querySelector('#tf-iset-ok-btn') ||
modal.querySelector('.tf-iset-ok-btn');
if (btn)
btn.textContent = 'OK';
window.__tf_iset_ok_action = null;
}
function tf_isignalUsers_bindSetLinks() {
if (window.__tf_isusers_setLinksBound)
return;
window.__tf_isusers_setLinksBound = true;
if (window.__tfIsUsersSetLinksBound)
return;
window.__tfIsUsersSetLinksBound = true;
function setStopUI(a, label) {
if (!a)
return;
if (!a.dataset.tfOrigText)
a.dataset.tfOrigText = a.textContent || '';
a.textContent = (label != null ? String(label) : 'Stop!');
a.classList.add('tf-isusers-stop-link');
a.setAttribute('aria-busy', 'true');
}
function restoreUI(a) {
if (!a)
return;
const t = a.dataset.tfOrigText;
if (typeof t === 'string')
a.textContent = t;
a.classList.remove('tf-isusers-stop-link');
a.removeAttribute('aria-busy');
delete a.dataset.tfOrigText;
delete a.dataset.tfJobToken;
}
function restoreAllByToken(tok) {
if (!tok)
return;
try {
const t = String(tok);
const nodes = document.querySelectorAll(`.tf-isusers-stop-link[data-tf-job-token="${t}"]`);
if (nodes && nodes.length) {
nodes.forEach((n) => restoreUI(n));
}
}
catch (e) {
}
}
function tf_isignalUsers_lockInteractions(lockToken, keepNodes) {
try {
const tok = String(lockToken || '');
const keep = new Set((keepNodes || []).filter(Boolean));
const nodes = Array.from(document.querySelectorAll('.tf-users-set-link, .tf-users-detail-set-link, .tf-users-detail-disconnect-link'));
nodes.forEach((n) => {
if (!n)
return;
if (keep.has(n))
return;
if (n.classList.contains('tf-isusers-stop-link'))
return;
n.classList.add('tf-users-link-disabled');
try {
n.setAttribute('data-tf-lock-token', tok);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_isignalUsers_unlockInteractions(lockToken) {
try {
const tok = String(lockToken || '');
if (!tok)
return;
const nodes = Array.from(document.querySelectorAll(`.tf-users-link-disabled[data-tf-lock-token="${tok}"]`));
nodes.forEach((n) => {
if (!n)
return;
n.classList.remove('tf-users-link-disabled');
try {
n.removeAttribute('data-tf-lock-token');
}
catch (e) { }
});
}
catch (e) { }
}
function getDetailSetLinks(pid, analyst) {
try {
const p = String(pid || '').trim();
const a = String(analyst || '').trim();
if (!p || !a)
return [];
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(p) : p;
const escA = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(a) : a;
return Array.from(document.querySelectorAll(`.tf-users-detail-set-link[data-platform-id="${escPid}"][data-analyst="${escA}"]`));
}
catch (e) {
return [];
}
}
document.addEventListener('click', (e) => {
const a = e.target.closest('.tf-users-detail-disconnect-link') ||
e.target.closest('.tf-users-set-link') ||
e.target.closest('.tf-users-detail-set-link');
if (!a)
return;
e.preventDefault();
const pid = (a.getAttribute('data-platform-id') || '').trim();
if (!pid)
return;
if (a.classList.contains('tf-users-detail-disconnect-link')) {
if (a.classList.contains('tf-users-link-disabled'))
return;
const analyst = (a.getAttribute('data-analyst') || '').trim();
const isId = (a.getAttribute('data-isignal-id') || '').trim();
if (!analyst || !isId)
return;
try {
const cfgNow = window.__tf_isignalUsersMgmtCfg || null;
const passNow = tf_isignalUsers_getPasswordForPid(pid, cfgNow);
if (!passNow) {
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi password di main row Metatrader ID (${pid}), lalu klik Disconnect lagi.`);
return;
}
}
catch (e) { }
const startDisconnectJob = () => {
const tokDisc = tf_isignalUsers_createJobToken('disconnect');
a.dataset.tfJobToken = tokDisc;
setStopUI(a, 'Stop!!');
try {
tf_isignalUsers_lockInteractions(tokDisc, [a]);
}
catch (e) { }
(async () => {
try {
if (tf_isignalUsers_isDisconnectJobCancelled(tokDisc))
return;
await tf_isignalUsers_startDisconnectFlowForAnalyst(pid, analyst, tokDisc);
}
catch (err) {
console.warn('[Fix205] Disconnect flow error:', err);
}
finally {
try {
tf_isignalUsers_clearDisconnectJob(tokDisc);
}
catch (e) { }
restoreAllByToken(tokDisc);
try {
tf_isignalUsers_unlockInteractions(tokDisc);
}
catch (e) { }
}
})();
};
try {
const safeName = escapeHtml(analyst);
tf_isignalUsers_showConnectModal('Konfirmasi Disconnect', `Apakah yakin ingin Disconnect akun untuk <b>${safeName}</b>?`, () => { try {
startDisconnectJob();
}
catch (e) { } }, () => { }, 'Yes', 'No');
}
catch (e) {
try {
if (confirm(`Disconnect akun untuk ${analyst}?`))
startDisconnectJob();
}
catch (e2) { }
}
return;
}
if (a.classList.contains('tf-isusers-stop-link') && a.dataset.tfJobToken) {
const tok = a.dataset.tfJobToken;
try {
if (String(tok).startsWith('disconnect_')) {
tf_isignalUsers_cancelDisconnectJob(tok);
}
else {
tf_isignalUsers_cancelSetJob(tok);
}
}
catch (e) { }
restoreAllByToken(tok);
try {
tf_isignalUsers_unlockInteractions(tok);
}
catch (e) { }
return;
}
const tok = tf_isignalUsers_createJobToken('set');
const isDetail = a.classList.contains('tf-users-detail-set-link');
const analystName = isDetail ? ((a.getAttribute('data-analyst') || '').trim()) : '';
const groupLinks = (isDetail && analystName) ? getDetailSetLinks(pid, analystName) : [a];
groupLinks.forEach((el) => {
try {
el.dataset.tfJobToken = tok;
}
catch (e) { }
setStopUI(el);
});
try {
tf_isignalUsers_lockInteractions(tok, groupLinks);
}
catch (e) { }
tf_isignalUsers_clearSetJob(tok);
(async () => {
try {
if (a.classList.contains('tf-users-set-link')) {
await tf_isignalUsers_startSetFlowForPlatform(pid, tok);
}
else if (a.classList.contains('tf-users-detail-set-link')) {
const analyst = (a.getAttribute('data-analyst') || '').trim();
if (!analyst)
return;
try {
const cfgNow = window.__tf_isignalUsersMgmtCfg || null;
const cdNow = (cfgNow && cfgNow.usersSetCooldown && cfgNow.usersSetCooldown[pid] && cfgNow.usersSetCooldown[pid][analyst])
? cfgNow.usersSetCooldown[pid][analyst]
: null;
const untilNow = cdNow && cdNow.until ? Number(cdNow.until) : null;
if (Number.isFinite(untilNow) && untilNow > Date.now()) {
try {
tf_isignalUsers_refreshSetCountdownUI(pid, analyst, cfgNow);
}
catch (e) { }
return;
}
}
catch (e) { }
await tf_isignalUsers_startSetFlowForAnalyst(pid, analyst, tok, false);
}
}
catch (err) {
console.warn('[Fix205] Set flow error:', err);
}
finally {
restoreAllByToken(tok);
try {
tf_isignalUsers_unlockInteractions(tok);
}
catch (e) { }
tf_isignalUsers_clearSetJob(tok);
}
})();
}, true);
}
function tf_isignalUsers_bindSetOverlayButtons() {
const root = document;
const btnClear = root.getElementById('tf-iset-progress-clear');
const btnOk = root.getElementById('tf-iset-ok-btn');
const btnConnNo = root.getElementById('tf-iset-connect-no');
const btnConnYes = root.getElementById('tf-iset-connect-yes');
if (!btnClear && !btnOk && !btnConnNo && !btnConnYes)
return;
if (btnClear && btnClear.dataset && btnClear.dataset.tfBoundClear !== '1') {
btnClear.dataset.tfBoundClear = '1';
btnClear.addEventListener('click', () => {
try {
const tbody = root.getElementById('tf-iset-progress-tbody');
if (tbody)
tbody.innerHTML = '';
const status = root.getElementById('tf-iset-progress-status');
if (status)
status.textContent = 'Idle.';
}
catch (e) { }
});
}
if (btnOk && btnOk.dataset && btnOk.dataset.tfBoundOk !== '1') {
btnOk.dataset.tfBoundOk = '1';
btnOk.addEventListener('click', () => {
const action = window.__tf_iset_ok_action;
tf_isignalUsers_hideOkModal();
if (typeof action === 'function') {
try {
action();
}
catch (e) { }
}
});
}
if (btnConnNo && btnConnNo.dataset && btnConnNo.dataset.tfBoundConnNo !== '1') {
btnConnNo.dataset.tfBoundConnNo = '1';
btnConnNo.addEventListener('click', () => {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
});
}
if (btnConnYes && btnConnYes.dataset && btnConnYes.dataset.tfBoundConnYes !== '1') {
btnConnYes.dataset.tfBoundConnYes = '1';
btnConnYes.addEventListener('click', () => {
const action = window.__tf_iset_connect_action;
tf_isignalUsers_hideConnectModal();
if (typeof action === 'function') {
try {
action();
}
catch (e) { }
}
});
}
try {
const modal = root.getElementById('tf-iset-ok-modal');
if (modal && !modal.dataset.tfBoundBackdrop) {
modal.dataset.tfBoundBackdrop = '1';
modal.addEventListener('click', (ev) => {
if (ev.target === modal)
tf_isignalUsers_hideOkModal();
});
root.addEventListener('keydown', (ev) => {
if (ev.key === 'Escape')
tf_isignalUsers_hideOkModal();
});
}
}
catch (e) { }
try {
const modal2 = root.getElementById('tf-iset-connect-modal');
if (modal2 && !modal2.dataset.tfBoundBackdrop) {
modal2.dataset.tfBoundBackdrop = '1';
modal2.addEventListener('click', (ev) => {
if (ev.target === modal2) {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
}
});
root.addEventListener('keydown', (ev) => {
if (ev.key === 'Escape') {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
}
});
}
}
catch (e) { }
}
function tf_isignalUsers_overlayAddLine(textLine) {
try {
const tbody = document.getElementById('tf-iset-progress-tbody');
if (!tbody)
return;
const tr = document.createElement('tr');
const tdTime = document.createElement('td');
tdTime.className = 'tf-iset-col-time';
const now = new Date();
const hh = String(now.getHours()).padStart(2, '0');
const mm = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
tdTime.textContent = `${hh}:${mm}:${ss}`;
const tdLog = document.createElement('td');
tdLog.className = 'tf-iset-col-log';
tdLog.textContent = String(textLine || '');
tr.appendChild(tdTime);
tr.appendChild(tdLog);
tbody.appendChild(tr);
const scroll = document.getElementById('tf-iset-progress-scroll');
if (scroll)
scroll.scrollTop = scroll.scrollHeight;
}
catch (e) { }
}
function tf_isignalUsers_overlaySetStatus(textLine) {
try {
const el = document.getElementById('tf-iset-progress-status');
if (!el)
return;
el.textContent = String(textLine || '');
}
catch (e) { }
}
function tf_isignalUsers_refreshSetBadges(platformId, analystName) {
try {
const pid = String(platformId || '');
const aName = String(analystName || '');
const badgeSel = `.tf-users-set-badge[data-platform-id="${CSS.escape(pid)}"][data-analyst="${CSS.escape(aName)}"]`;
const spinSel = `.tf-users-set-spinner[data-platform-id="${CSS.escape(pid)}"][data-analyst="${CSS.escape(aName)}"]`;
const badges = document.querySelectorAll(badgeSel);
const spins = document.querySelectorAll(spinSel);
if (!badges.length)
return;
const cfg = window.__tf_isignalUsersMgmtCfg || null;
badges.forEach((b, i) => {
const s = spins && spins[i] ? spins[i] : null;
tf_isignalUsers_applySetBadge(b, s, cfg, pid, aName);
});
}
catch (e) { }
}
async function tf_isignalUsers_loadMgmtCfg() {
try {
const stored = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY]);
const cfg = stored && stored[TF_ISIGNAL_USERS_MGMT_KEY] ? stored[TF_ISIGNAL_USERS_MGMT_KEY] : null;
return cfg && typeof cfg === 'object' ? cfg : {};
}
catch (e) {
return {};
}
}
async function tf_isignalUsers_saveMgmtCfg(cfg) {
try {
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: (cfg && typeof cfg === 'object') ? cfg : {} });
}
catch (e) { }
}
function tf_isignalUsers_getDomNumberForPid(pid, inputClass) {
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.${inputClass}[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.${inputClass}`) ||
document.querySelector(`input.${inputClass}[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.${inputClass}`);
if (inp && typeof inp.value !== 'undefined') {
const n = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.value) : Number(inp.value);
return (n != null && Number.isFinite(n) && n > 0) ? n : null;
}
}
catch (e) { }
return null;
}
function tf_isignalUsers_getBalanceForPid(pid, cfg) {
const domBal = tf_isignalUsers_getDomNumberForPid(pid, 'tf-users-balance-input');
if (domBal != null)
return domBal;
const n = (cfg && cfg.users && cfg.users[pid]) ? ((typeof tf_safeNumber === 'function') ? tf_safeNumber(cfg.users[pid].balance) : Number(cfg.users[pid].balance)) : null;
return (n != null && Number.isFinite(n) && n > 0) ? n : null;
}
function tf_isignalUsers_getRiskForPid(pid, cfg, fallbackRisk = 1) {
const domRisk = tf_isignalUsers_getDomNumberForPid(pid, 'tf-users-risk-input');
if (domRisk != null)
return domRisk;
const n = (cfg && cfg.users && cfg.users[pid]) ? ((typeof tf_safeNumber === 'function') ? tf_safeNumber(cfg.users[pid].risk) : Number(cfg.users[pid].risk)) : null;
if (n != null && Number.isFinite(n) && n > 0)
return n;
const fb = (typeof tf_safeNumber === 'function') ? tf_safeNumber(fallbackRisk) : Number(fallbackRisk);
return (fb != null && Number.isFinite(fb) && fb > 0) ? fb : 1;
}
function tf_isignalUsers_getAnalystRiskMapForPid(pid, cfg) {
const out = {};
try {
const base = (cfg && cfg.users && cfg.users[pid] && cfg.users[pid].analystRisk && typeof cfg.users[pid].analystRisk === 'object')
? cfg.users[pid].analystRisk
: {};
for (const [k, v] of Object.entries(base))
out[k] = v;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const detailScope = document.querySelector(`tr[data-platform-id="${escPid}"] + tr.tf-users-child-row`) ||
document.querySelector(`tr[data-platform-id="${pid}"] + tr.tf-users-child-row`);
if (detailScope) {
const inputs = detailScope.querySelectorAll('input.tf-users-detail-risk-input[data-entry-key]');
inputs.forEach(inp => {
const key = String(inp.dataset.entryKey || '').trim();
if (!key)
return;
const riskSource = (inp.dataset && inp.dataset.targetRisk) ? inp.dataset.targetRisk : inp.value;
const n = (typeof tf_isignalUsers_parseDecimal === 'function') ? tf_isignalUsers_parseDecimal(riskSource) : ((typeof tf_safeNumber === 'function') ? tf_safeNumber(riskSource) : Number(riskSource));
if (n != null && Number.isFinite(n) && n > 0)
out[key] = Math.round(n * 100) / 100;
else
delete out[key];
});
}
}
catch (e) { }
return out;
}
function tf_isignalUsers_getAnalystLotMapForPid(pid, cfg) {
const out = {};
try {
const base = (cfg && cfg.users && cfg.users[pid] && cfg.users[pid].analystLot && typeof cfg.users[pid].analystLot === 'object')
? cfg.users[pid].analystLot
: {};
for (const [k, v] of Object.entries(base))
out[k] = v;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const detailScope = document.querySelector(`tr[data-platform-id="${escPid}"] + tr.tf-users-child-row`) ||
document.querySelector(`tr[data-platform-id="${pid}"] + tr.tf-users-child-row`);
if (detailScope) {
const inputs = detailScope.querySelectorAll('input.tf-users-detail-lot-input[data-entry-key]');
inputs.forEach(inp => {
const key = String(inp.dataset.entryKey || '').trim();
if (!key)
return;
const n = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.value) : Number(inp.value);
const defaultLot = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.dataset.defaultLot) : Number(inp.dataset.defaultLot);
const isCustom = inp.dataset.customLot === '1';
if (isCustom && n != null && Number.isFinite(n) && n > 0 && !(defaultLot != null && Math.abs(n - defaultLot) < 0.0000001)) {
out[key] = n;
}
else {
delete out[key];
}
});
}
}
catch (e) { }
return out;
}
function tf_isignalUsers_buildAnalystEntries(platformId, cfg) {
try {
const pid = String(platformId || '');
if (!pid)
return [];
const meta = (window.__tfIsUsersAnalystMetaCache && window.__tfIsUsersAnalystMetaCache.ok)
? window.__tfIsUsersAnalystMetaCache
: null;
const baseEntries = meta && Array.isArray(meta.entries) ? meta.entries : [];
const srcEntries = (Array.isArray(baseEntries) && baseEntries.length)
? baseEntries
: (Array.isArray(window.ANALYSTS)
? window.ANALYSTS.map(a => ({ baseName: a && a.baseName ? String(a.baseName) : '', pair: a && a.pair ? String(a.pair).toUpperCase() : '' }))
: []);
const balance = tf_isignalUsers_getBalanceForPid(pid, cfg);
const accountRisk = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
const analystRiskMap = tf_isignalUsers_getAnalystRiskMapForPid(pid, cfg);
const analystLotMap = tf_isignalUsers_getAnalystLotMapForPid(pid, cfg);
const out = [];
for (const e of (srcEntries || [])) {
if (!e)
continue;
const baseName = String(e.baseName || '').trim();
const pair = String(e.pair || '').trim().toUpperCase();
if (!baseName || !pair)
continue;
const key = `${baseName}||${pair}`;
const overrideRisk = (typeof tf_safeNumber === 'function') ? tf_safeNumber(analystRiskMap[key]) : null;
const risk = (overrideRisk != null && overrideRisk > 0) ? overrideRisk : accountRisk;
const sl = (e.effectiveSlPips != null && Number.isFinite(e.effectiveSlPips) && e.effectiveSlPips > 0) ? e.effectiveSlPips : null;
const dpp = (e.dollarPerPip != null && Number.isFinite(e.dollarPerPip) && e.dollarPerPip > 0) ? e.dollarPerPip : null;
let defaultLotSize = null;
if (balance != null && sl && dpp && typeof computeLot === 'function') {
const rawLot = computeLot(balance, risk, sl, dpp);
const lot = (typeof roundLotToTwoDecimals === 'function') ? roundLotToTwoDecimals(rawLot) : rawLot;
if (Number.isFinite(lot) && lot > 0)
defaultLotSize = lot;
}
const overrideLot = (typeof tf_safeNumber === 'function') ? tf_safeNumber(analystLotMap[key]) : Number(analystLotMap[key]);
const lotSize = (overrideLot != null && Number.isFinite(overrideLot) && overrideLot > 0)
? overrideLot
: defaultLotSize;
if (lotSize == null)
continue;
out.push({ baseName, pair, lotSize });
}
return out;
}
catch (e) {
return [];
}
}
function tf_isignalUsers_getSetJobMap() {
if (!window.__tfIsUsersSetJobMap)
window.__tfIsUsersSetJobMap = {};
return window.__tfIsUsersSetJobMap;
}
function tf_isignalUsers_createJobToken(prefix = 'job') {
const r = Math.random().toString(16).slice(2);
return `${prefix}_${Date.now()}_${r}`;
}
function tf_isignalUsers_cancelSetJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getSetJobMap();
if (!map[token])
map[token] = { cancelled: true };
map[token].cancelled = true;
try {
chrome.runtime.sendMessage({ type: 'tf_isignal_users_set_cancel', jobToken: String(token) });
}
catch (e) { }
}
function tf_isignalUsers_getDisconnectJobMap() {
if (!window.__tf_isusers_disconnectJobMap)
window.__tf_isusers_disconnectJobMap = {};
return window.__tf_isusers_disconnectJobMap;
}
function tf_isignalUsers_cancelDisconnectJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getDisconnectJobMap();
if (!map[token])
map[token] = { cancelled: true };
map[token].cancelled = true;
try {
chrome.runtime.sendMessage({ type: 'tf_isignal_users_disconnect_cancel', jobToken: String(token) });
}
catch (e) { }
}
function tf_isignalUsers_isDisconnectJobCancelled(token) {
if (!token)
return false;
const map = tf_isignalUsers_getDisconnectJobMap();
return !!(map[token] && map[token].cancelled);
}
function tf_isignalUsers_clearDisconnectJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getDisconnectJobMap();
try {
delete map[token];
}
catch (e) {
map[token] = null;
}
}
function tf_isignalUsers_isSetJobCancelled(token) {
if (!token)
return false;
const map = tf_isignalUsers_getSetJobMap();
return !!(map[token] && map[token].cancelled);
}
function tf_isignalUsers_clearSetJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getSetJobMap();
try {
delete map[token];
}
catch (e) {
map[token] = null;
}
}
function tf_isignalUsers_collectPairsLotsForAnalyst(platformId, analystName, cfg) {
const entries = tf_isignalUsers_buildAnalystEntries(platformId, cfg) || [];
const map = {};
for (const e of entries) {
if (!e || String(e.baseName || '') !== String(analystName || ''))
continue;
const pair = String(e.pair || '').trim();
if (!pair)
continue;
const lot = (e.lotSize != null) ? String(e.lotSize) : '';
map[pair] = lot;
}
const out = [];
for (const [pair, lot] of Object.entries(map)) {
const v = (lot ?? '').toString().trim();
if (!v)
continue;
out.push({ pair, lot: v });
}
return out;
}
async function tf_isignalUsers_startSetFlowForAnalyst(platformId, analystName, jobToken = null, isBatch = false) {
const pid = String(platformId || '');
const aName = String(analystName || '');
if (!pid || !aName)
return;
if (tf_isignalUsers_isSetJobCancelled(jobToken))
return;
tf_isignalUsers_showSetOverlay();
tf_isignalUsers_overlaySetStatus(`Setting lot untuk ${aName}...`);
tf_isignalUsers_overlayAddLine(`[Mulai] ${aName}`);
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
if (!cfg.usersSetStatus || typeof cfg.usersSetStatus !== 'object')
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid] || typeof cfg.usersSetStatus[pid] !== 'object')
cfg.usersSetStatus[pid] = {};
try {
const isignalIdTmp = (typeof tf_isignalUsers_getIsignalIdByName === 'function')
? String(tf_isignalUsers_getIsignalIdByName(aName) || '').trim()
: '';
if (!isignalIdTmp) {
const reasonNF = 'Nama analis tidak ditemukan di tabel Analis di iSignal.';
if (isBatch) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: `Skip: ${reasonNF}`, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - ${reasonNF}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (analis tidak ditemukan).');
}
catch (e) { }
return;
}
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: reasonNF, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - ${reasonNF}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: analis tidak ditemukan.');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Nama analis tidak ditemukan', `${reasonNF}\n\nSilakan Refresh / Update daftar analis iSignal, lalu coba lagi.`);
}
catch (e) { }
return;
}
}
catch (e) { }
function tf_isignalUsers_getPasswordForPid(pid, cfg) {
let v = '';
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp && typeof inp.value === 'string') {
v = inp.value.trim();
}
}
catch (e) { }
v = (v || '').trim();
if (v)
return v;
v = (cfg && cfg.users && cfg.users[pid] && typeof cfg.users[pid].password === 'string')
? String(cfg.users[pid].password).trim()
: '';
return (v || '').trim();
}
const pass = tf_isignalUsers_getPasswordForPid(pid, cfg);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
cfg.users[pid].password = pass;
if (!pass) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Password kosong (isi di main row Metatrader ID)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Password kosong`);
tf_isignalUsers_overlaySetStatus('Fail: Password kosong');
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi password di main row Metatrader ID (${pid}), lalu klik Set lagi.`);
return;
}
const balNow = tf_isignalUsers_getBalanceForPid(pid, cfg);
const riskNow = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
if (balNow != null)
cfg.users[pid].balance = balNow;
cfg.users[pid].risk = riskNow;
if (!balNow) {
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Balance kosong (isi di main row Metatrader ID)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Balance kosong`);
tf_isignalUsers_overlaySetStatus('Fail: Balance kosong');
tf_isignalUsers_showOkModal('Balance belum diisi', `Silakan isi Balance di main row Metatrader ID (${pid}), lalu klik Set lagi.`);
return;
}
const pairsLots = tf_isignalUsers_collectPairsLotsForAnalyst(pid, aName, cfg);
if (!pairsLots || (Array.isArray(pairsLots) ? pairsLots.length === 0 : Object.keys(pairsLots).length === 0)) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Tidak ada pair yang dipilih / tidak ada Lot Size', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[Gagal] ${aName} - Tidak ada pair`);
tf_isignalUsers_overlaySetStatus('Gagal: Tidak ada pair');
return;
}
cfg.usersSetStatus[pid][aName] = { status: 'running', reason: 'Sedang proses...', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
let resp = null;
let __pwdNotFoundRetry = 0;
while (true) {
if (tf_isignalUsers_isSetJobCancelled(jobToken)) {
resp = { ok: false, code: 'CANCELLED', reason: 'Job cancelled' };
break;
}
resp = await chrome.runtime.sendMessage({
type: 'tf_isignal_users_set_apply',
jobToken: jobToken ? String(jobToken) : '',
platformId: pid,
mtId: pid,
analystName: aName,
analystUrl: tf_isignalUsers_getIsignalUrlByName(aName) || '',
pairsLots,
password: pass
});
const __okTmp = !!(resp && resp.ok);
const __codeTmp = resp && resp.code ? String(resp.code) : '';
if (!__okTmp && __codeTmp === 'PASSWORD_PAGE_NOT_FOUND') {
__pwdNotFoundRetry++;
try {
tf_isignalUsers_overlayAddLine(`[RETRY] ${aName} - Password page not found (${__pwdNotFoundRetry})`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus(`Retry ${__pwdNotFoundRetry}: Password page not found...`);
}
catch (e) { }
await new Promise((r) => setTimeout(r, 900));
continue;
}
break;
}
const ok = resp && resp.ok;
const code = resp && resp.code ? String(resp.code) : '';
const reason = resp && resp.reason ? String(resp.reason) : (ok ? 'OK' : 'Gagal');
if (tf_isignalUsers_isSetJobCancelled(jobToken) || code === 'CANCELLED') {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Cancelled', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[CANCEL] ${aName} - Cancelled`);
tf_isignalUsers_overlaySetStatus('Cancelled.');
return;
}
if (!ok && code === 'PASSWORD_INVALID') {
const msg = `Tidak dapat menyambungkan ke MT4 atau salah password.
Silakan perbaiki password di kolom Password (main row Metatrader ID), lalu klik Try Again.`;
tf_isignalUsers_showOkModal('Password salah', msg, 'Try Again!', () => {
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp) {
try {
inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
catch (e) {
try {
inp.scrollIntoView(true);
}
catch (e2) { }
}
try {
inp.focus();
}
catch (e) { }
try {
inp.select();
}
catch (e) { }
const prev = inp.style.boxShadow;
inp.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 0.9), 0 0 0 6px rgba(248, 113, 113, 0.18)';
setTimeout(() => {
try {
inp.style.boxShadow = prev || '';
}
catch (e) { }
}, 1600);
}
}
catch (e) { }
});
}
if (!ok && code === 'ACCOUNT_DISCONNECT') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: Akun Disconnect', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - Akun Disconnect`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (Akun Disconnect).');
}
catch (e) { }
return;
}
const title = 'Akun Disconnect';
const msg = 'Akun Disconnect, Tolong Sambungkan kembali...';
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[DISCONNECT] ${aName} - Akun Disconnect`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Akun Disconnect (butuh reconnect).');
}
catch (e) { }
const runReconnect = async () => {
try {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
tf_isignalUsers_overlayAddLine(`[RECONNECT] Membuka halaman ${aName}...`);
}
catch (e) { }
const res2 = await chrome.runtime.sendMessage({
type: 'tf_open_isignal_reconnect_and_set',
url,
activate: false,
mtId: pid,
pairsLots,
password: pass
});
const ok2 = !!(res2 && res2.ok);
const reason2 = ok2
? (res2 && res2.reason ? String(res2.reason) : 'Akun MetaTrader berhasil disambungkan kembali')
: (res2 && (res2.error || res2.reason || res2.code) ? String(res2.error || res2.reason || res2.code) : 'Gagal reconnect');
if (ok2) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'ok', reason: 'Akun berhasil disambungkan kembali', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[OK] ${aName} - ${reason2}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Reconnect sukses.');
}
catch (e) { }
}
else {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: reason2, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - ${reason2}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Reconnect gagal.');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Reconnect gagal', reason2 || 'Gagal reconnect');
}
catch (e) { }
}
}
catch (e) {
const err = String(e && e.message ? e.message : e);
try {
tf_isignalUsers_showOkModal('Reconnect gagal', err);
}
catch (x) { }
}
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => { try {
await runReconnect();
}
catch (e) { } resolve(true); };
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (Akun Disconnect)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Akun Disconnect)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Sambungkan Kembali...', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void runReconnect(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (Akun Disconnect)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Akun Disconnect)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Sambungkan Kembali...', 'No');
}
return;
}
if (!ok && code === 'EQUITY_NOT_ENOUGH') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: Equity tidak mencukupi', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - Equity tidak mencukupi`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (Equity tidak mencukupi).');
}
catch (e) { }
return;
}
const title = 'Equity tidak mencukupi';
const msg = 'Equity tidak mencukupi, Apakah ingin melakukan Deposit?';
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[EQUITY] ${aName} - Equity tidak mencukupi`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Equity tidak mencukupi (butuh deposit).');
}
catch (e) { }
const runDeposit = async () => {
try {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
tf_isignalUsers_overlayAddLine(`[DEPOSIT] Membuka halaman ${aName}...`);
}
catch (e) { }
const res2 = await chrome.runtime.sendMessage({
type: 'tf_open_isignal_deposit_and_select',
url,
activate: false,
mtId: pid
});
const ok2 = !!(res2 && res2.ok);
const detail = res2 && res2.detail ? res2.detail : null;
const selected = !!(detail && detail.selected);
const clicked = !!(detail && detail.clickedDeposit);
try {
const extra = `${clicked ? 'deposit-click OK' : 'deposit-click ?'}${selected ? ', MTID selected' : ', MTID not selected'}`;
tf_isignalUsers_overlayAddLine(`[DEPOSIT] ${aName} - ${extra}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Deposit dibuka. Lanjut analis berikutnya...');
}
catch (e) { }
}
catch (e) {
const err = String(e && e.message ? e.message : e);
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Deposit error: ${err}`);
}
catch (x) { }
if (!isBatch) {
try {
tf_isignalUsers_showOkModal('Deposit gagal', err);
}
catch (x2) { }
}
}
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => { try {
await runDeposit();
}
catch (e) { } resolve(true); };
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (Equity tidak mencukupi)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Equity tidak mencukupi)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Deposit', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void runDeposit(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (Equity tidak mencukupi)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Equity tidak mencukupi)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Deposit', 'No');
}
return;
}
if (!ok && code === 'MTID_NOT_FOUND') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: MTID tidak ditemukan', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - MTID tidak ditemukan di card MetaTrader`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (MTID tidak ditemukan).');
}
catch (e) { }
return;
}
const title = 'Sambungkan akun MetaTrader baru';
const red = (w) => `<span style="color:#ef4444;font-weight:700;">${w}</span>`;
const msg = `MetaTrader ID #${pid} tidak ditemukan di card MetaTrader (halaman iSignal).<br><br>` +
`Klik "Sambungkan" untuk membuka halaman analis di tab baru, lalu sambungkan akun MetaTrader secara (${red('Manual')}) (Input Lot Size Manual). ` +
`Setelah itu jika diharuskan (${red('bayar')}) iSignal, tolong selesaikan pembayaran, dan setelah berhasil, ${red('tidak perlu')} klik Set/Set ALL di Table Users and Management.`;
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
const openConnectTab = async () => {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
const res = await chrome.runtime.sendMessage({ type: 'tf_open_isignal_connect_account', url, activate: false });
if (res && res.ok)
return res;
}
}
catch (e) { }
try {
if (chrome && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: false });
}
else {
window.open(url, '_blank');
}
}
catch (e2) {
try {
window.open(url, '_blank');
}
catch (e3) { }
}
return null;
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => {
let r = null;
try {
r = await openConnectTab();
}
catch (e) { }
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
try {
delete cfg.usersSetStatus[pid][aName];
}
catch (e) { }
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
const clicked = r && r.clicked ? ' (auto-click OK)' : '';
tf_isignalUsers_overlayAddLine(`[MANUAL] ${aName} - Buka tab analis${clicked}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Manual connect dibuka. Lanjut analis berikutnya...');
}
catch (e) { }
resolve(true);
};
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (MTID tidak ditemukan)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (MTID tidak ditemukan)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Sambungkan', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void openConnectTab(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (MTID tidak ditemukan)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (MTID tidak ditemukan)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Sambungkan', 'No');
}
return;
}
const pop = resp && resp.popup ? resp.popup : null;
const codeU = (code || '').toUpperCase();
const popMsg = (pop && (pop.message || pop.text || pop.reason)) ? String(pop.message || pop.text || pop.reason) : '';
const isCooldown = !!((pop && pop.type === 'cooldown' && String(popMsg).trim()) ||
codeU.startsWith('COOLDOWN_') ||
(reason && /menunggu\s*5\s*menit/i.test(String(reason))));
if (isCooldown) {
const msg = String(popMsg || reason || '').trim();
const totalMs = 5 * 60 * 1000;
if (!cfg.usersSetCooldown || typeof cfg.usersSetCooldown !== 'object')
cfg.usersSetCooldown = {};
if (!cfg.usersSetCooldown[pid] || typeof cfg.usersSetCooldown[pid] !== 'object')
cfg.usersSetCooldown[pid] = {};
let until = Date.now() + totalMs;
try {
const prev = cfg.usersSetCooldown[pid][aName];
const prevUntil = prev && prev.until ? Number(prev.until) : null;
if (Number.isFinite(prevUntil) && prevUntil > Date.now())
until = prevUntil;
}
catch (e) { }
cfg.usersSetCooldown[pid][aName] = {
until,
totalMs,
reason: msg || 'Anda harus menunggu 5 menit untuk melakukan perubahan lainnya',
updatedAt: Date.now()
};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: msg || 'Cooldown 5 menit', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
try {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
if (msg) {
if (!isBatch) {
try {
tf_isignalUsers_showOkModal(pop && pop.title ? pop.title : 'Info', msg, pop && pop.buttonLabel ? pop.buttonLabel : 'OK');
}
catch (e) { }
}
else {
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - ${msg}`);
}
catch (e) { }
}
}
tf_isignalUsers_overlayAddLine(`[COOLDOWN] ${aName} - ${msg || reason}`);
tf_isignalUsers_overlaySetStatus('Cooldown 5 menit (skip)...');
return;
}
cfg.usersSetStatus[pid][aName] = { status: ok ? 'ok' : 'fail', reason, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
const tag = (ok && code === 'SKIP_SAME_LOT') ? '[SKIP]' : (ok ? '[OK]' : '[FAIL]');
tf_isignalUsers_overlayAddLine(`${tag} ${aName} - ${reason}`);
tf_isignalUsers_overlaySetStatus(ok ? 'Selesai.' : 'Selesai dengan error.');
}
async function tf_isignalUsers_startDisconnectFlowForAnalyst(platformId, analystName, jobToken = null) {
const pid = String(platformId || '');
const aName = String(analystName || '').trim();
if (!pid || !aName)
return;
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken))
return;
try {
tf_isignalUsers_showSetOverlay();
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus(`Disconnect akun untuk ${aName}...`);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[Mulai] Disconnect - ${aName}`);
}
catch (e) { }
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
let pass = '';
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp && typeof inp.value === 'string')
pass = inp.value.trim();
}
catch (e) { }
pass = (pass || '').trim();
if (!pass) {
try {
pass = (cfg && cfg.users && cfg.users[pid] && typeof cfg.users[pid].password === 'string')
? String(cfg.users[pid].password).trim()
: '';
}
catch (e) {
pass = '';
}
}
if (!pass) {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Password kosong`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: Password kosong');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi Password di main row Metatrader ID (${pid}), lalu coba Disconnect lagi.`);
}
catch (e) { }
return;
}
try {
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
cfg.users[pid].password = pass;
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
catch (e) { }
const url = (typeof tf_isignalUsers_getIsignalUrlByName === 'function')
? (tf_isignalUsers_getIsignalUrlByName(aName) || '')
: '';
if (!url) {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Link analis kosong`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: Link analis kosong');
}
catch (e) { }
return;
}
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken))
return;
const resp = await chrome.runtime.sendMessage({
type: 'tf_isignal_users_disconnect_apply',
jobToken: jobToken ? String(jobToken) : '',
platformId: pid,
mtId: pid,
analystName: aName,
analystUrl: url,
password: pass
});
const ok = resp && resp.ok;
const code = resp && resp.code ? String(resp.code) : '';
const reason = resp && resp.reason ? String(resp.reason) : (ok ? 'OK' : 'Gagal');
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken)) {
try {
tf_isignalUsers_overlayAddLine(`[CANCEL] Disconnect - ${aName}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Stopped.');
}
catch (e) { }
return;
}
if (ok) {
try {
tf_isignalUsers_overlayAddLine(`[OK] Disconnect - ${aName}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Disconnect OK');
}
catch (e) { }
}
else {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] Disconnect - ${aName} (${code}) - ${reason}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Disconnect FAIL');
}
catch (e) { }
try {
if (resp && resp.popup && resp.popup.title) {
tf_isignalUsers_showOkModal(resp.popup.title, resp.popup.message || reason, resp.popup.buttonLabel || 'OK');
}
}
catch (e) { }
}
}
async function tf_isignalUsers_startSetFlowForPlatform(platformId, jobToken = null, uniqOverride = null) {
const pid = String(platformId || '');
if (!pid)
return;
if (tf_isignalUsers_isSetJobCancelled(jobToken))
return;
tf_isignalUsers_showSetOverlay();
tf_isignalUsers_overlaySetStatus('Setting lot untuk semua pair/analis...');
tf_isignalUsers_overlayAddLine(`[Mulai] Platform ${pid}`);
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
const balNow = tf_isignalUsers_getBalanceForPid(pid, cfg);
const riskNow = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
if (balNow != null)
cfg.users[pid].balance = balNow;
cfg.users[pid].risk = riskNow;
if (!balNow) {
tf_isignalUsers_overlayAddLine('[FAIL] Balance kosong - isi Balance di main row Metatrader ID.');
tf_isignalUsers_overlaySetStatus('Fail: Balance kosong');
tf_isignalUsers_showOkModal('Balance belum diisi', `Silakan isi Balance di main row Metatrader ID (${pid}), lalu klik Set ALL lagi.`);
try {
await tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
window.__tf_isignalUsersMgmtCfg = cfg;
return;
}
const entries = tf_isignalUsers_buildAnalystEntries(pid, cfg) || [];
const uniq = Array.isArray(uniqOverride) && uniqOverride.length
? uniqOverride.map(x => String(x)).filter(Boolean)
: (() => {
const u = [];
for (const x of entries) {
const n = x && x.baseName ? String(x.baseName) : '';
if (!n)
continue;
if (!u.includes(n))
u.push(n);
}
return u;
})();
if (!uniq.length) {
tf_isignalUsers_overlayAddLine('[WARN] No analysts found to set.');
tf_isignalUsers_overlaySetStatus('Tidak ada analis untuk di-set.');
return;
}
tf_isignalUsers_overlayAddLine(`[INFO] Running Set ALL for ${uniq.length} analyst(s) ...`);
for (const aName of uniq) {
if (tf_isignalUsers_isSetJobCancelled(jobToken)) {
tf_isignalUsers_overlayAddLine('[CANCEL] Stopped by user.');
tf_isignalUsers_overlaySetStatus('Stopped.');
return;
}
await tf_isignalUsers_startSetFlowForAnalyst(pid, aName, jobToken, true);
await new Promise((r) => setTimeout(r, 0));
}
tf_isignalUsers_overlayAddLine('[Selesai] Semua proses selesai.');
tf_isignalUsers_overlaySetStatus('Done!');
}
async function tf_isignalUsers_initPage() {
const table = document.getElementById('tf-users-mgmt-table');
if (!table)
return;
const loader = document.getElementById('tf-users-mgmt-loader');
const errBox = document.getElementById('tf-users-mgmt-error');
const showLoading = (on) => {
if (!loader)
return;
loader.style.display = on ? 'flex' : 'none';
};
const showError = (msg) => {
if (!errBox)
return;
errBox.textContent = String(msg || '');
errBox.style.display = msg ? 'block' : 'none';
};
showError('');
showLoading(true);
try {
tf_isignalUsers_bindSetOverlayButtons();
}
catch (e) { }
try {
tf_isignalUsers_bindSetLinks();
}
catch (e) { }
const profileData = await tf_storageLocalGet(['tfUserProfile', 'tfLoginConfirmed', 'tfAccountLoginState', 'tfRootLoginState', 'tfEnteredMain']);
const profile = profileData ? profileData.tfUserProfile : null;
const statusText = profile && profile.statusText ? String(profile.statusText) : '';
const profileOnline = !!(profile && statusText && !/offline|belum login|not\s*logged/i.test(statusText));
const accountState = String(profileData && profileData.tfAccountLoginState || '').trim().toLowerCase();
const rootState = String(profileData && profileData.tfRootLoginState || '').trim().toLowerCase();
const storageOnline = !!(profileData && (profileData.tfLoginConfirmed === true || profileData.tfEnteredMain === true)) || /logged[_ -]?in|online/.test(accountState) || /logged[_ -]?in|online/.test(rootState);
const isOnline = profileOnline || storageOnline;
// Jangan mengunci halaman hanya karena status login lokal belum sempat tersinkron.
// Pemeriksaan login yang sebenarnya dilakukan langsung oleh background saat membuka
// halaman account.tradersfamily.id. Dengan begitu data Dashboard tetap dapat dibaca
// dan tabel tidak kosong hanya karena tfUserProfile belum tersedia.
try {
document.documentElement.dataset.tfISignalUsersLocalLogin = isOnline ? 'online' : 'unknown';
}
catch (e) { }
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
try {
setTimeout(() => { tf_isignalUsers_startActiveChannelsScan(); }, 30);
}
catch (e) { }
if (!window.__tfIsUsersPassEyeBound) {
window.__tfIsUsersPassEyeBound = true;
document.addEventListener('click', (e) => {
const btn = e.target && e.target.closest ? e.target.closest('.tf-pass-eye') : null;
if (!btn)
return;
const wrap = btn.closest('.tf-pass-wrap');
const inp = wrap ? wrap.querySelector('input') : null;
if (!inp)
return;
const willReveal = String(inp.type) === 'password';
inp.type = willReveal ? 'text' : 'password';
btn.setAttribute('aria-pressed', willReveal ? 'true' : 'false');
if (wrap)
wrap.classList.toggle('is-revealed', willReveal);
});
}
function tf_isignalUsers_patchSubscriptionCell(analystName, value, loading) {
try {
const targetKey = tf_isignalUsers_normName(analystName || '');
if (!targetKey) return;
document.querySelectorAll('.tf-isignal-subend[data-analyst]').forEach((span) => {
const key = tf_isignalUsers_normName(span.getAttribute('data-analyst') || '');
if (key !== targetKey) return;
span.classList.toggle('tf-isusers-sub-loading', !!loading);
if (loading) span.innerHTML = tf_spinnerHTML(true);
else tf_applySubscription412(span, value ? String(value) : '—');
});
}
catch (e) { }
}
if (!window.__tfIsUsersSubProgressBound) {
window.__tfIsUsersSubProgressBound = true;
chrome.runtime.onMessage.addListener((msg) => {
try {
if (!msg || msg.type !== 'tf_isignal_sub_end_progress')
return;
const id = String(msg.isignalId || '').trim();
if (!id)
return;
if (id === '__DONE__') {
__tfIsUsersVerifyState.subScanDone = true;
if (Array.isArray(__tfIsUsersVerifyState.channels)) {
__tfIsUsersVerifyState.channels.forEach((c) => {
if (!c) return;
const subRaw = (c.subscriptionEndOn || '').toString().trim();
const sub = (subRaw === '-' || subRaw === '—') ? '' : subRaw;
if (!sub) c.subscriptionLoading = false;
tf_isignalUsers_patchSubscriptionCell(c.name || '', sub, false);
});
}
return;
}
const itemDone = !!msg.done;
const endOnRaw = msg.subscriptionEndOn ? String(msg.subscriptionEndOn).trim() : '';
const endOn = (endOnRaw === '-' || endOnRaw === '—') ? '' : endOnRaw;
const arr = __tfIsUsersVerifyState.channels || [];
const idx = arr.findIndex((x) => x && String(x.isignalId || '').trim() === id);
if (idx >= 0) {
if (endOn) {
arr[idx].subscriptionEndOn = endOn;
arr[idx].subscriptionLoading = false;
}
else if (itemDone) {
arr[idx].subscriptionEndOn = '';
arr[idx].subscriptionLoading = false;
}
else {
arr[idx].subscriptionLoading = true;
}
__tfIsUsersVerifyState.channels = arr;
try {
__tfIsUsersVerifyState.map = tf_isignalUsers_buildActiveMap(arr);
}
catch (e) { }
}
if (idx >= 0) {
const row = arr[idx] || {};
const rowSub = row.subscriptionEndOn ? String(row.subscriptionEndOn).trim() : '';
tf_isignalUsers_patchSubscriptionCell(row.name || '', rowSub, !!row.subscriptionLoading);
}
}
catch (e) { }
});
}
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
const defaultBalance = (typeof currentBalance !== 'undefined' && tf_isFiniteNumber(currentBalance) && currentBalance > 0) ? currentBalance : 5000;
const defaultRisk = (typeof currentRiskPercent !== 'undefined' && tf_isFiniteNumber(currentRiskPercent) && currentRiskPercent > 0) ? currentRiskPercent : 1;
const stored = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY, 'tfIsignalUsersPlatformIds']);
let cfg = stored && stored[TF_ISIGNAL_USERS_MGMT_KEY] ? stored[TF_ISIGNAL_USERS_MGMT_KEY] : null;
if (!cfg || typeof cfg !== 'object')
cfg = { version: 1, users: {}, platformIds: [], fetchedAt: 0, updatedAt: 0 };
if (!cfg.users || typeof cfg.users !== 'object')
cfg.users = {};
try {
tf_isignalUsers_migrateLegacyCooldownStatus(cfg);
}
catch (e) { }
try {
window.__tf_isignalUsersMgmtCfg = cfg;
}
catch (e) { }
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }

// Baca data analis dari key yang sama dengan dashboard.html terlebih dahulu.
// Ini memastikan tabel detail tetap terisi walaupun pemeriksaan Platform ID sedang
// lambat, Cloudflare muncul, atau status login lokal belum tersimpan.
__tfIsUsersAnalystMetaCache = null;
const meta = await tf_isignalUsers_prepareAnalystMeta();
const analystEntries = (meta && meta.ok && Array.isArray(meta.entries)) ? meta.entries : [];

const cachedPlatformIds = [];
const addCachedPlatformId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !cachedPlatformIds.includes(id))
cachedPlatformIds.push(id);
};
try {
(Array.isArray(stored && stored.tfIsignalUsersPlatformIds) ? stored.tfIsignalUsersPlatformIds : []).forEach(addCachedPlatformId);
}
catch (e) { }
try {
(Array.isArray(cfg.platformIds) ? cfg.platformIds : []).forEach(addCachedPlatformId);
}
catch (e) { }
try {
Object.keys(cfg.users || {}).forEach(addCachedPlatformId);
}
catch (e) { }

// Tampilkan cache lebih dulu. Pengambilan data live dapat tertahan Cloudflare,
// jadi halaman tidak boleh terlihat kosong selama tab background masih memuat.
let platformIds = cachedPlatformIds.slice();
platformIds.forEach((pid) => {
const id = String(pid);
if (!cfg.users[id])
cfg.users[id] = { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
});
tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk);

let resp = null;
try {
resp = await tf_isignalUsers_fetchPlatformIds();
}
catch (e) {
resp = { ok: false, error: String(e && e.message ? e.message : e) };
}

if (resp && resp.ok && resp.profile) {
try { loadUserProfileIntoDashboard(); } catch (e) { }
}
if (resp && resp.ok && Array.isArray(resp.platformIds)) {
const liveIds = resp.platformIds.map((x) => String(x || '').trim()).filter(Boolean);
platformIds = liveIds.length ? Array.from(new Set(liveIds)) : cachedPlatformIds.slice();
}
else {
platformIds = cachedPlatformIds.slice();
}

let platformWarning = '';
if (!resp || !resp.ok) {
const err = resp && resp.error ? String(resp.error) : 'Gagal mengambil Platform ID.';
platformWarning = err === 'NOT_LOGGED_IN'
? 'Login account.tradersfamily.id belum terdeteksi. Data Dashboard dan Platform ID tersimpan tetap ditampilkan.'
: `Platform ID live belum dapat diperbarui: ${err}. Data tersimpan tetap ditampilkan.`;
}
else if (!Array.isArray(resp.platformIds) || !resp.platformIds.length) {
platformWarning = cachedPlatformIds.length
? 'Server tidak mengembalikan Platform ID baru. Data Platform ID tersimpan tetap digunakan.'
: 'Belum ada Platform ID MetaTrader yang ditemukan pada akun ini.';
}

cfg.platformIds = platformIds;
if (resp && resp.ok)
cfg.fetchedAt = Date.now();
cfg.updatedAt = Date.now();
platformIds.forEach((pid) => {
const id = String(pid);
if (!cfg.users[id])
cfg.users[id] = { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
if (!cfg.users[id].analystRisk || typeof cfg.users[id].analystRisk !== 'object')
cfg.users[id].analystRisk = {};
if (!cfg.users[id].analystLot || typeof cfg.users[id].analystLot !== 'object')
cfg.users[id].analystLot = {};
});
await tf_storageLocalSet({
[TF_ISIGNAL_USERS_MGMT_KEY]: cfg,
tfIsignalUsersPlatformIds: platformIds
});
window.__tf_isignalUsersMgmtCfg = cfg;

tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk);

if (!meta || !meta.ok) {
const metaMessage = meta && meta.error ? String(meta.error) : 'Belum ada data analis dari dashboard.';
showError(platformWarning ? `${metaMessage} ${platformWarning}` : metaMessage);
}
else if (platformWarning) {
showError(platformWarning);
}
else {
showError('');
}

// Sinkronkan perubahan hasil scan/import dari dashboard.html tanpa perlu menutup
// iSignalUsers.html. Debounce mencegah render berulang ketika banyak key disimpan
// dalam satu proses scan.
if (!window.__tfIsignalDashboardStorageSyncBound) {
window.__tfIsignalDashboardStorageSyncBound = true;
let syncTimer = null;
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local' || !changes)
return;
const watched = ['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips', TF_MYFXBOOK_PRICES_KEY];
if (!watched.some((key) => changes[key]))
return;
clearTimeout(syncTimer);
syncTimer = setTimeout(async () => {
try {
__tfIsUsersAnalystMetaCache = null;
const fresh = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY, 'tfIsignalUsersPlatformIds']);
const freshCfg = fresh && fresh[TF_ISIGNAL_USERS_MGMT_KEY] && typeof fresh[TF_ISIGNAL_USERS_MGMT_KEY] === 'object'
? fresh[TF_ISIGNAL_USERS_MGMT_KEY]
: cfg;
if (!freshCfg.users || typeof freshCfg.users !== 'object')
freshCfg.users = {};
const freshIds = [];
const addFreshId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !freshIds.includes(id))
freshIds.push(id);
};
(Array.isArray(fresh && fresh.tfIsignalUsersPlatformIds) ? fresh.tfIsignalUsersPlatformIds : []).forEach(addFreshId);
(Array.isArray(freshCfg.platformIds) ? freshCfg.platformIds : []).forEach(addFreshId);
Object.keys(freshCfg.users || {}).forEach(addFreshId);
const freshMeta = await tf_isignalUsers_prepareAnalystMeta();
const freshEntries = freshMeta && freshMeta.ok && Array.isArray(freshMeta.entries) ? freshMeta.entries : [];
cfg = freshCfg;
platformIds = freshIds;
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_renderUsersTable(platformIds, cfg, freshEntries, defaultBalance, defaultRisk);
if (!freshMeta || !freshMeta.ok)
showError(freshMeta && freshMeta.error ? freshMeta.error : 'Belum ada data analis dari dashboard.');
else if (!platformWarning)
showError('');
}
catch (e) {
showError('Sinkronisasi data Dashboard gagal: ' + String(e && e.message ? e.message : e));
}
}, 350);
});
}
try {
window.__tf_isignalUsersMgmtCfg = cfg;
const migrated = (typeof tf_isignalUsers_migrateLegacyCooldownStatus === 'function')
? tf_isignalUsers_migrateLegacyCooldownStatus(cfg)
: false;
if (migrated) {
try {
await tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
let hasCooldown = false;
try {
const now = Date.now();
const mpPid = cfg && cfg.usersSetCooldown ? cfg.usersSetCooldown : null;
if (mpPid) {
Object.keys(mpPid || {}).forEach((pid) => {
const mpA = mpPid[pid];
if (!mpA)
return;
Object.keys(mpA || {}).forEach((aName) => {
const st = mpA[aName];
const until = st && st.until ? Number(st.until) : null;
if (Number.isFinite(until) && until > now)
hasCooldown = true;
});
});
}
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
}
catch (e) { }
showLoading(false);
// Jangan menghapus pesan warning/error yang sudah dibuat oleh sinkronisasi di atas.
}
// REV340 EQUITY SCALE: USD Line + Candle floor = initial balance - $1,000.

// ===== REV393: Latest-month Drawdown / Consecutive Loss warning system =====
// Rule source: raw Table 3 history, grouped by Analyst + Pair in the globally
// newest Closed At month. Drawdown = the latest month ends below its own
// intra-month cumulative-pips peak. Consecutive Loss = at least 2 negative-pips
// trades in a row during that month. Both on the SAME Analyst+Pair => critical.
let __tfLatestRiskState = { monthKey:'', byPair:new Map(), byAnalyst:new Map(), signature:'' };

function tf_latestRiskNormAnalyst(v) {
let raw=String(v || '');
try { raw=raw.normalize('NFKC'); } catch (e) { }
raw=raw
.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'')
.replace(/^\s*[✓!×]\s*/,'')
.replace(/\s*·\s*(?:CRITICAL|WARNING|HEALTHY)\b.*$/i,'')
.replace(/\s+/g,' ')
.trim();
raw=raw.replace(/\s*\((?:[A-Z]{6}|XAUUSD|XAGUSD|US30|NAS100|BTCUSD|ETHUSD)\)\s*$/i,'');
raw=raw.replace(/\s+-\s+(?:[A-Z]{6}|XAUUSD|XAGUSD|US30|NAS100|BTCUSD|ETHUSD)\s*$/i,'');
return raw.toLowerCase();
}
function tf_latestRiskNormPair(v) {
return String(v || '').trim().toUpperCase();
}
function tf_latestRiskRowTs(row) {
try {
if (!row) return null;
const k = Number(row.sortKey);
if (Number.isFinite(k) && k > 0) return k;
if (typeof tf_parseHistoryTableDateMs === 'function') {
const t = tf_parseHistoryTableDateMs(row.displayDate || row.closedDate || row.createdDate || '');
if (Number.isFinite(t) && t > 0) return t;
}
const d = Date.parse(String(row.displayDate || row.closedDate || row.createdDate || ''));
return Number.isFinite(d) ? d : null;
}
catch (e) { return null; }
}
function tf_latestRiskMonthKey(ts) {
try {
if (typeof tf_monthKeyFromSortKey === 'function') {
const mk = tf_monthKeyFromSortKey(ts);
if (mk) return String(mk);
}
const d = new Date(ts);
if (!Number.isFinite(d.getTime())) return '';
return String(d.getFullYear()) + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
catch (e) { return ''; }
}
let __tfRiskTaskSource=null, __tfRiskTaskLength=-1, __tfRiskTaskReady=false;
function tf_refreshLatestRiskState(force) {
try {
const src = Array.isArray(historySignals) ? historySignals : [];
if(!force && __tfRiskTaskReady && __tfRiskTaskSource===src && __tfRiskTaskLength===src.length)return __tfLatestRiskState;
__tfRiskTaskSource=src;__tfRiskTaskLength=src.length;__tfRiskTaskReady=true;
Promise.resolve().then(()=>{__tfRiskTaskReady=false;});
let maxTs = null;
let fingerprint=2166136261;
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw || !String(r.analyst || '').trim() || !String(r.pair || '').trim()) continue;
const value=JSON.stringify([r.analyst,r.pair,r.pips,r.sortKey,r.displayDate,r.closedDate,r.createdDate]);
for(let j=0;j<value.length;j++) fingerprint=Math.imul(fingerprint^value.charCodeAt(j),16777619);
const ts = tf_latestRiskRowTs(r);
if (ts == null) continue;
if (maxTs == null || ts > maxTs) maxTs = ts;
}
const latestMonth = maxTs == null ? '' : tf_latestRiskMonthKey(maxTs);
// REV415: newest data month plus its three preceding calendar months (ALL data).
const newestIndex = latestMonth ? Number(latestMonth.slice(0,4))*12 + Number(latestMonth.slice(5,7))-1 : null;
const oldestIndex = newestIndex == null ? null : newestIndex-3;
const windowStartMonth = oldestIndex == null ? '' : String(Math.floor(oldestIndex/12)) + '-' + String(oldestIndex%12+1).padStart(2,'0');
const signature = String(src.length) + '|' + String(maxTs || 0) + '|' + latestMonth + '|' + fingerprint;
if (!force && __tfLatestRiskState && __tfLatestRiskState.signature === signature) return __tfLatestRiskState;
const byPair = new Map();
const groups = new Map();
if (latestMonth) {
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw) continue;
const analyst = String(r.analyst || '').trim();
const pair = tf_latestRiskNormPair(r.pair);
if (!analyst || !pair) continue;
const ts = tf_latestRiskRowTs(r);
if (ts == null) continue;
let pips = (typeof r.pips === 'number') ? r.pips : parseFloat(r.pips);
if (!Number.isFinite(pips)) continue;
const key = tf_latestRiskNormAnalyst(analyst) + '|' + pair;
if (!groups.has(key)) groups.set(key, { analyst, pair, rows:[] });
groups.get(key).rows.push({ ts, pips });
}
}
groups.forEach((g, key) => {
g.rows.sort((a,b) => a.ts - b.ts);
// REV433: reference history excludes all four newest calendar months.
const recentRow=r=>{const month=tf_latestRiskMonthKey(r.ts);return month>=windowStartMonth&&month<=latestMonth;};
function metrics(rows){
  let cumulative=0,peak=0,maxDd=0,lossCount=0,lossPips=0,maxLossStreak=0;const streaks=[],drawdowns=[];
  let start=null;
  const finish=end=>{if(lossCount){streaks.push({start,end,count:lossCount,pips:lossPips});maxLossStreak=Math.max(maxLossStreak,lossCount);}lossCount=0;lossPips=0;start=null;};
  for(let i=0;i<rows.length;i++){const r=rows[i];cumulative+=r.pips;peak=Math.max(peak,cumulative);const dd=peak-cumulative;maxDd=Math.max(maxDd,dd);drawdowns.push({ts:r.ts,pips:dd});if(r.pips<0){if(!lossCount)start=r.ts;lossCount++;lossPips+=Math.abs(r.pips);}else finish(rows[i-1]?.ts??r.ts);}
  if(rows.length)finish(rows[rows.length-1].ts);
  return {cumulative,peak,maxDd,maxLossStreak,streaks,drawdowns};
}
const baseline=metrics(g.rows.filter(r=>!recentRow(r)));
const recent=metrics(g.rows.filter(recentRow));
const whole=metrics(g.rows);
const recentStreaks=whole.streaks.filter(s=>s.count>=2&&recentRow({ts:s.end}));
// Match the ALL equity-curve highlight: greatest loss count, then greatest loss pips.
const maxCountStreaks=whole.streaks.filter(s=>s.count===whole.maxLossStreak);
const recordLossPips=Math.max(0,...maxCountStreaks.map(s=>s.pips));
const recordStreaks=maxCountStreaks.filter(s=>Math.abs(s.pips-recordLossPips)<=1e-9).slice(0,1);
const consecutiveLoss=whole.maxLossStreak>=2&&recordStreaks.some(s=>recentRow({ts:s.end}));
const exceedsLossCount=baseline.maxLossStreak>0&&recentStreaks.some(s=>s.count>baseline.maxLossStreak*1.3);
const exceedsLossPnl=baseline.maxDd>0&&recentStreaks.some(s=>s.pips>baseline.maxDd+1e-9);
// "Drawdown terbaru" is a new/equal historical drawdown event, using only the earlier reference.
// A smaller ordinary loss below historical drawdown may remain yellow.
const recordDrawdown=whole.drawdowns.find(d=>d.pips>=whole.maxDd-1e-9);
const drawdown=whole.maxDd>1e-9&&!!recordDrawdown&&recentRow(recordDrawdown);
const severity=drawdown||exceedsLossCount||exceedsLossPnl?2:consecutiveLoss?1:0;
const reasons=[];if(drawdown)reasons.push('Drawdown terbaru mencapai/melebihi pembanding');if(exceedsLossCount)reasons.push('Consecutive Loss > +30% maksimum pembanding');if(exceedsLossPnl)reasons.push('PnL loss > Drawdown pembanding');if(!reasons.length&&consecutiveLoss)reasons.push('Consecutive Loss');
byPair.set(key,{analyst:g.analyst,pair:g.pair,monthKey:latestMonth,drawdown,consecutiveLoss,severity,reasons,exceedsLossCount,exceedsLossPnl,baselineMaxLossStreak:baseline.maxLossStreak,baselineMaxDrawdownPips:baseline.maxDd,recentMaxLossStreak:Math.max(0,...recentStreaks.map(s=>s.count)),recentMaxDrawdownPips:recent.maxDd,maxLossStreak:whole.maxLossStreak,maxDrawdownPips:whole.maxDd,ddPeriods:recent.drawdowns,lossPeriods:recordStreaks,endingPips:whole.cumulative,peakPips:whole.peak});

});
const byAnalyst = new Map();
byPair.forEach((st) => {
if (!st) return;
const key = tf_latestRiskNormAnalyst(st.analyst);
const prev=byAnalyst.get(key);
const drawdown=!!st.drawdown || !!(prev && prev.drawdown);
const consecutiveLoss=!!st.consecutiveLoss || !!(prev && prev.consecutiveLoss);
byAnalyst.set(key,{analyst:st.analyst,monthKey:latestMonth,drawdown,consecutiveLoss,severity:Math.max(st.severity,prev?.severity||0),reasons:Array.from(new Set([...(prev?.reasons||[]),...(st.reasons||[])])),sourcePair:st.pair});
});
for (let i = 0; i < src.length; i++) {
const r = src[i];
if (!r || r.isWithdraw) continue;
const analyst = String(r.analyst || '').trim();
if (!analyst) continue;
const key = tf_latestRiskNormAnalyst(analyst);
if (!byAnalyst.has(key)) {
byAnalyst.set(key, { analyst, monthKey:latestMonth, drawdown:false, consecutiveLoss:false, severity:0, sourcePair:'' });
}
}
try {
const reg=(value)=>{
const analyst=String(value||'').trim(),key=tf_latestRiskNormAnalyst(analyst);
if(analyst&&key&&!byAnalyst.has(key))byAnalyst.set(key,{analyst,monthKey:latestMonth,drawdown:false,consecutiveLoss:false,severity:0,sourcePair:''});
};
(Array.isArray(ANALYSTS)?ANALYSTS:[]).forEach(a=>reg(a&&(a.baseName||a.name)));
Object.keys((analystSourcesByName&&typeof analystSourcesByName==='object')?analystSourcesByName:{}).forEach(reg);
Object.keys((selectedAnalystsGlobal&&typeof selectedAnalystsGlobal==='object')?selectedAnalystsGlobal:{}).forEach(reg);
} catch(e) {}
__tfLatestRiskState = { monthKey:latestMonth, windowStartMonth, windowMonths:4, byPair, byAnalyst, signature };
try { window.__tfLatestRiskState = __tfLatestRiskState; } catch (e) { }
return __tfLatestRiskState;
}
catch (e) {
__tfLatestRiskState = { monthKey:'', byPair:new Map(), byAnalyst:new Map(), signature:'ERR' };
return __tfLatestRiskState;
}
}
function tf_getLatestRiskState(analyst, pair) {
const st = tf_refreshLatestRiskState(false);
const key = tf_latestRiskNormAnalyst(analyst);
if (!key) return null;
if (pair) {
const exact=st.byPair.get(key + '|' + tf_latestRiskNormPair(pair));
if (exact) return exact;
}
const agg=st.byAnalyst.get(key);
if (agg) return agg;
return {analyst:String(analyst||'').trim(),pair:pair?tf_latestRiskNormPair(pair):'',monthKey:st.monthKey||'',drawdown:false,consecutiveLoss:false,maxLossStreak:0,endingPips:0,peakPips:0,severity:0,syntheticHealthy:true};
}
function tf_latestRiskReason(st) {
if (!st) return '';
const month = st.monthKey ? (' · 4 bulan hingga ' + st.monthKey) : '';
if (st.severity >= 2) return 'CRITICAL' + month + ': '+(st.reasons||['Drawdown terbaru']).join('; ');
if (st.drawdown) return 'CRITICAL' + month + ': Drawdown terbaru';
if (st.consecutiveLoss) return 'WARNING' + month + ': Consecutive Loss';
return 'HEALTHY' + month + ': No Drawdown / Consecutive Loss';
}
function tf_createAnalystNameColorTarget(text) {
const span=document.createElement('span');
span.className='tf-analyst-name-color-target';
span.textContent=String(text || '');
return span;
}
function tf_ensureAnalystNameColorTarget(el) {
try {
if (!el || !el.querySelector) return null;
let target=el.querySelector('.tf-analyst-name-color-target');
if (target) return target;
const nodes=Array.from(el.childNodes || []);
const textNodes=nodes.filter((n)=>n && n.nodeType===3 && String(n.nodeValue || '').trim());
if (!textNodes.length) return null;
target=tf_createAnalystNameColorTarget(textNodes.map((n)=>String(n.nodeValue || '')).join(''));
const first=textNodes[0];
el.insertBefore(target, first);
textNodes.forEach((n)=>{ try { n.remove(); } catch (e) { if (n.parentNode) n.parentNode.removeChild(n); } });
return target;
} catch (e) { return null; }
}
function tf_forceLatestRiskTextColor(el, st) {
try {
if (!el || !st) return;
try { tf_ensureAnalystNameColorTarget(el); } catch (e) { }
const color = st.severity >= 2 ? '#ef4444' : (st.severity === 1 ? '#facc15' : '#22c55e');
el.style && el.style.setProperty('color', color, 'important');
if (el.querySelectorAll) {
el.querySelectorAll('*').forEach((child) => {
if (!child || (child.matches && child.matches('[data-tf-latest-risk-icon="1"], [data-tf-latest-risk-icon="1"] *'))) return;
if (child.style) child.style.setProperty('color', color, 'important');
});
}
} catch (e) { }
}

// REV398: hard inline analyst-name colors beat all table/sticky white styles.
function tf_applyLatestRiskToElement(el, analyst, pair, showIcon, iconPosition) {
try {
if (!el) return null;
const st = tf_getLatestRiskState(analyst, pair) || (pair ? tf_getLatestRiskState(analyst, null) : null);
el.classList.remove('tf-latest-risk-healthy','tf-latest-risk-warning','tf-latest-risk-critical');
el.querySelectorAll && el.querySelectorAll('[data-tf-latest-risk-icon="1"]').forEach((x) => x.remove());
if (!st) return null;
el.classList.add(st.severity >= 2 ? 'tf-latest-risk-critical' : (st.severity === 1 ? 'tf-latest-risk-warning' : 'tf-latest-risk-healthy'));
tf_forceLatestRiskTextColor(el, st);
if (showIcon !== false) {
const icon = document.createElement('span');
icon.setAttribute('data-tf-latest-risk-icon','1');
const pos = String(iconPosition || 'right').toLowerCase() === 'left' ? 'left' : 'right';
const stateClass = st.severity >= 2 ? 'tf-latest-risk-icon-critical' : (st.severity === 1 ? 'tf-latest-risk-icon-warning' : 'tf-latest-risk-icon-healthy');
icon.className = 'tf-latest-risk-icon tf-latest-risk-icon-' + pos + ' ' + stateClass;
icon.textContent = st.severity >= 2 ? '×' : (st.severity === 1 ? '!' : '✓');
icon.setAttribute('aria-label', tf_latestRiskReason(st));
icon.title = tf_latestRiskReason(st);
if (pos === 'left') el.insertBefore(icon, el.firstChild || null);
else el.appendChild(icon);
}
return st;
}
catch (e) { return null; }
}
// REV395: analyst NAME color is aggregate across all pairs; pair state is icon-only where needed.
function tf_applyLatestRiskColorOnly(el, analyst, pair) {
try {
if(!el)return null;
const st=tf_getLatestRiskState(analyst,pair);
el.classList.remove('tf-latest-risk-healthy','tf-latest-risk-warning','tf-latest-risk-critical');
if(!st)return null;
el.classList.add(st.severity>=2?'tf-latest-risk-critical':(st.severity===1?'tf-latest-risk-warning':'tf-latest-risk-healthy'));
tf_forceLatestRiskTextColor(el, st);
return st;
} catch(e){return null;}
}
function tf_colorEveryRenderedAnalystName(root) {
try {
const scope=root&&root.querySelectorAll?root:document;
const apply=(el,name,pair)=>{if(!el)return;const n=String(name||el.getAttribute('data-analyst')||el.title||el.textContent||'').trim();if(!n||/^withdraw$/i.test(n))return;const st=tf_applyLatestRiskColorOnly(el,n,pair||null);if(st)tf_forceLatestRiskTextColor(el,st);};
scope.querySelectorAll('.tf-perf-name-text').forEach(el=>apply(el,el.title||el.textContent,null));
scope.querySelectorAll('.tf-holding-analyst').forEach(el=>{const raw=String(el.textContent||'').replace(/^[✓!×]\s*/,'').trim();const m=raw.match(/^(.*?)\s+-\s+([A-Z0-9]{3,10})$/i);apply(el,m?m[1]:raw,m?m[2]:null);});
scope.querySelectorAll('#summary-table tbody td.monthly-sticky-col-2').forEach(el=>{const r=el.parentElement;apply(el,el.textContent,r&&r.children[1]?r.children[1].textContent:null);});
scope.querySelectorAll('#monthly-table tbody td.monthly-sticky-col-2').forEach(el=>{const r=el.parentElement;apply(el,el.textContent,r&&r.children[2]?r.children[2].textContent:null);});
scope.querySelectorAll('#history-table tbody td[data-history-col="analyst"]').forEach(el=>{const r=el.parentElement,p=r?r.querySelector('td[data-history-col="pair"]'):null;apply(el,el.title||el.textContent,p?p.textContent:null);});
scope.querySelectorAll('#drawdown-table tbody tr').forEach(r=>{const el=r&&r.children?(r.children[1]||r.children[0]):null;if(el)apply(el,el.textContent,null);});
scope.querySelectorAll('.tf-score-analyst').forEach(el=>apply(el,el.textContent,null));
scope.querySelectorAll('.tf-isignal-analyst-name,.tf-users-analyst-link').forEach(el=>apply(el,el.getAttribute('data-analyst')||el.title||el.textContent,null));
scope.querySelectorAll('.analyst-filter-name').forEach(el=>apply(el,el.title||el.textContent,null));

} catch(e){}
}
function tf_applyLatestRiskPairIconOnly(el, analyst, pair, iconPosition) {
try {
if (!el) return null;
el.querySelectorAll && el.querySelectorAll('[data-tf-latest-risk-icon="1"]').forEach((x) => x.remove());
const st = tf_getLatestRiskState(analyst, pair) || tf_getLatestRiskState(analyst, null);
if (!st) return null;
const icon = document.createElement('span');
icon.setAttribute('data-tf-latest-risk-icon','1');
const pos = String(iconPosition || 'right').toLowerCase() === 'left' ? 'left' : 'right';
const stateClass = st.severity >= 2 ? 'tf-latest-risk-icon-critical' : (st.severity === 1 ? 'tf-latest-risk-icon-warning' : 'tf-latest-risk-icon-healthy');
icon.className = 'tf-latest-risk-icon tf-latest-risk-icon-' + pos + ' ' + stateClass;
icon.textContent = st.severity >= 2 ? '×' : (st.severity === 1 ? '!' : '✓');
icon.setAttribute('aria-label', tf_latestRiskReason(st));
icon.title = tf_latestRiskReason(st);
if (pos === 'left') el.insertBefore(icon, el.firstChild || null);
else el.appendChild(icon);
return st;
}
catch (e) { return null; }
}
// REV394 presentation: smaller icons, left placement, ticker color-only.
// REV395 presentation: every analyst NAME uses aggregate analyst severity across all pairs.
// REV406: only inspect new analyst rows, never rescan history for icon/text mutations.
try {
let timer=null;const roots=new Set();
const selector='#summary-table,#monthly-table,#history-table,#drawdown-table,.tf-score-analyst,.tf-holding-analyst,.tf-perf-name-text,.analyst-filter-name,.tf-isignal-analyst-name,.tf-users-analyst-link';
const flush=()=>{timer=null;const pending=Array.from(roots);roots.clear();colorObserver.disconnect();try{for(const root of pending){if(root.isConnected!==false)tf_colorEveryRenderedAnalystName(root.matches&&root.matches(selector)?(root.parentElement||root):root);}}finally{colorObserver.observe(document.documentElement,{childList:true,subtree:true});}};
const schedule=root=>{roots.add(root);if(!timer)timer=setTimeout(flush,100);};
const colorObserver=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes||[]){if(node.nodeType!==1||node.matches('[data-tf-latest-risk-icon],.tf-analyst-name-color-target'))continue;if(node.matches(selector)||node.querySelector(selector))schedule(node);else if(node.matches('tr,tbody')&&node.closest('#summary-table,#monthly-table,#history-table,#drawdown-table'))schedule(node);}});
colorObserver.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(document),{once:true});else schedule(document);
}catch(e){}


// REV412: shared dashboard presentation and iSignal subscription status.
let tfEquityAnimation412 = null;
let tfEquityAnimationFrame412 = 0;
function tf_cancelEquityAnimation412() {
  cancelAnimationFrame(tfEquityAnimationFrame412);
  tfEquityAnimationFrame412 = 0;
  tfEquityAnimation412 = null;
}
function tf_animateEquity412() {
  tf_cancelEquityAnimation412();
  const canvas = document.getElementById('equity-curve-canvas');
  if (equityChartMode !== 'line' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden || !canvas || !canvas.parentElement || !canvas.parentElement.clientWidth || !equityCurvePoints.length) {
    drawEquityCurve(); return;
  }
  // Cache the grid and complete line once. ALL has the same smooth transition
  // as short ranges without recalculating thousands of chart points each frame.
  const animation = { start: null, progress: 0, duration: 2200 };
  tfEquityAnimation412 = animation;
  const snapshot = () => {
    const layer = document.createElement('canvas');
    layer.width = canvas.width; layer.height = canvas.height;
    layer.getContext('2d').drawImage(canvas, 0, 0);
    return layer;
  };
  try {
    drawEquityCurve();
    const background = snapshot();
    animation.progress = 1;
    drawEquityCurve();
    const complete = snapshot();
    animation.progress = 0;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const left = 48 * dpr;
    const right = Math.max(left, complete.width - tf_getEquityPaddingRight() * dpr);
    const paint = progress => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);
      const revealWidth = progress >= 1 ? complete.width : Math.min(complete.width, left + (right - left) * progress);
      if (revealWidth > 0) ctx.drawImage(complete, 0, 0, revealWidth, complete.height, 0, 0, revealWidth, complete.height);
      ctx.restore();
    };
    paint(0);
    const step = now => {
      if (tfEquityAnimation412 !== animation) return;
      if (canvas.width !== complete.width || canvas.height !== complete.height) {
        tf_cancelEquityAnimation412(); drawEquityCurve(); return;
      }
      // Start at the first visible frame, after summary/ALL computation finishes.
      if (animation.start === null) animation.start = now;
      const t = Math.max(0, Math.min(1, (now - animation.start) / animation.duration));
      animation.progress = t * t * (3 - 2 * t);
      paint(animation.progress);
      if (t < 1) tfEquityAnimationFrame412 = requestAnimationFrame(step);
      else { tfEquityAnimation412 = null; tfEquityAnimationFrame412 = 0; }
    };
    tfEquityAnimationFrame412 = requestAnimationFrame(step);
  } catch (error) {
    tf_cancelEquityAnimation412(); drawEquityCurve();
  }
}

function tf_renderBalanceCards412(saldo, equity, busy) {
  const host = document.getElementById('tf-balance-cards412');
  if (!host) return;
  const valid = Number.isFinite(equity), pnl = valid ? equity - saldo : null;
  const pct = valid && saldo !== 0 ? pnl / Math.abs(saldo) * 100 : null;
  const money = n => (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', {maximumFractionDigits: 2});
  const values = [saldo, equity, pnl, pct], labels = ['Saldo', 'Equity $', 'PnL $', 'PnL %'];
  host.innerHTML = labels.map((label, i) => {
    const n = values[i], known = Number.isFinite(n);
    const text = busy ? 'Memuat…' : !known ? '—' : (i >= 2 && n > 0 ? '+' : '') + (i === 3 ? n.toFixed(2) + '%' : money(n));
    const state = !busy && known && n < 0 ? 'neg' : !busy && known && i >= 2 && n > 0 ? 'pos' : '';
    return '<div class="tf-balance-card412 ' + state + '"><div class="tf-balance-label412">' + label + '</div><div class="tf-balance-value412">' + text + '</div></div>';
  }).join('');
}
function tf_subscriptionStatus412(text, now = Date.now()) {
  // Source dates are Indonesian account dates (WIB, UTC+7), including their time.
  const months = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
  const m = String(text || '').trim().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(?:WIB|UTC\+7|GMT\+7))?$/i);
  if (!m) return null;
  const month = months.indexOf(m[2].toLowerCase()), day = Number(m[1]), hour = Number(m[4]), minute = Number(m[5]), second = Number(m[6] || 0);
  if (month < 0 || day < 1 || day > new Date(Date.UTC(Number(m[3]), month + 1, 0)).getUTCDate() || hour > 23 || minute > 59 || second > 59) return null;
  const end = Date.UTC(Number(m[3]), month, day, hour - 7, minute, second);
  const remaining = end - now;
  return { end, remaining, state: remaining <= 86400000 ? 'critical' : remaining <= 5 * 86400000 ? 'warning' : 'healthy' };
}
function tf_applySubscription412(el, text) {
  if (!el) return;
  const status = tf_subscriptionStatus412(text);
  el.dataset.subscriptionText412 = String(text || '');
  for (const state of ['healthy','warning','critical']) el.classList.remove('tf-subscription-' + state + '412');
  el.removeAttribute('title');
  if (!status) { el.textContent = text || '—'; return; }
  el.classList.add('tf-subscription-' + status.state + '412');
  const icon = document.createElement('span');
  icon.className = 'tf-subscription-icon412'; icon.setAttribute('aria-hidden', 'true');
  icon.textContent = status.state === 'healthy' ? '✓' : '!';
  el.replaceChildren(icon, document.createTextNode(' ' + text));
  el.title = status.remaining <= 0 ? 'Subscription sudah kedaluwarsa' : status.state === 'critical' ? 'Subscription tersisa 1 hari atau kurang' : status.state === 'warning' ? 'Subscription tersisa 5 hari atau kurang' : 'Subscription masih aman';
}
function tf_showIsignalExplanation412() {
  if (!document.getElementById('tf-users-mgmt-table') || document.getElementById('tf-isignal-explainer412')) return;
  const overlay = document.createElement('div');
  overlay.id = 'tf-isignal-explainer412'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-labelledby','tf-isignal-explainer-title412');
  overlay.innerHTML = '<div class="tf-isignal-explainer-card412"><div class="tf-isignal-eyebrow412">// ISIGNAL USERS</div><h2 id="tf-isignal-explainer-title412">Kenali<br>Status iSignal</h2><p>Ikon koneksi dan tanggal subscription memiliki arti yang berbeda.</p><div class="tf-isignal-explainer-row412"><span class="tf-legend-green412">✓</span><div><strong>Status koneksi</strong><p>Centang hijau pada analis berarti analis ditemukan dan aktif di iSignal. X merah berarti analis belum aktif, tidak aktif, atau tidak ditemukan. X pada kolom Disconnect berarti belum terhubung atau tidak tersedia untuk disconnect.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-green412">✓</span><div><strong>Subscription aman · Hijau</strong><p>Tanggal berwarna hijau dengan centang: waktu tersisa lebih dari 5 hari.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-yellow412">!</span><div><strong>Segera kedaluwarsa · Kuning</strong><p>Tanggal berwarna kuning dengan tanda seru: waktu tersisa 5 hari atau kurang, tetapi lebih dari 1 hari.</p></div></div><div class="tf-isignal-explainer-row412"><span class="tf-legend-red412">!</span><div><strong>Mendesak / Kedaluwarsa · Merah</strong><p>Tanggal berwarna merah dengan tanda seru: waktu tersisa 1 hari atau kurang, termasuk subscription yang sudah kedaluwarsa.</p></div></div><p>Warna nama analis mengikuti 4 bulan terbaru dari seluruh data (ALL) Table 3. Pembanding hanya history SEBELUM 4 bulan terbaru. Hijau ✓: tidak ada consecutive loss maupun drawdown terbaru. Kuning !: rentetan maksimum consecutive loss ALL berada dalam 4 bulan terbaru, tanpa kondisi merah. Rentetan loss yang lebih kecil bukan penanda kuning. Merah ×: drawdown terbaru, consecutive loss + drawdown, kerugian rentetan melebihi drawdown pembanding, atau jumlah consecutive loss melebihi maksimum pembanding +30% (10x: 14x merah; 13x belum).</p><div class="tf-isignal-note412">Fitur ini hanya akan aktif jika User sudah mengatur Lot Size di iSignal sebelumnya! Jika belum, silakan connect ke iSignal terlebih dahulu dan mengatur Lot Size secara manual terlebih dahulu!</div><button type="button" id="tf-isignal-understand412">Mengerti !</button></div>';
  const previous = document.activeElement;
  document.body.appendChild(overlay);
  const button = overlay.querySelector('button');
  button.addEventListener('click', () => { overlay.remove(); if (previous && previous.isConnected) previous.focus(); });
  overlay.addEventListener('keydown', event => { if (event.key === 'Tab') { event.preventDefault(); button.focus(); } });
  button.focus();
}
function tf_initPresentation412() {
  tf_showIsignalExplanation412();
  if (!document.getElementById('tf-users-mgmt-table')) return;
  const refresh = () => {
    document.querySelectorAll('.tf-users-analyst-link[data-analyst]').forEach(el => tf_applyLatestRiskColorOnly(el, el.dataset.analyst, null));
    document.querySelectorAll('.tf-isignal-subend').forEach(el => {
      if (!el.classList.contains('tf-isusers-sub-loading')) tf_applySubscription412(el, el.dataset.subscriptionText412 || el.textContent.replace(/^[✓!]\s*/, ''));
    });
  };
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tf_initPresentation412, {once:true});
else tf_initPresentation412();

/* TF compact dimensions REV452 */
