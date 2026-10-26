document.body.innerHTML = "\n\n  <!-- Hidden file input used by Import / Update -->\n  <input id=\"tf-import-file\" type=\"file\" accept=\"application/json,.json\" multiple style=\"display:none\" />\n\n  <!-- Boot Loading Overlay: shown only while probe tab is opening+closing -->\n  <div id=\"boot-loading-overlay\" class=\"boot-loading-overlay\" aria-hidden=\"true\">\n    <div class=\"boot-loading-card\">\n      <div class=\"boot-spinner\"></div>\n      <div class=\"boot-loading-text\">\n        <div id=\"boot-loading-title\" class=\"boot-loading-title\">Loading...</div>\n        <div id=\"boot-loading-sub\" class=\"boot-loading-sub\">Menunggu tab probe ditutup</div>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"login-container\" class=\"card section\">\n    <div class=\"section\">\n      <h1 class=\"login-title\">Selamat Datang!</h1>\n      <p>Masuk dengan akun Traders Family Anda untuk menggunakan TF Multi-Analyst Dashboard.</p>\n    </div>\n\n    <div class=\"section\" style=\"margin-top: 9px;\">\n      <label for=\"login-email\" class=\"form-label\">Email/Username/MT4 Id</label>\n      <input id=\"login-email\" type=\"text\" class=\"form-input\" placeholder=\"Masukkan Email/Username/MT4 Id\" autocomplete=\"email\">\n    </div>\n\n    <div class=\"section\" style=\"margin-top: 5.4px;\">\n      <label for=\"login-password\" class=\"form-label\">Password</label>\n      <input id=\"login-password\" type=\"password\" class=\"form-input\" placeholder=\"Masukkan Password\" autocomplete=\"current-password\">\n    </div>\n    <div class=\"section\" style=\"margin-top: 3.6px; display: flex; align-items: center; gap: 5.4px;\">\n      <input id=\"login-remember\" type=\"checkbox\" style=\"width: 11.7px; height: 11.7px; margin: 0;\">\n      <label for=\"login-remember\" class=\"form-label\" style=\"margin: 0;\">Remember email/username</label>\n    </div>\n\n    <!-- Row 1: Masuk (auto-fill + auto-submit via loginmt4) -->\n    <button id=\"login-btn\" class=\"btn btn-primary\" type=\"button\" style=\"margin-top: 9px;\">Masuk</button>\n\n    <!-- Row 2: Login by MT4 -->\n    <button id=\"login-mt4-btn\" class=\"btn btn-white\" type=\"button\" style=\"margin-top: 9px; display:flex; align-items:center; justify-content:center; gap:7.2px;\">\n      <img src=\"https://account.tradersfamily.id/templates/panel/img/brand/metatrader4.png\" alt=\"MetaTrader 4\" style=\"width:18px; height:18px; object-fit:contain;\" />\n      <span>MetaTrader 4</span>\n    </button>\n\n    <!-- Row 3: Login by Google -->\n    <button id=\"login-google-btn\" class=\"btn btn-white\" type=\"button\" style=\"margin-top: 9px; display:flex; align-items:center; justify-content:center; gap:7.2px;\">\n      <img src=\"https://account.tradersfamily.id/templates/panel/img/brand/google.png\" alt=\"Google\" style=\"width:18px; height:18px; object-fit:contain;\" />\n      <span>Google</span>\n    </button>\n\n    <!-- Row 4: Upgrade Plan -->\n    <button id=\"login-upgrade-plan-btn\" class=\"btn btn-white\" type=\"button\" style=\"margin-top: 9px; display:flex; align-items:center; justify-content:center; gap:7.2px;\">\n      <span>Upgrade Plan / Check Status</span>\n    </button>\n\n    <div id=\"login-status\" class=\"login-status\"></div>\n  </div>\n\n  <!-- Login Overlay (captcha waiting / google loading / timeout) -->\n  <div id=\"tf-login-overlay\" class=\"boot-loading-overlay\" aria-hidden=\"true\" style=\"display:none;\">\n    <div class=\"boot-loading-card\" style=\"gap: 9px;\">\n      <div class=\"boot-spinner\"></div>\n      <div class=\"boot-loading-text\">\n        <div id=\"tf-login-ov-title\" class=\"boot-loading-title\">Loading...</div>\n        <div id=\"tf-login-ov-sub\" class=\"boot-loading-sub\">...</div>\n      </div>\n      <div id=\"tf-login-ov-actions\" style=\"display:flex; gap:7.2px; justify-content:center; align-items:center; flex-wrap:wrap;\">\n        <button id=\"tf-login-ov-cancel\" type=\"button\" class=\"btn btn-ghost\" style=\"min-width: 99px;\">Cancel</button>\n        <button id=\"tf-login-ov-retry\" type=\"button\" class=\"btn btn-primary\" style=\"min-width: 144px; display:none;\">Coba Login kembali...</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- When the user is already logged in on TradersFamily, the plugin shows this\n       intermediate view. It displays the user's avatar and name along with\n       a button to enter the main dashboard. Clicking the button opens\n       https://account.tradersfamily.id/channels/ in a new tab and then\n       reveals the main container with the analyst link inputs. -->\n  <div id=\"masuk-container\" class=\"card section\" style=\"display: none;\">\n    <div class=\"top-header\">\n      <div class=\"profile-row\">\n        <img id=\"masuk-user-avatar\" class=\"profile-avatar\" src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\" alt=\"User avatar\">\n        <div class=\"profile-main\">\n          <div id=\"masuk-user-name\" class=\"profile-name\">User belum login</div>\n          <div id=\"masuk-user-email\" class=\"profile-email\"></div>\n          <div class=\"profile-status\">\n            <span class=\"status-dot\"></span>\n            <span id=\"masuk-user-status-text\">Online</span>\n          </div>\n\n          <div class=\"profile-time-range\">\n            <div class=\"tf-tr-header\">\n              <div class=\"tf-tr-left\">\n                <span class=\"tf-tr-title\" id=\"tf-tr-title-masuk\">Time Range <span id=\"tf-time-range-paren-masuk\" class=\"tf-tr-paren\">(ALL)</span></span>\n              </div>\n              <button type=\"button\" class=\"tf-tr-arrowbtn\" id=\"tf-tr-toggle-masuk\" aria-expanded=\"false\">▾</button>\n            </div>\n            <div class=\"tf-tr-panel\" id=\"tf-tr-panel-masuk\" hidden>\n              <div class=\"tf-tr-options\">\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"m3\">3 Month</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"m6\">6 Month</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"y1\">1 Year</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"y2\">2 Year</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"y3\">3 Year</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"y5\">5 Year</button>\n                <button type=\"button\" class=\"tf-tr-option\" data-value=\"all_time\">ALL</button>\n              </div>\n            </div>\n          </div>\n\n                  <div class=\"tf-allpairs-row\" aria-label=\"All Analyst Pair Selector\">\n          <span class=\"tf-allpairs-label\">ALL ANALIS PAIR : Selector Pair</span>\n          <select id=\"tf-allpairs-select-masuk\" multiple style=\"display:none\">\n            <option value=\"__ALL__\" selected>ALL</option>\n            <option value=\"XAUUSD\">XAUUSD</option>\n            <option value=\"EURUSD\">EURUSD</option>\n            <option value=\"GBPUSD\">GBPUSD</option>\n            <option value=\"AUDUSD\">AUDUSD</option>\n            <option value=\"NZDUSD\">NZDUSD</option>\n            <option value=\"USDJPY\">USDJPY</option>\n            <option value=\"EURJPY\">EURJPY</option>\n            <option value=\"GBPJPY\">GBPJPY</option>\n            <option value=\"AUDJPY\">AUDJPY</option>\n            <option value=\"NZDJPY\">NZDJPY</option>\n            <option value=\"CADJPY\">CADJPY</option>\n            <option value=\"CHFJPY\">CHFJPY</option>\n            <option value=\"USDCAD\">USDCAD</option>\n            <option value=\"USDCHF\">USDCHF</option>\n          </select>\n          <div id=\"tf-allpairs-multiselect-masuk\" class=\"pair-multiselect allpairs-multiselect\">\n            <div class=\"pair-multiselect-display\">\n              <span class=\"pair-multiselect-label\">ALL</span>\n              <span class=\"pair-multiselect-arrow\">▾</span>\n            </div>\n            <div class=\"pair-multiselect-dropdown\">\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"__ALL__\" checked><span>ALL</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"XAUUSD\"><span>XAUUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURUSD\"><span>EURUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPUSD\"><span>GBPUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDUSD\"><span>AUDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDUSD\"><span>NZDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDJPY\"><span>USDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURJPY\"><span>EURJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPJPY\"><span>GBPJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDJPY\"><span>AUDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDJPY\"><span>NZDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CADJPY\"><span>CADJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CHFJPY\"><span>CHFJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCAD\"><span>USDCAD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCHF\"><span>USDCHF</span></label>\n            </div>\n          </div>\n        </div>\n\n<div class=\"tf-actions-grid\" data-tf-actions=\"masuk\">\n          <div class=\"tf-actions-left\">\n            <div class=\"tf-action-row tf-action-row-primary\" aria-label=\"Import dan Export\">\n              <button type=\"button\" class=\"tf-action-box tf-action-import\" id=\"tf-btn-import-masuk\" data-tf-import-state=\"empty\" title=\"Pilih satu file untuk Import, atau pilih beberapa file JSON untuk Combine\"><span class=\"tf-import-label\">Import / Combine</span><svg class=\"tf-import-state-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><g class=\"tf-import-icon-ready\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-ready-arrow\" d=\"M12 10.2v7.1m-3-3 3 3 3-3\"></path></g><g class=\"tf-import-icon-loaded\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-loaded-check\" d=\"m8.5 14.1 2.2 2.2 4.9-5.1\"></path></g></svg></button>\n              <button type=\"button\" class=\"tf-action-box tf-action-export\" id=\"tf-btn-export-masuk\">Export</button>\n            </div>\n            <div class=\"tf-action-row tf-action-row-secondary\" id=\"tf-addmode-actions2-masuk\" aria-label=\"Add Analis, Update, dan Refresh\">\n              <div class=\"tf-action-add-wrap\">\n                <button type=\"button\" class=\"tf-action-box tf-action-add\" id=\"tf-btn-add-analyst-masuk\" disabled>Add Analis</button>\n              </div>\n              <button type=\"button\" class=\"tf-action-box tf-action-update\" id=\"tf-btn-update-masuk\" disabled>Update</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-refresh tf-refreshlink\" id=\"tf-btn-refresh-masuk\">Refresh</button>\n            </div>\n            <div id=\"tf-addmode-scanwrap-masuk\" class=\"tf-action-row tf-action-row-scan\" aria-label=\"Scan Channel dan Pair\">\n              <button type=\"button\" class=\"tf-action-box tf-action-scan\" id=\"tf-btn-scanlink-masuk\" disabled aria-disabled=\"true\" title=\"Scan Channel ini hanya aktif setelah Import file.\">Scan Channel ini</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-pair tf-pairlink\" id=\"tf-btn-scanpair-masuk\" disabled aria-disabled=\"true\" title=\"Pair hanya aktif setelah Import file.\">ALL ▾</button>\n            </div>\n          </div>\n          <button type=\"button\" class=\"tf-submit-action-btn\" id=\"tf-btn-submit-masuk\" disabled>Submit</button>\n        </div>\n\n\n        </div>\n      </div>\n      <div class=\"title-block\">\n        <h1>TF Multi-Analyst Dashboard</h1>\n        <p>Tools scanner untuk banyak analis TradersFamily.</p>\n      </div>\n    </div>\n    <div class=\"divider\"></div>\n    <p class=\"small-muted\">Anda sudah login. Tekan tombol di bawah untuk membuka channel TradersFamily.</p>\n    <button id=\"masuk-btn\" class=\"btn btn-primary\" type=\"button\" style=\"margin-top: 7.2px;\">MASUK</button>\n  </div>\n\n  <div id=\"main-container\" class=\"card section\" style=\"display: none;\">\n    <div class=\"top-header\">\n      <div class=\"profile-row\">\n        <img id=\"popup-user-avatar\" class=\"profile-avatar\" src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\" alt=\"User avatar\">\n        <div class=\"profile-main\">\n          <div id=\"popup-user-name\" class=\"profile-name\">User belum login</div>\n          <div id=\"popup-user-email\" class=\"profile-email\"></div>\n          <div class=\"profile-status\">\n            <span class=\"status-dot\"></span>\n            <span id=\"popup-user-status-text\">Offline</span>\n          </div>\n\n          <!-- Time Range & Import/Export/Update/Submit are placed inside dashboard-view for a cleaner layout. -->\n\n        </div>\n      </div>\n      <div class=\"title-block\">\n        <h1>TF Multi-Analyst Dashboard</h1>\n        <p>Tools scanner untuk banyak analis TradersFamily.</p>\n      </div>\n    </div>\n\n    <div class=\"divider\"></div>\n\n    <!-- Dashboard view (default) -->\n    <div id=\"dashboard-view\">\n\n      <div class=\"dashboard-top-controls\">\n        <div class=\"profile-time-range\">\n          <div class=\"tf-tr-header\">\n            <div class=\"tf-tr-left\">\n              <span class=\"tf-tr-title\" id=\"tf-tr-title-main\">Time Range <span id=\"tf-time-range-paren-main\" class=\"tf-tr-paren\">(ALL)</span></span>\n            </div>\n            <button type=\"button\" class=\"tf-tr-arrowbtn\" id=\"tf-tr-toggle-main\" aria-expanded=\"false\">▾</button>\n          </div>\n          <div class=\"tf-tr-panel\" id=\"tf-tr-panel-main\" hidden>\n            <div class=\"tf-tr-options\">\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"m3\">3 Month</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"m6\">6 Month</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y1\">1 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y2\">2 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y3\">3 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y5\">5 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"all_time\">ALL</button>\n            </div>\n          </div>\n        </div>\n\n                <div class=\"tf-actions-grid\" data-tf-actions=\"main\">\n          <div class=\"tf-actions-left\">\n            <div class=\"tf-action-row tf-action-row-primary\" aria-label=\"Import dan Export\">\n              <button type=\"button\" class=\"tf-action-box tf-action-import\" id=\"tf-btn-import-main\" data-tf-import-state=\"empty\" title=\"Pilih satu file untuk Import, atau pilih beberapa file JSON untuk Combine\"><span class=\"tf-import-label\">Import / Combine</span><svg class=\"tf-import-state-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><g class=\"tf-import-icon-ready\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-ready-arrow\" d=\"M12 10.2v7.1m-3-3 3 3 3-3\"></path></g><g class=\"tf-import-icon-loaded\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-loaded-check\" d=\"m8.5 14.1 2.2 2.2 4.9-5.1\"></path></g></svg></button>\n              <button type=\"button\" class=\"tf-action-box tf-action-export\" id=\"tf-btn-export-main\">Export</button>\n            </div>\n            <div class=\"tf-action-row tf-action-row-secondary\" id=\"tf-addmode-actions2-main\" aria-label=\"Add Analis, Update, dan Refresh\">\n              <div class=\"tf-action-add-wrap\">\n                <button type=\"button\" class=\"tf-action-box tf-action-add\" id=\"tf-btn-add-analyst-main\" disabled>Add Analis</button>\n              </div>\n              <button type=\"button\" class=\"tf-action-box tf-action-update\" id=\"tf-btn-update-main\" disabled>Update</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-refresh tf-refreshlink\" id=\"tf-btn-refresh-main\">Refresh</button>\n            </div>\n            <div id=\"tf-addmode-scanwrap-main\" class=\"tf-action-row tf-action-row-scan\" aria-label=\"Scan Channel dan Pair\">\n              <button type=\"button\" class=\"tf-action-box tf-action-scan\" id=\"tf-btn-scanlink-main\" disabled aria-disabled=\"true\" title=\"Scan Channel ini hanya aktif setelah Import file.\">Scan Channel ini</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-pair tf-pairlink\" id=\"tf-btn-scanpair-main\" disabled aria-disabled=\"true\" title=\"Pair hanya aktif setelah Import file.\">ALL ▾</button>\n            </div>\n          </div>\n          <button type=\"button\" class=\"tf-submit-action-btn\" id=\"tf-btn-submit-main\" disabled>Submit</button>\n        </div>\n\n      </div>\n\n      <p>\n        • <strong>Scan Channel ini</strong> → scan 1 channel yang sedang dibuka (Stats + semua page History).<br>\n        • <strong>Submit</strong> → menjalankan Batch Scan 1x (buka semua channel sekaligus, tunggu semua tab COMPLETE, lalu mulai pendataan otomatis).\n      </p>\n\n      <div class=\"section\">\n        <div class=\"tf-allpairs-row\" aria-label=\"All Analyst Pair Selector\">\n          <span class=\"tf-allpairs-label\">ALL ANALIS PAIR : Selector Pair</span>\n          <select id=\"tf-allpairs-select-main\" multiple style=\"display:none\">\n            <option value=\"__ALL__\" selected>ALL</option>\n            <option value=\"XAUUSD\">XAUUSD</option>\n            <option value=\"EURUSD\">EURUSD</option>\n            <option value=\"GBPUSD\">GBPUSD</option>\n            <option value=\"AUDUSD\">AUDUSD</option>\n            <option value=\"NZDUSD\">NZDUSD</option>\n            <option value=\"USDJPY\">USDJPY</option>\n            <option value=\"EURJPY\">EURJPY</option>\n            <option value=\"GBPJPY\">GBPJPY</option>\n            <option value=\"AUDJPY\">AUDJPY</option>\n            <option value=\"NZDJPY\">NZDJPY</option>\n            <option value=\"CADJPY\">CADJPY</option>\n            <option value=\"CHFJPY\">CHFJPY</option>\n            <option value=\"USDCAD\">USDCAD</option>\n            <option value=\"USDCHF\">USDCHF</option>\n          </select>\n          <div id=\"tf-allpairs-multiselect-main\" class=\"pair-multiselect allpairs-multiselect\">\n            <div class=\"pair-multiselect-display\">\n              <span class=\"pair-multiselect-label\">ALL</span>\n              <span class=\"pair-multiselect-arrow\">▾</span>\n            </div>\n            <div class=\"pair-multiselect-dropdown\">\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"__ALL__\" checked><span>ALL</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"XAUUSD\"><span>XAUUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURUSD\"><span>EURUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPUSD\"><span>GBPUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDUSD\"><span>AUDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDUSD\"><span>NZDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDJPY\"><span>USDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURJPY\"><span>EURJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPJPY\"><span>GBPJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDJPY\"><span>AUDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDJPY\"><span>NZDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CADJPY\"><span>CADJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CHFJPY\"><span>CHFJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCAD\"><span>USDCAD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCHF\"><span>USDCHF</span></label>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"form-label tf-analyst-columns410\"><span>Link Analis</span><span>Nama</span><span>Pair</span><span aria-hidden=\"true\"></span></div>\n        <div id=\"analyst-links-container\" class=\"analyst-links\">\n        <div class=\"analyst-row\">\n          <input type=\"text\" class=\"form-input analyst-link-input\" placeholder=\"Kolom untuk isi Link Analis\">\n          <button type=\"button\" class=\"btn analyst-paste-btn\">Paste</button>\n          <div class=\"pair-multiselect\">\n            <div class=\"pair-multiselect-display\">\n              <span class=\"pair-multiselect-label\">ALL</span>\n              <span class=\"pair-multiselect-arrow\">▾</span>\n            </div>\n            <div class=\"pair-multiselect-dropdown\">\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"__ALL__\" checked>\n                <span>ALL</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"XAUUSD\">\n                <span>XAUUSD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"EURUSD\">\n                <span>EURUSD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"GBPUSD\">\n                <span>GBPUSD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"AUDUSD\">\n                <span>AUDUSD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"NZDUSD\">\n                <span>NZDUSD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"USDJPY\">\n                <span>USDJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"EURJPY\">\n                <span>EURJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"GBPJPY\">\n                <span>GBPJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"AUDJPY\">\n                <span>AUDJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"NZDJPY\">\n                <span>NZDJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"CADJPY\">\n                <span>CADJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"CHFJPY\">\n                <span>CHFJPY</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"USDCAD\">\n                <span>USDCAD</span>\n              </label>\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"USDCHF\">\n                <span>USDCHF</span>\n              </label>\n            </div>\n          </div>\n          <select class=\"form-input analyst-pair-select\" multiple style=\"display:none;\">\n            <option value=\"__ALL__\" selected>ALL</option>\n            <option value=\"XAUUSD\">XAUUSD</option>\n            <option value=\"EURUSD\">EURUSD</option>\n            <option value=\"GBPUSD\">GBPUSD</option>\n            <option value=\"AUDUSD\">AUDUSD</option>\n            <option value=\"NZDUSD\">NZDUSD</option>\n            <option value=\"USDJPY\">USDJPY</option>\n            <option value=\"EURJPY\">EURJPY</option>\n            <option value=\"GBPJPY\">GBPJPY</option>\n            <option value=\"AUDJPY\">AUDJPY</option>\n            <option value=\"NZDJPY\">NZDJPY</option>\n            <option value=\"CADJPY\">CADJPY</option>\n            <option value=\"CHFJPY\">CHFJPY</option>\n            <option value=\"USDCAD\">USDCAD</option>\n            <option value=\"USDCHF\">USDCHF</option>\n          </select>\n          <button type=\"button\" class=\"btn danger analyst-remove-btn\">✕</button>\n        </div>\n      \n      <div class=\"remember-links-row\">\n        <label class=\"remember-links-label\">\n          <input type=\"checkbox\" id=\"remember-all-links-checkbox\" checked>\n          Remember semua Link Analis\n        </label>\n      </div>\n</div>\n      <button id=\"add-analyst-btn\" class=\"btn secondary analyst-add-btn\" type=\"button\">Tambahkan Analis</button>\n      <button id=\"batch-scan-btn\" class=\"btn\" type=\"button\">Submit</button>\n      <button id=\"scan-from-isignal-btn\" class=\"btn secondary\" type=\"button\">Scan From iSignal</button>\n    </div>\n\n      <div class=\"buttons-group\">\n        <div class=\"scan-row\">\n          <button id=\"scan-btn\" class=\"btn\" type=\"button\">Scan Channel ini</button>\n          <!-- Pair selector for Scan Channel ini (multi-tick like Link Analis selector) -->\n          <div id=\"scan-pair-multiselect\" class=\"pair-multiselect scan-pair-select\" title=\"Pilih Pair untuk Scan Channel ini\">\n            <div class=\"pair-multiselect-display\">\n              <span class=\"pair-multiselect-label\">ALL</span>\n              <span class=\"pair-multiselect-arrow\">▾</span>\n            </div>\n            <div class=\"pair-multiselect-dropdown\">\n              <label class=\"pair-option\">\n                <input type=\"checkbox\" data-value=\"__ALL__\" checked>\n                <span>ALL</span>\n              </label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"XAUUSD\"><span>XAUUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURUSD\"><span>EURUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPUSD\"><span>GBPUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDUSD\"><span>AUDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDUSD\"><span>NZDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDJPY\"><span>USDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURJPY\"><span>EURJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPJPY\"><span>GBPJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDJPY\"><span>AUDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDJPY\"><span>NZDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CADJPY\"><span>CADJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CHFJPY\"><span>CHFJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCAD\"><span>USDCAD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCHF\"><span>USDCHF</span></label>\n            </div>\n            <!-- hidden select as source-of-truth (re-use existing logic) -->\n            <select id=\"scan-pair-select\" multiple style=\"display:none\">\n              <option value=\"__ALL__\" selected>ALL</option>\n              <option value=\"XAUUSD\">XAUUSD</option>\n              <option value=\"EURUSD\">EURUSD</option>\n              <option value=\"GBPUSD\">GBPUSD</option>\n              <option value=\"AUDUSD\">AUDUSD</option>\n              <option value=\"NZDUSD\">NZDUSD</option>\n              <option value=\"USDJPY\">USDJPY</option>\n              <option value=\"EURJPY\">EURJPY</option>\n              <option value=\"GBPJPY\">GBPJPY</option>\n              <option value=\"AUDJPY\">AUDJPY</option>\n              <option value=\"NZDJPY\">NZDJPY</option>\n              <option value=\"CADJPY\">CADJPY</option>\n              <option value=\"CHFJPY\">CHFJPY</option>\n              <option value=\"USDCAD\">USDCAD</option>\n              <option value=\"USDCHF\">USDCHF</option>\n            </select>\n          </div>\n        </div>\n      </div>\n\n    <div class=\"scan-channel-status-block\">\n      <div class=\"scan-channel-status-title\"><span>Status Scan Channel ini</span><span id=\"scan-channel-status-clear\" class=\"scan-channel-status-clear\">Clear</span></div>\n\n      <div class=\"scan-channel-saved-title\">Saved (Import / Export)</div>\n      <div id=\"scan-channel-saved-list\" class=\"scan-channel-saved-list\"></div>\n\n      <div class=\"scan-channel-saved-title\" style=\"margin-top: 10.8px;\">Progress Scan</div>\n        <div id=\"scan-channel-status-list\" class=\"scan-channel-status-list\">\n          <div class=\"scan-progress-table\">\n            <div class=\"scan-progress-table-title\">Overall</div>\n            <div id=\"scan-progress-overall\" class=\"scan-progress-table-list\"></div>\n          </div>\n          <div class=\"scan-progress-table\">\n            <div class=\"scan-progress-table-title\">Batch</div>\n            <div id=\"scan-progress-detail\" class=\"scan-progress-table-list batch\"></div>\n          </div>\n        </div>\n    </div>\n\n      <div class=\"hint\">\n        Batch Scan sekarang hanya 1x pass, tapi menunggu semua tab channel statusnya COMPLETE sebelum mulai pendataan.\n      </div>\n    </div>\n\n    <!-- iSignal view (links auto-filled) -->\n    <div id=\"isignal-view\" style=\"display:none;\">\n      <div style=\"display:flex; align-items:center; justify-content: space-between; gap: 7.2px; margin-bottom: 7.2px;\">\n        <a id=\"isignal-back-link\" href=\"#\" style=\"color: var(--fg); text-decoration: none; font-size: 10.8px;\">← kembali</a>\n        <div style=\"font-size: 10.8px; font-weight: 700; opacity: .95;\">Scan From iSignal</div>\n      </div>\n\n      <!-- Keep Time Range + actions visible on Scan From iSignal too (same as Dashboard view) -->\n      <div class=\"dashboard-top-controls\" style=\"margin-bottom: 7.2px;\">\n        <div class=\"profile-time-range\">\n          <div class=\"tf-tr-header\">\n            <div class=\"tf-tr-left\">\n              <span class=\"tf-tr-title\" id=\"tf-tr-title-isignal\">Time Range <span id=\"tf-time-range-paren-isignal\" class=\"tf-tr-paren\">(ALL)</span></span>\n            </div>\n            <button type=\"button\" class=\"tf-tr-arrowbtn\" id=\"tf-tr-toggle-isignal\" aria-expanded=\"false\">▾</button>\n          </div>\n          <div class=\"tf-tr-panel\" id=\"tf-tr-panel-isignal\" hidden>\n            <div class=\"tf-tr-options\">\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"m3\">3 Month</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"m6\">6 Month</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y1\">1 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y2\">2 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y3\">3 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"y5\">5 Year</button>\n              <button type=\"button\" class=\"tf-tr-option\" data-value=\"all_time\">ALL</button>\n            </div>\n          </div>\n        </div>\n\n                <div class=\"tf-actions-grid\" data-tf-actions=\"isignal\">\n          <div class=\"tf-actions-left\">\n            <div class=\"tf-action-row tf-action-row-primary\" aria-label=\"Import dan Export\">\n              <button type=\"button\" class=\"tf-action-box tf-action-import\" id=\"tf-btn-import-isignal\" data-tf-import-state=\"empty\" title=\"Pilih satu file untuk Import, atau pilih beberapa file JSON untuk Combine\"><span class=\"tf-import-label\">Import / Combine</span><svg class=\"tf-import-state-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><g class=\"tf-import-icon-ready\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-ready-arrow\" d=\"M12 10.2v7.1m-3-3 3 3 3-3\"></path></g><g class=\"tf-import-icon-loaded\"><path d=\"M5.25 2.75h8.9l4.6 4.6v13.9H5.25z\"></path><path d=\"M14.15 2.75v4.6h4.6\"></path><path class=\"tf-import-loaded-check\" d=\"m8.5 14.1 2.2 2.2 4.9-5.1\"></path></g></svg></button>\n              <button type=\"button\" class=\"tf-action-box tf-action-export\" id=\"tf-btn-export-isignal\">Export</button>\n            </div>\n            <div class=\"tf-action-row tf-action-row-secondary\" id=\"tf-addmode-actions2-isignal\" aria-label=\"Add Analis, Update, dan Refresh\">\n              <div class=\"tf-action-add-wrap\">\n                <button type=\"button\" class=\"tf-action-box tf-action-add\" id=\"tf-btn-add-analyst-isignal\" disabled>Add Analis</button>\n              </div>\n              <button type=\"button\" class=\"tf-action-box tf-action-update\" id=\"tf-btn-update-isignal\" disabled>Update</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-refresh tf-refreshlink\" id=\"tf-btn-refresh-isignal\">Refresh</button>\n            </div>\n            <div id=\"tf-addmode-scanwrap-isignal\" class=\"tf-action-row tf-action-row-scan\" aria-label=\"Scan Channel dan Pair\">\n              <button type=\"button\" class=\"tf-action-box tf-action-scan\" id=\"tf-btn-scanlink-isignal\" disabled aria-disabled=\"true\" title=\"Scan Channel ini hanya aktif setelah Import file.\">Scan Channel ini</button>\n              <button type=\"button\" class=\"tf-action-box tf-action-pair tf-pairlink\" id=\"tf-btn-scanpair-isignal\" disabled aria-disabled=\"true\" title=\"Pair hanya aktif setelah Import file.\">ALL ▾</button>\n            </div>\n          </div>\n          <button type=\"button\" class=\"tf-submit-action-btn\" id=\"tf-btn-submit-isignal\" disabled>Submit</button>\n        </div>\n\n      </div>\n\n      <p style=\"margin-bottom: 7.2px;\">\n        Halaman ini akan mengambil semua <strong>channel iSignal</strong> yang statusnya <strong>Aktif</strong>, lalu otomatis mengisi Link Analis.\n      </p>\n      <div class=\"section\">\n        <div class=\"tf-allpairs-row\" aria-label=\"All Analyst Pair Selector\">\n          <span class=\"tf-allpairs-label\">ALL ANALIS PAIR : Selector Pair</span>\n          <select id=\"tf-allpairs-select-isignal\" multiple style=\"display:none\">\n            <option value=\"__ALL__\" selected>ALL</option>\n            <option value=\"XAUUSD\">XAUUSD</option>\n            <option value=\"EURUSD\">EURUSD</option>\n            <option value=\"GBPUSD\">GBPUSD</option>\n            <option value=\"AUDUSD\">AUDUSD</option>\n            <option value=\"NZDUSD\">NZDUSD</option>\n            <option value=\"USDJPY\">USDJPY</option>\n            <option value=\"EURJPY\">EURJPY</option>\n            <option value=\"GBPJPY\">GBPJPY</option>\n            <option value=\"AUDJPY\">AUDJPY</option>\n            <option value=\"NZDJPY\">NZDJPY</option>\n            <option value=\"CADJPY\">CADJPY</option>\n            <option value=\"CHFJPY\">CHFJPY</option>\n            <option value=\"USDCAD\">USDCAD</option>\n            <option value=\"USDCHF\">USDCHF</option>\n          </select>\n          <div id=\"tf-allpairs-multiselect-isignal\" class=\"pair-multiselect allpairs-multiselect\">\n            <div class=\"pair-multiselect-display\">\n              <span class=\"pair-multiselect-label\">ALL</span>\n              <span class=\"pair-multiselect-arrow\">▾</span>\n            </div>\n            <div class=\"pair-multiselect-dropdown\">\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"__ALL__\" checked><span>ALL</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"XAUUSD\"><span>XAUUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURUSD\"><span>EURUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPUSD\"><span>GBPUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDUSD\"><span>AUDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDUSD\"><span>NZDUSD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDJPY\"><span>USDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURJPY\"><span>EURJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPJPY\"><span>GBPJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDJPY\"><span>AUDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDJPY\"><span>NZDJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CADJPY\"><span>CADJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CHFJPY\"><span>CHFJPY</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCAD\"><span>USDCAD</span></label>\n              <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCHF\"><span>USDCHF</span></label>\n            </div>\n          </div>\n        </div>\n\n        <label class=\"form-label\" style=\"margin-bottom: 5.4px;\">Link Analis (hasil scan iSignal):</label>\n        <div id=\"isignal-links-container\" class=\"analyst-links\">\n          <div class=\"analyst-row\">\n            <input type=\"text\" class=\"form-input analyst-link-input\" placeholder=\"Link channel\" readonly>\n            <button type=\"button\" class=\"btn secondary analyst-name-btn\">Nama</button>\n            <div class=\"pair-multiselect\">\n              <div class=\"pair-multiselect-display\">\n                <span class=\"pair-multiselect-label\">ALL</span>\n                <span class=\"pair-multiselect-arrow\">▾</span>\n              </div>\n              <div class=\"pair-multiselect-dropdown\">\n                <label class=\"pair-option\">\n                  <input type=\"checkbox\" data-value=\"__ALL__\" checked>\n                  <span>ALL</span>\n                </label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"XAUUSD\"><span>XAUUSD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURUSD\"><span>EURUSD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPUSD\"><span>GBPUSD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDUSD\"><span>AUDUSD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDUSD\"><span>NZDUSD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDJPY\"><span>USDJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"EURJPY\"><span>EURJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"GBPJPY\"><span>GBPJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"AUDJPY\"><span>AUDJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"NZDJPY\"><span>NZDJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CADJPY\"><span>CADJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"CHFJPY\"><span>CHFJPY</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCAD\"><span>USDCAD</span></label>\n                <label class=\"pair-option\"><input type=\"checkbox\" data-value=\"USDCHF\"><span>USDCHF</span></label>\n              </div>\n            </div>\n            <select class=\"form-input analyst-pair-select\" multiple style=\"display:none;\">\n              <option value=\"__ALL__\" selected>ALL</option>\n              <option value=\"XAUUSD\">XAUUSD</option>\n              <option value=\"EURUSD\">EURUSD</option>\n              <option value=\"GBPUSD\">GBPUSD</option>\n              <option value=\"AUDUSD\">AUDUSD</option>\n              <option value=\"NZDUSD\">NZDUSD</option>\n              <option value=\"USDJPY\">USDJPY</option>\n              <option value=\"EURJPY\">EURJPY</option>\n              <option value=\"GBPJPY\">GBPJPY</option>\n              <option value=\"AUDJPY\">AUDJPY</option>\n              <option value=\"NZDJPY\">NZDJPY</option>\n              <option value=\"CADJPY\">CADJPY</option>\n              <option value=\"CHFJPY\">CHFJPY</option>\n              <option value=\"USDCAD\">USDCAD</option>\n              <option value=\"USDCHF\">USDCHF</option>\n            </select>\n            <button type=\"button\" class=\"btn danger analyst-remove-btn\">✕</button>\n          </div>\n        </div>\n                <button id=\"add-analyst-isignal-btn\" class=\"btn secondary analyst-add-btn\" type=\"button\" style=\"margin-top: 5.4px;\">Add Analis</button>\n<button id=\"batch-scan-isignal-btn\" class=\"btn\" type=\"button\">Submit</button>\n        <div id=\"isignal-status\" class=\"login-status\" style=\"margin-top: 5.4px;\"></div>\n      <div class=\"scan-channel-status-block\" style=\"margin-top: 9px;\">\n        <div class=\"scan-channel-status-title\"><span>Status Scan Channel ini</span><span id=\"scan-channel-status-clear-isignal\" class=\"scan-channel-status-clear\">Clear</span></div>\n\n        <div class=\"scan-channel-saved-title\">Saved (Import / Export)</div>\n        <div id=\"scan-channel-saved-list-isignal\" class=\"scan-channel-saved-list\"></div>\n\n        <div class=\"scan-channel-saved-title\" style=\"margin-top: 10.8px;\">Progress Scan</div>\n        <div id=\"scan-channel-status-list-isignal\" class=\"scan-channel-status-list\">\n          <div class=\"scan-progress-table\">\n            <div class=\"scan-progress-table-title\">Overall</div>\n            <div id=\"scan-progress-overall-isignal\" class=\"scan-progress-table-list\"></div>\n          </div>\n          <div class=\"scan-progress-table\">\n            <div class=\"scan-progress-table-title\">Batch</div>\n            <div id=\"scan-progress-detail-isignal\" class=\"scan-progress-table-list batch\"></div>\n          </div>\n        </div>\n      </div>\n      </div>\n\n    </div>\n\n    <!-- Common actions (available in dashboard & iSignal view) -->\n    <div class=\"buttons-group\" id=\"common-actions\">\n      <button id=\"open-dashboard-btn\" class=\"btn secondary\" type=\"button\">Buka Dashboard</button>\n      <button id=\"clear-data-btn\" class=\"btn danger\" type=\"button\">Hapus semua data tersimpan</button>\n      <button id=\"logout-btn\" class=\"btn secondary\" type=\"button\">Logout (Keluar akun TF)</button>\n    </div>\n\n    <div id=\"status\"></div>\n\n    <!-- REV216: Power / Sleep event log -->\n    <div id=\"tf-power-sleep-card\" class=\"scan-channel-status-block\" style=\"margin-top:10.8px;padding:9px;border:1px solid rgba(148,163,184,.18);border-radius:10.8px;background:rgba(15,23,42,.32);\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;gap:7.2px;margin-bottom:5.4px;\">\n        <div style=\"font-weight:700;font-size:10.8px;color:#e5e7eb;\">Power / Sleep Event Log</div>\n        <div style=\"display:flex;align-items:center;gap:6.3px;\">\n          <span id=\"tf-power-sleep-badge\" style=\"font-size:9px;font-weight:800;padding:2.7px 7.2px;border-radius:899.1px;border:1px solid rgba(148,163,184,.25);color:#94a3b8;background:rgba(15,23,42,.7);\">OFF</span>\n          <button id=\"tf-power-sleep-clear\" type=\"button\" style=\"border:0;background:transparent;color:#7dd3fc;font-size:9px;cursor:pointer;padding:1.8px;\">Clear</button>\n        </div>\n      </div>\n      <div id=\"tf-power-sleep-summary\" style=\"font-size:9px;line-height:1.45;color:#94a3b8;margin-bottom:6.3px;\">Stay Awake OFF — mengikuti pengaturan sleep Windows/macOS.</div>\n      <div id=\"tf-power-sleep-log\" style=\"display:flex;flex-direction:column;gap:4.5px;max-height:104.4px;overflow:auto;padding-right:1.8px;\">\n        <div style=\"font-size:9px;color:#64748b;\">Belum ada event power.</div>\n      </div>\n    </div>\n  </div>\n\n\n  \n  <div class=\"tf-copyright-footer\">\n    <div>© 2025 <a href=\"mailto:wiliejonathan@gmail.com\">wiliejonathan@gmail.com</a></div>\n    <div>Instagram <a class=\"tf-ig-link\" href=\"https://www.instagram.com/wilie_jonathan/\" target=\"_blank\" rel=\"noopener noreferrer\">Wilie_jonathan</a></div>\n  </div>\n\n\n  <!-- Confirm modal (used for delete analyst) -->\n  <div id=\"tf-confirm-overlay\" class=\"tf-modal-overlay\" hidden>\n    <div class=\"tf-modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"tf-confirm-title\">\n      <div id=\"tf-confirm-title\" class=\"tf-modal-title\">Hapus Analis?</div>\n      <div class=\"tf-modal-actions\">\n        <button id=\"tf-confirm-no\" class=\"btn secondary\" type=\"button\">No</button>\n        <button id=\"tf-confirm-yes\" class=\"btn danger\" type=\"button\">Yes</button>\n      </div>\n    </div>\n  </div>\n\n";

// REV213 — login click recovery. The protected popup scripts are loaded only after
// Device Lock + integrity verification. If the user clicks Masuk during that short boot
// window, remember the click and replay it once the normal login handler is attached.
window.__tfLoginUiReady = false;
window.__tfEarlyLoginClickPending = false;
try {
  document.addEventListener('click', (event) => {
    try {
      const target = event && event.target && event.target.closest ? event.target.closest('#login-btn') : null;
      if (!target || window.__tfLoginUiReady) return;
      window.__tfEarlyLoginClickPending = true;
      const st = document.getElementById('login-status');
      if (st) st.textContent = 'Menyiapkan proses login...';
    } catch (e) { }
  }, true);
} catch (e) { }
(() => {
'use strict';
const TF_LICENSE_API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
const TF_LICENSE_API_URL = TF_LICENSE_API_BASE + '/license-check';
const TF_LICENSE_HEALTH_URL = TF_LICENSE_API_BASE;
const TF_LICENSE_CREDENTIALS_KEY = 'tfLicenseCredentials';
const TF_LICENSE_DEVICE_KEY = 'tfLicenseDeviceId';
const TF_LICENSE_STATE_KEY = 'tfLicenseState';
const TF_LICENSE_PRESENCE_ENDPOINT_KEY = 'tfLicensePresenceEndpointV1';
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
let tfLicenseManualRefreshInProgress = false;
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
function tfStorageRemove(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.remove(keys, () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
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
presenceEndpoint: String(source.presenceEndpoint || ''),
presenceProtocol: String(source.presenceProtocol || ''),
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
if (normalized.presenceEndpoint) {
try { await tfStorageSet({ [TF_LICENSE_PRESENCE_ENDPOINT_KEY]: normalized.presenceEndpoint }); } catch (e) { }
}
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
const refreshing = tfLicenseManualRefreshInProgress === true;
return '<button type="button" class="tf-license-status-refresh' + (refreshing ? ' tf-license-refreshing' : '') + '" title="' + (refreshing ? 'Memeriksa status aktivasi...' : 'Refresh status aktivasi') + '" aria-label="Refresh status aktivasi"' + (refreshing ? ' disabled' : '') + '>' +
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
if (tfLicenseManualRefreshInProgress) {
loginText = 'Memeriksa lisensi...';
profileMainText = 'Memeriksa status aktivasi...';
}
else if (kind === 'offline-expired') {
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
if (loginBadge.textContent !== loginText)
loginBadge.textContent = loginText;
loginBadge.classList.toggle('tf-license-trial', kind === 'trial');
loginBadge.classList.toggle('tf-license-expired', kind === 'expired');
loginBadge.classList.toggle('tf-license-blocked', kind === 'blocked' || kind === 'offline-expired');
let desiredLoginTitle = result.expiresAt ? 'Berakhir: ' + tfFormatExpiryDate(result.expiresAt, true) : loginText;
if (result.isOffline && result.valid === true) {
desiredLoginTitle += ' • Offline — verifikasi tertunda';
}
else if (result.verificationPending && result.valid === true) {
desiredLoginTitle += ' • Server lisensi belum merespons; memakai data terakhir';
}
if (loginBadge.title !== desiredLoginTitle)
loginBadge.title = desiredLoginTitle;
}
const showUpgradeLink = kind !== 'blocked' && kind !== 'offline-expired';
if (showUpgradeLink) {
profileHtml += '<button type="button" class="tf-license-upgrade-link">Upgrade Plan / Check Status</button>';
}
profileEls.forEach((el) => {
const htmlChanged = el.innerHTML !== profileHtml;
if (htmlChanged)
el.innerHTML = profileHtml;
el.classList.toggle('tf-license-trial', kind === 'trial');
el.classList.toggle('tf-license-expired', kind === 'expired');
el.classList.toggle('tf-license-blocked', kind === 'blocked' || kind === 'offline-expired');
if (!htmlChanged)
return;
const refreshButton = el.querySelector('.tf-license-status-refresh');
if (refreshButton) {
refreshButton.addEventListener('click', async (event) => {
event.preventDefault();
event.stopPropagation();
if (tfLicenseManualRefreshInProgress)
return;
tfLicenseManualRefreshInProgress = true;
refreshButton.disabled = true;
refreshButton.classList.add('tf-license-refreshing');
refreshButton.title = 'Memeriksa status aktivasi...';
tfRenderLicenseStatus();
try {
await tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: false,
requestOptions: { timeoutMs: 15000, attempts: 2, retryDelayMs: 650 }
});
}
catch (e) {
}
finally {
tfLicenseManualRefreshInProgress = false;
tfRenderLicenseStatus();
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
'LICENSE_NOT_FOUND',
'INVALID_LICENSE',
'INVALID_TOKEN',
'TOKEN_INVALID',
'LICENSE_REVOKED',
'LICENSE_DELETED',
'EMAIL_NOT_FOUND',
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
const result = await tfCallLicenseApi('validate', email, token, opts.requestOptions || (opts.quick === true
? { timeoutMs: TF_LICENSE_GATE_REQUEST_TIMEOUT_MS, attempts: 1, retryDelayMs: 0 }
: undefined));
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
const result = await tfValidateSavedLicense({
requireFreshServer: false,
allowStoredFallback: true,
requestOptions: opts.requestOptions
});
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
// REV349_STRICT_FRESH_GATE: never authorize protected UI from a stale cached license.
return false;
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
function tfIsExplicitServerInvalidV349(result) {
if (!result || result.valid === true) return false;
const code = String(result.code || result.error || '').trim().toUpperCase();
// Any structured server response saying valid=false is authoritative for the
// live watcher. Network/server transport errors throw and are handled separately.
return Boolean(code || result.message || result.ok === false || result.success === false);
}
let tfLicenseLiveWatchRunningV349 = false;
async function tfForceActivationV349(result) {
if (tfLicenseLiveWatchRunningV349 === 'KICKED') return;
tfLicenseLiveWatchRunningV349 = 'KICKED';
if (tfLicenseRecheckTimer) { clearInterval(tfLicenseRecheckTimer); tfLicenseRecheckTimer = null; }
const message = String(result && (result.message || result.code || result.error) || 'Lisensi tidak valid lagi.');
const normalized = tfNormalizeLicenseResult({ ...(result || {}), valid:false, success:false, message, code:String(result && (result.code || result.error) || 'LICENSE_REVOKED') });
tfLicenseValid = false;
tfLicenseFreshServerVerified = false;
tfLicenseResult = normalized;
tfSetServerAuthorization(false);
try { await tfStorageRemove([
  TF_LICENSE_CREDENTIALS_KEY, TF_LICENSE_STATE_KEY,
  'tfDeviceSessionTokenV1','tfDeviceLockStateV1','tfDevicePendingApprovalV1',
  'tfDeviceApprovedTransferV1','tfDeviceApprovalPopupShownV1'
]); } catch (e) { }
try { await tfStopProtectedJobsBestEffort(); } catch (e) { }
try { window.dispatchEvent(new CustomEvent('tf-license-invalid', { detail: normalized })); } catch (e) { }
if (tfIsPrimaryPopupPage()) {
  tfShowLicenseUi(message, false);
} else {
  try { location.replace(chrome.runtime.getURL('popup.html')); }
  catch (e) { tfShowServerGate('Lisensi tidak valid', message, true); }
}
}
async function tfLiveLicenseWatchTickV349() {
if (tfLicenseLiveWatchRunningV349 === true || tfLicenseLiveWatchRunningV349 === 'KICKED') return;
if (typeof document !== 'undefined' && document.hidden) return;
tfLicenseLiveWatchRunningV349 = true;
try {
  const snapshot = await tfReadStoredLicense();
  const credentials = snapshot.credentials || {};
  const email = tfNormalizeEmail(credentials.email);
  const token = tfNormalizeToken(credentials.token);
  if (!email || !token) {
    await tfForceActivationV349({ valid:false, code:'NO_SAVED_LICENSE', message:'Lisensi tidak tersedia. Silakan aktivasi kembali.' });
    return;
  }
  const result = await tfCallLicenseApi('validate', email, token, { timeoutMs: 6500, attempts: 1, retryDelayMs: 0 });
  if (result && result.valid === true) {
    result.email = result.email || email;
    await tfSaveValidLicense(result, { ...credentials, email, token });
    tfLicenseValid = true;
    tfLicenseFreshServerVerified = true;
    tfSetServerAuthorization(true);
    tfLicenseResult = tfNormalizeLicenseResult(result);
    return;
  }
  if (tfIsExplicitServerInvalidV349(result)) await tfForceActivationV349(result);
} catch (e) {
  // Temporary transport failure is not a revocation. Retry on the next short interval.
} finally {
  if (tfLicenseLiveWatchRunningV349 !== 'KICKED') tfLicenseLiveWatchRunningV349 = false;
}
}
function tfScheduleRecheck() {
if (tfLicenseRecheckTimer) {
clearInterval(tfLicenseRecheckTimer);
tfLicenseRecheckTimer = null;
}
// REV367: expiry itself is enforced by the local server-aligned countdown;
// this 60-second server safety check catches manual block/delete/token changes
// without hammering Cloudflare while the UI remains open.
tfLicenseRecheckTimer = setInterval(() => { void tfLiveLicenseWatchTickV349(); }, 60000);
setTimeout(() => { void tfLiveLicenseWatchTickV349(); }, 450);
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
if (tfIsPrimaryPopupPage()) {
const initialSnapshot = await tfReadStoredLicense();
const initialEmail = tfNormalizeEmail(initialSnapshot && initialSnapshot.credentials && initialSnapshot.credentials.email);
const initialToken = tfNormalizeToken(initialSnapshot && initialSnapshot.credentials && initialSnapshot.credentials.token);
if (!initialEmail || !initialToken) {
tfLicenseValid = false;
tfLicenseFreshServerVerified = false;
tfSetServerAuthorization(false);
tfShowLicenseUi('Masukkan email dan token untuk mengaktifkan extension.', false);
return false;
}
}
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

window.addEventListener('focus', () => { if (tfLicenseValid) void tfLiveLicenseWatchTickV349(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && tfLicenseValid) void tfLiveLicenseWatchTickV349(); });
function tfGetISignalUsersAccessState() {
const result = tfLicenseResult || {};
const known = result.isignalUsersAccessKnown === true;
const duration = String(result.duration || '').trim().toUpperCase();
const reason = String(result.isignalUsersAccessReason || '').trim().toUpperCase();
const expiresAt = String(result.isignalUsersExpiresAt || '');
const included = result.isignalUsersIncluded === true;
const addonRequired = result.isignalUsersAddonRequired === true;
const addonPlan = String(result.isignalUsersPlan || '').trim().toUpperCase();
let access = result.valid === true && result.isignalUsersAccess === true;
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
known,
access,
included,
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
if (!tfIsPrimaryPopupPage()) {
if (document.body) {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}
else {
document.addEventListener('DOMContentLoaded', () => {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}, { once: true });
}
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
function setStatus(text) {
const el = document.getElementById('status');
if (el) {
const nextText = text || '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
let __tfConfirmModalInited = false;
let __tfConfirmModalResolve = null;
let __tfLastScanChannelMeta = null;
let __tfPendingAddAnalystRowSeq = 0;
function tf_makePendingAddAnalystRowToken() {
try {
__tfPendingAddAnalystRowSeq += 1;
return 'tf_pending_add_' + Date.now() + '_' + __tfPendingAddAnalystRowSeq + '_' + Math.random().toString(36).slice(2, 8);
}
catch (e) {
return 'tf_pending_add_' + Date.now();
}
}
function tf_markPendingAddAnalystRow(row) {
try {
if (!row || !row.dataset)
return '';
const token = row.dataset.tfPendingAddToken || tf_makePendingAddAnalystRowToken();
row.dataset.tfPendingAddAnalyst = '1';
row.dataset.tfPendingAddToken = token;
row.dataset.tfPendingAddCreatedAt = String(Date.now());
delete row.dataset.tfPendingScanSession;
return token;
}
catch (e) {
return '';
}
}
function tf_clearPendingAddAnalystRowMarkers(row) {
try {
if (!row || !row.dataset)
return;
delete row.dataset.tfPendingAddAnalyst;
delete row.dataset.tfPendingAddToken;
delete row.dataset.tfPendingAddCreatedAt;
delete row.dataset.tfPendingScanSession;
}
catch (e) { }
}
function tf_findPendingAddAnalystRow(token, uiSessionId) {
try {
const container = document.getElementById('analyst-links-container');
if (!container)
return null;
const rows = Array.from(container.querySelectorAll('.analyst-row[data-tf-pending-add-analyst="1"]'));
const wantedToken = token ? String(token) : '';
const wantedSession = uiSessionId ? String(uiSessionId) : '';
if (wantedToken) {
const byToken = rows.find((row) => row && row.dataset && String(row.dataset.tfPendingAddToken || '') === wantedToken);
if (byToken)
return byToken;
}
if (wantedSession) {
const bySession = rows.find((row) => row && row.dataset && String(row.dataset.tfPendingScanSession || '') === wantedSession);
if (bySession)
return bySession;
}
return null;
}
catch (e) {
return null;
}
}
function tf_bindLatestPendingAddAnalystRowToScan(uiSessionId) {
try {
const container = document.getElementById('analyst-links-container');
if (!container)
return '';
let rows = Array.from(container.querySelectorAll('.analyst-row[data-tf-pending-add-analyst="1"]'));
rows = rows.filter((row) => {
try {
const sess = row && row.dataset ? String(row.dataset.tfPendingScanSession || '') : '';
return !sess || sess === String(uiSessionId || '');
}
catch (e) {
return false;
}
});
if (!rows.length)
return '';
rows.sort((a, b) => {
const aa = parseInt(a && a.dataset ? a.dataset.tfPendingAddCreatedAt || '0' : '0', 10) || 0;
const bb = parseInt(b && b.dataset ? b.dataset.tfPendingAddCreatedAt || '0' : '0', 10) || 0;
return aa - bb;
});
const row = rows[rows.length - 1];
if (!row || !row.dataset)
return '';
const token = row.dataset.tfPendingAddToken || tf_markPendingAddAnalystRow(row);
row.dataset.tfPendingScanSession = String(uiSessionId || '');
return String(token || '');
}
catch (e) {
return '';
}
}
function tf_removePendingAddAnalystRowForScan(metaOrToken, uiSessionId) {
try {
let token = '';
let session = uiSessionId ? String(uiSessionId) : '';
if (metaOrToken && typeof metaOrToken === 'object') {
token = metaOrToken.pendingRowToken ? String(metaOrToken.pendingRowToken) : '';
if (!session && metaOrToken.uiSessionId)
session = String(metaOrToken.uiSessionId);
}
else if (metaOrToken) {
token = String(metaOrToken);
}
const row = tf_findPendingAddAnalystRow(token, session);
if (!row)
return false;
try {
row.remove();
}
catch (e) {
if (row.parentNode)
row.parentNode.removeChild(row);
}
try {
saveRememberedAnalystLinks();
}
catch (e) { }
try {
tf_applyImportLockFromStorageToUI();
}
catch (e) { }
return true;
}
catch (e) {
return false;
}
}
function tf_initConfirmModal() {
try {
if (__tfConfirmModalInited)
return;
__tfConfirmModalInited = true;
const overlay = document.getElementById('tf-confirm-overlay');
const btnNo = document.getElementById('tf-confirm-no');
const btnYes = document.getElementById('tf-confirm-yes');
if (!overlay || !btnNo || !btnYes)
return;
const close = (val) => {
try {
overlay.hidden = true;
}
catch (e) {
overlay.style.display = 'none';
}
const r = __tfConfirmModalResolve;
__tfConfirmModalResolve = null;
if (typeof r === 'function')
r(!!val);
};
overlay.addEventListener('click', (e) => {
try {
const modal = overlay.querySelector('.tf-modal');
if (modal && modal.contains(e.target))
return;
}
catch (e2) { }
close(false);
});
btnNo.addEventListener('click', () => close(false));
btnYes.addEventListener('click', () => close(true));
document.addEventListener('keydown', (e) => {
try {
if (!overlay.hidden && (e.key === 'Escape' || e.key === 'Esc')) {
close(false);
}
}
catch (e2) { }
});
}
catch (e) { }
}
function tf_confirmDeleteAnalyst(title = "Hapus Analis?") {
const heading=document.getElementById("tf-confirm-title");
if(heading)heading.textContent=title;
return new Promise((resolve) => {
try {
const overlay = document.getElementById('tf-confirm-overlay');
if (!overlay)
return resolve(false);
if (typeof __tfConfirmModalResolve === 'function') {
try {
__tfConfirmModalResolve(false);
}
catch (e) { }
}
__tfConfirmModalResolve = resolve;
try {
overlay.hidden = false;
}
catch (e) {
overlay.style.display = 'flex';
}
}
catch (e) {
resolve(false);
}
});
}
function tf_normUrlKey(raw) {
try {
const norm = tf_normalizeTfAccountUrl(raw) || (raw ? String(raw).trim() : '');
if (!norm)
return null;
return String(norm).replace(/\/+$/, '');
}
catch (e) {
return null;
}
}
async function tf_resolveAnalystNameViaHiddenTab(channelUrl) {
const urlKey = tf_normUrlKey(channelUrl);
if (!urlKey)
return null;
try {
if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.scripting)
return null;
return await new Promise((resolve) => {
let tabId = null;
let finished = false;
const done = async (name) => {
if (finished)
return;
finished = true;
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
try {
clearTimeout(timer);
}
catch (e) { }
try {
if (tabId != null)
chrome.tabs.remove(tabId);
}
catch (e) { }
resolve(name || null);
};
const timer = setTimeout(() => done(null), 20000);
const onUpdated = (id, info) => {
if (id !== tabId)
return;
if (!info || info.status !== 'complete')
return;
try {
chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const badTitle = (document.title || '').toLowerCase();
if (badTitle.includes('login') || badTitle.includes('masuk')) {
return null;
}
const sels = [
'.channel-name .truncate-text',
'.channel-name .truncate-text',
'.channel-name',
'.content-header h1',
'h1',
'h2',
'.box-title',
'.page-title'
];
let name = '';
for (const sel of sels) {
const el = document.querySelector(sel);
const t = el ? String(el.textContent || '').trim() : '';
if (t && t.length >= 2) {
name = t;
break;
}
}
if (!name) {
const title = String(document.title || '').trim();
if (title) {
name = title.split('|')[0].split(' - ')[0].split(' — ')[0].trim();
}
}
name = String(name || '').replace(/\s+/g, ' ').trim();
if (!name)
return null;
if (/tradersfamily/i.test(name))
return null;
if (/^channels?$/i.test(name))
return null;
if (/^history\s*signal/i.test(name))
return null;
return name;
}
catch (e) {
return null;
}
}
}, (results) => {
try {
const val = results && results[0] && results[0].result ? String(results[0].result).trim() : '';
done(val || null);
}
catch (e) {
done(null);
}
});
}
catch (e) {
done(null);
}
};
try {
chrome.tabs.onUpdated.addListener(onUpdated);
}
catch (e) { }
try {
chrome.tabs.create({ url: urlKey, active: false }, (tab) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!tab || typeof tab.id === 'undefined')
return done(null);
tabId = tab.id;
});
}
catch (e) {
done(null);
}
});
}
catch (e) {
return null;
}
}
async function tf_deleteStoredDataForAnalystRow(rowEl) {
try {
if (!rowEl)
return;
const input = rowEl.querySelector('.analyst-link-input');
const selectEl = rowEl.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
const urlKey = tf_normUrlKey(rawUrl);
if (!urlKey)
return;
const selectedPairs = getSelectedPairsFromSelect(selectEl) || [];
const selUpper = selectedPairs.map((p) => String(p || '').toUpperCase());
const hasAll = !selUpper.length || selUpper.includes(ALL_PAIR_OPTION_VALUE);
const keys = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
'tfHistoryBatchProgressMap',
'tfHistoryBatchOverallMap'
];
const data = await new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (r) => resolve(r || {}));
}
catch (e) {
resolve({});
}
});
const sources = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? { ...data[TF_ANALYST_SOURCES_KEY] }
: {};
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
const noDataPairs = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
const avgSlPips = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
const historySignals = Array.isArray(data && data.tfHistorySignals) ? (data.tfHistorySignals.slice()) : [];
const scoreHistory = Array.isArray(data && data.tfScoreHistory) ? data.tfScoreHistory.slice() : [];
const remembered = Array.isArray(data && data[TF_REMEMBERED_LINKS_KEY]) ? (data[TF_REMEMBERED_LINKS_KEY].slice()) : [];
const nameCache = (data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object')
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const baseNames = new Set();
try {
Object.keys(sources || {}).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
baseNames.add(String(k).trim());
});
}
catch (e) { }
try {
remembered.forEach((it) => {
const u = it && it.url ? tf_normUrlKey(it.url) : null;
if (u && u === urlKey) {
if (it.name)
baseNames.add(String(it.name).trim());
if (it.analystName)
baseNames.add(String(it.analystName).trim());
}
});
}
catch (e) { }
try {
const pill = rowEl.querySelector('.analyst-paste-btn.tf-analyst-name-pill') || rowEl.querySelector('.analyst-name-btn');
const t = pill ? String(pill.textContent || '').trim() : '';
if (t && !/^Channel\s+\d+/i.test(t) && t !== '-' && t.toLowerCase() !== 'paste')
baseNames.add(t);
}
catch (e) { }
if (!baseNames.size) {
try {
const resolved = await tf_resolveAnalystNameViaHiddenTab(urlKey);
if (resolved)
baseNames.add(String(resolved).trim());
}
catch (e) { }
}
const baseList = Array.from(baseNames).filter(Boolean);
const baseSet = new Set(baseList.map((s) => String(s).trim()));
const pairsSet = new Set(selUpper.filter((p) => p && p !== ALL_PAIR_OPTION_VALUE).map((p) => String(p).toUpperCase()));
const parseMonthlyKey = (k) => {
try {
const s = String(k || '').trim();
const m = s.match(/^(.*)\s+\(([A-Za-z0-9]+)\)\s*$/);
if (m)
return { base: String(m[1] || '').trim(), pair: String(m[2] || '').toUpperCase() };
return { base: s, pair: '' };
}
catch (e) {
return { base: String(k || '').trim(), pair: '' };
}
};
try {
Object.keys(sources).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
delete sources[k];
});
baseList.forEach((b) => { if (sources[b])
delete sources[b]; });
}
catch (e) { }
try {
Object.keys(monthlyStats).forEach((k) => {
const { base, pair } = parseMonthlyKey(k);
if (!baseSet.has(base))
return;
if (hasAll) {
delete monthlyStats[k];
return;
}
if (!pair) {
delete monthlyStats[k];
return;
}
if (pairsSet.has(pair))
delete monthlyStats[k];
});
}
catch (e) { }
let nextHistory = historySignals;
try {
nextHistory = historySignals.filter((it) => {
const a = it && (it.analyst || it.analystName) ? String(it.analyst || it.analystName).trim() : '';
const p = it && it.pair ? String(it.pair).toUpperCase() : '';
if (!a)
return true;
if (!baseSet.has(a))
return true;
if (hasAll)
return false;
if (!p)
return false;
return !pairsSet.has(p);
});
}
catch (e) { }
let nextScoreHistory = scoreHistory;
try {
nextScoreHistory = scoreHistory.filter((it) => {
const a = it && (it.analyst || it.analystName) ? String(it.analyst || it.analystName).trim() : '';
if (!a || !baseSet.has(a)) return true;
return false;
});
}
catch (e) { }
const deletePairsInMap = (obj, baseKey) => {
try {
if (!obj || typeof obj !== 'object')
return;
if (!Object.prototype.hasOwnProperty.call(obj, baseKey))
return;
if (hasAll) {
delete obj[baseKey];
return;
}
const cur = obj[baseKey];
if (!cur || typeof cur !== 'object') {
delete obj[baseKey];
return;
}
const next = { ...cur };
pairsSet.forEach((p) => {
delete next[p];
delete next[String(p).toLowerCase()];
});
if (!Object.keys(next).length)
delete obj[baseKey];
else
obj[baseKey] = next;
}
catch (e) { }
};
try {
baseList.forEach((b) => {
const baseKey = String(b).trim();
deletePairsInMap(noDataPairs, baseKey);
deletePairsInMap(avgSlPips, baseKey);
});
}
catch (e) { }
let prog = (data && data.tfHistoryBatchProgressMap && typeof data.tfHistoryBatchProgressMap === 'object')
? { ...data.tfHistoryBatchProgressMap }
: null;
let overall = (data && data.tfHistoryBatchOverallMap && typeof data.tfHistoryBatchOverallMap === 'object')
? { ...data.tfHistoryBatchOverallMap }
: null;
const scrubProgressMap = (mapObj) => {
try {
if (!mapObj || typeof mapObj !== 'object')
return mapObj;
const next = { ...mapObj };
Object.keys(next).forEach((k) => {
const s = String(k || '');
for (const b of baseList) {
if (!b)
continue;
if (s.includes(b)) {
delete next[k];
break;
}
}
});
return next;
}
catch (e) {
return mapObj;
}
};
try {
if (prog)
prog = scrubProgressMap(prog);
}
catch (e) { }
try {
if (overall)
overall = scrubProgressMap(overall);
}
catch (e) { }
const nextRemembered = remembered.filter((it) => {
try {
const raw = it && typeof it === 'object' ? (it.url || it.link || '') : String(it || '');
const k = tf_normUrlKey(raw);
return !k || k !== urlKey;
}
catch (e) {
return true;
}
});
try {
Object.keys(nameCache).forEach((rawKey) => {
try {
const k = tf_normUrlKey(rawKey);
if (k && k === urlKey)
delete nameCache[rawKey];
}
catch (e) { }
});
}
catch (e) { }
try {
if (__tfStableAnalystNameByUrl && typeof __tfStableAnalystNameByUrl === 'object') {
Object.keys(__tfStableAnalystNameByUrl).forEach((rawKey) => {
try {
const k = tf_normUrlKey(rawKey);
if (k && k === urlKey)
delete __tfStableAnalystNameByUrl[rawKey];
}
catch (e) { }
});
}
}
catch (e) { }
try {
if (Array.isArray(window.__tfRememberedLinksUiSnapshot)) {
window.__tfRememberedLinksUiSnapshot = window.__tfRememberedLinksUiSnapshot.filter((it) => {
try {
const k = tf_normUrlKey(it && (it.url || it.link) ? (it.url || it.link) : '');
return !k || k !== urlKey;
}
catch (e) {
return true;
}
});
}
}
catch (e) { }
const payload = {
tfMonthlyStats: monthlyStats,
tfHistorySignals: nextHistory,
tfScoreHistory: nextScoreHistory,
tfNoDataPairs: noDataPairs,
tfAvgSlPips: avgSlPips,
[TF_ANALYST_SOURCES_KEY]: sources,
[TF_ANALYST_NAME_CACHE_KEY]: nameCache,
[TF_REMEMBERED_LINKS_KEY]: nextRemembered
};
if (prog)
payload.tfHistoryBatchProgressMap = prog;
if (overall)
payload.tfHistoryBatchOverallMap = overall;
await new Promise((resolve) => {
try {
chrome.storage.local.set(payload, () => {
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
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({ type: 'open_or_reload_dashboard', activate: false }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
return { ok: true, urlKey, rawUrl };
}
catch (e) {
return { ok: false, urlKey: '', rawUrl: '' };
}
}

function tf_resetAnalystRowToBlank(row, containerId) {
try {
if (!row)
return;
const input = row.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
input.readOnly = false;
input.removeAttribute('readonly');
}
try {
tf_setAnalystRowLocked(row, false);
}
catch (e) { }
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn) {
try {
pasteBtn.classList.remove('tf-analyst-name-pill');
if (pasteBtn.dataset) {
delete pasteBtn.dataset.tfFullName;
}
}
catch (e) { }
pasteBtn.textContent = 'Paste';
pasteBtn.title = '';
pasteBtn.disabled = false;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
try {
if (nameBtn.dataset)
delete nameBtn.dataset.tfFullName;
}
catch (e) { }
nameBtn.textContent = '-';
nameBtn.title = '';
nameBtn.disabled = false;
}
const sel = row.querySelector('.analyst-pair-select');
if (sel) {
Array.from(sel.options || []).forEach((opt) => {
try {
opt.selected = String(opt.value || '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
sel.disabled = false;
}
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
row.querySelectorAll('.pair-multiselect-dropdown input[type="checkbox"]').forEach((cb) => {
try {
cb.disabled = false;
cb.checked = String(cb.dataset && cb.dataset.value ? cb.dataset.value : '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
try {
if (containerId === 'analyst-links-container')
tf_forcePasteButtonInRow(row);
}
catch (e) { }
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
}
catch (e) { }
}
function tf_removeMatchingAnalystUrlFromOtherUiRows(urlKey, excludedRow) {
try {
if (!urlKey)
return;
['analyst-links-container', 'isignal-links-container'].forEach((containerId) => {
const container = document.getElementById(containerId);
if (!container)
return;
const rows = Array.from(container.querySelectorAll('.analyst-row'));
const matches = rows.filter((row) => {
if (!row || row === excludedRow)
return false;
try {
const input = row.querySelector('.analyst-link-input');
const k = tf_normUrlKey(input && input.value ? String(input.value).trim() : '');
return !!k && k === urlKey;
}
catch (e) {
return false;
}
});
matches.forEach((row) => {
try {
const currentRows = Array.from(container.querySelectorAll('.analyst-row'));
if (currentRows.length <= 1)
tf_resetAnalystRowToBlank(row, containerId);
else
row.remove();
}
catch (e) { }
});
});
}
catch (e) { }
}
function tf_maybeExitAddModeAfterRowRemoval() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([
TF_HAS_IMPORTED_BUNDLE_KEY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY
], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const locked = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (!locked)
return;
const baseMain = Math.max(0, parseInt(d && d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] || 0, 10) || 0);
const baseIsignal = Math.max(0, parseInt(d && d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] || 0, 10) || 0);
const mainContainer = document.getElementById('analyst-links-container');
const isignalContainer = document.getElementById('isignal-links-container');
const mainCount = mainContainer ? mainContainer.querySelectorAll('.analyst-row').length : 0;
const isignalCount = isignalContainer ? isignalContainer.querySelectorAll('.analyst-row').length : 0;
const noExtraMain = mainCount <= baseMain;
const noExtraIsignal = isignalCount <= baseIsignal;
if (!noExtraMain || !noExtraIsignal)
return;
chrome.storage.local.set({
[TF_IMPORT_LOCK_ENGAGED_KEY]: false,
[TF_IMPORT_LOCKED_SIGS_KEY]: [],
[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY]: 0,
[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY]: 0
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
tf_addModeEngaged = false;
tf_addModeSigSet = new Set();
}
catch (e) { }
try {
[mainContainer, isignalContainer].forEach((container) => {
if (!container)
return;
Array.from(container.querySelectorAll('.analyst-row')).forEach((row) => tf_setAnalystRowLocked(row, false));
});
}
catch (e) { }
try {
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
tf_setUpdateButtonsEnabled(hasImp, false);
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
try {
setStatus('Row tambahan sudah dihapus. Tombol Update aktif kembali.');
}
catch (e) { }
});
});
}
catch (e) { }
}

function tf_normalizeTfAccountUrl(raw) {
try {
if (!raw)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/^[\s"'`]+/, '').replace(/[\s"'`]+$/, '');
if (/^\/?channels\//i.test(s)) {
s = 'https://account.tradersfamily.id/' + s.replace(/^\/+/, '');
}
if (/^account\.tradersfamily\.id\//i.test(s)) {
s = 'https://' + s;
}
if (/^https?:\/\/(www\.)?tradersfamily\.id\/channels\//i.test(s)) {
s = s.replace(/^https?:\/\/(www\.)?tradersfamily\.id\//i, 'https://account.tradersfamily.id/');
}
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const pathOk = (u.pathname || '').toLowerCase().startsWith('/channels/');
if (!hostOk || !pathOk)
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function tf_strictActiveTabChannelUrl(raw) {
try {
if (!raw)
return null;
const s = String(raw).trim();
if (!s)
return null;
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const path = (u.pathname || '');
const pathLower = path.toLowerCase();
if (!hostOk)
return null;
if (!pathLower.startsWith('/channels/'))
return null;
const segs = path.split('/').filter(Boolean);
if (!segs || segs.length < 2)
return null;
if ((segs[0] || '').toLowerCase() !== 'channels')
return null;
const idSeg = String(segs[1] || '').trim();
if (!/^\d+$/.test(idSeg))
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function setIsignalStatus(text) {
const el = document.getElementById('isignal-status');
if (el) {
const nextText = text || '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
const TF_STOP_LABEL = 'Stop Progress!';
const TF_EXPORT_SCHEMA = 'tf_multi_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
function tf_buildRememberedLinksFromImportedSources(sourceObj) {
try {
if (!sourceObj || typeof sourceObj !== 'object') return [];
const out = [];
Object.keys(sourceObj).forEach((name) => {
try {
const item = sourceObj[name] || {};
const url = tf_normalizeTfAccountUrl(item.url || item.link || '');
if (!url) return;
const pairs = Array.isArray(item.pairs) && item.pairs.length ? item.pairs.slice() : [ALL_PAIR_OPTION_VALUE];
out.push({ url, pairs, name: String(name || '').trim() });
}
catch (e) { }
});
return out;
}
catch (e) { return []; }
}
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) => tf_stableJson(item)).join(',') + ']';
if (value && typeof value === 'object') {
const keys = Object.keys(value).sort();
return '{' + keys.map((key) => JSON.stringify(key) + ':' + tf_stableJson(value[key])).join(',') + '}';
}
return JSON.stringify(value);
}
catch (e) {
try {
return JSON.stringify(value);
}
catch (err) {
return String(value);
}
}
}
function tf_getStableAnalystUrlKey(rawUrl) {
try {
return tf_normalizeTfAccountUrl(rawUrl) || '';
}
catch (e) {
return '';
}
}
function tf_rememberStableAnalystName(rawUrl, rawName, persist = true) {
try {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(rawName || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return false;
const previous = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (previous === name)
return false;
__tfStableAnalystNameByUrl[urlKey] = name;
if (persist && hasChromeStorage()) {
chrome.storage.local.get([TF_ANALYST_NAME_CACHE_KEY], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const current = data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
if (String(current[urlKey] || '').trim() === name)
return;
current[urlKey] = name;
chrome.storage.local.set({ [TF_ANALYST_NAME_CACHE_KEY]: current }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
});
}
return true;
}
catch (e) {
return false;
}
}
function tf_mergeNameCacheIntoMaps(nameMaps, cache) {
const maps = nameMaps || { byUrl: {}, byChannelId: {} };
try {
if (cache && typeof cache === 'object') {
Object.keys(cache).forEach((rawUrl) => {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(cache[rawUrl] || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return;
__tfStableAnalystNameByUrl[urlKey] = name;
maps.byUrl[urlKey] = name;
const mm = String(urlKey).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
maps.byChannelId[String(mm[1])] = name;
});
}
Object.keys(__tfStableAnalystNameByUrl || {}).forEach((urlKey) => {
const name = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return;
maps.byUrl[urlKey] = name;
const mm = String(urlKey).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
maps.byChannelId[String(mm[1])] = name;
});
}
catch (e) { }
return maps;
}
function tf_buildNameMapsFromSources(sources) {
const byUrl = {};
const byChannelId = {};
try {
if (sources && typeof sources === 'object') {
Object.keys(sources).forEach((nm) => {
try {
const it = sources[nm] || {};
const urlNorm = tf_normalizeTfAccountUrl(it.url || it.link || '');
const name = String(nm || '').trim();
if (!urlNorm || tf_isPlaceholderAnalystName(name))
return;
byUrl[urlNorm] = name;
const mm = String(urlNorm).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
byChannelId[String(mm[1])] = name;
}
catch (e) { }
});
}
}
catch (e) { }
return { byUrl, byChannelId };
}
function tf_resolveAnalystNameForUrl(rawUrl, nameMaps) {
try {
const urlNorm = tf_normalizeTfAccountUrl(rawUrl);
if (!urlNorm)
return '';
const maps = nameMaps || { byUrl: {}, byChannelId: {} };
if (maps.byUrl && maps.byUrl[urlNorm])
return String(maps.byUrl[urlNorm]).trim();
const mm = String(urlNorm).match(/\/channels\/(\d+)/i);
const cid = (mm && mm[1]) ? String(mm[1]) : '';
if (cid && maps.byChannelId && maps.byChannelId[cid])
return String(maps.byChannelId[cid]).trim();
return '';
}
catch (e) {
return '';
}
}
function tf_enrichRememberedLinksWithNames(rememberedLinks, sources) {
try {
if (!Array.isArray(rememberedLinks))
return rememberedLinks;
const maps = tf_buildNameMapsFromSources(sources);
return rememberedLinks.map((it, idx) => {
const obj = (it && typeof it === 'object') ? { ...it } : { url: String(it || '') };
const url = obj.url ? String(obj.url).trim() : '';
let nm = obj.name || obj.analystName || obj.analis || obj.label || '';
nm = String(nm || '').trim();
if (tf_isPlaceholderAnalystName(nm))
nm = '';
if (!nm)
nm = tf_resolveAnalystNameForUrl(url, maps);
if (nm) {
obj.name = nm;
obj.analystName = nm;
}
else {
try {
delete obj.name;
}
catch (e) { }
}
if (!Array.isArray(obj.pairs) || !obj.pairs.length)
obj.pairs = ['__ALL__'];
if (!nm && url) {
const uNorm = tf_normalizeTfAccountUrl(url);
const mm = uNorm ? String(uNorm).match(/\/channels\/(\d+)/i) : null;
if (mm && mm[1])
obj._fallbackLabel = `Channel ${mm[1]}`;
else
obj._fallbackLabel = `Link ${idx + 1}`;
}
return obj;
});
}
catch (e) {
return rememberedLinks;
}
}
function tf_truncAnalystName10(name) {
try {
const s = String(name || '').trim();
if (!s)
return '';
if (s.length <= 10)
return s;
return s.slice(0, 10);
}
catch (e) {
return '';
}
}
function tf_applyAnalystNameToPasteButton(pasteBtn, name) {
if (!pasteBtn)
return;
const nm = String(name || '').trim();
if (!nm)
return;
try {
pasteBtn.classList.add('tf-analyst-name-pill');
try {
if (pasteBtn.dataset)
pasteBtn.dataset.tfFullName = nm;
}
catch (e) { }
pasteBtn.textContent = tf_truncAnalystName10(nm);
pasteBtn.title = nm;
pasteBtn.disabled = false;
}
catch (e) { }
}
function tf_applyAnalystNameToSidebarByUrl(rawUrl, name) {
try {
const nm = String(name || '').trim();
if (!nm)
return false;
if (tf_isPlaceholderAnalystName(nm))
return false;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl)
return false;
try {
tf_rememberStableAnalystName(normUrl, nm, true);
}
catch (e) { }
const key = tf_normUrlKey(normUrl);
if (!key)
return false;
let did = false;
const updateContainer = (containerId) => {
const c = document.getElementById(containerId);
if (!c)
return;
const rows = Array.from(c.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const u = input && input.value ? String(input.value).trim() : '';
const k = tf_normUrlKey(u);
if (!k || k !== key)
return;
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn) {
tf_applyAnalystNameToPasteButton(pasteBtn, nm);
did = true;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
try {
if (nameBtn.dataset)
nameBtn.dataset.tfFullName = nm;
}
catch (e) { }
nameBtn.textContent = tf_truncAnalystName10(nm);
nameBtn.title = nm;
nameBtn.disabled = false;
did = true;
}
}
catch (e) { }
});
};
updateContainer('analyst-links-container');
updateContainer('isignal-links-container');
return did;
}
catch (e) {
return false;
}
}
let __tfRememberedLinksSaveTimer = null;
function tf_scheduleSaveRememberedLinks() {
try {
if (__tfRememberedLinksSaveTimer)
return;
__tfRememberedLinksSaveTimer = setTimeout(() => {
__tfRememberedLinksSaveTimer = null;
try {
saveRememberedAnalystLinks();
}
catch (e) { }
}, 300);
}
catch (e) { }
}
function tf_reloadAnalystNamesInSidebarUI(cb) {
try {
if (!hasChromeStorage()) {
if (typeof cb === 'function')
cb();
return;
}
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = Array.isArray(d && d[TF_REMEMBERED_LINKS_KEY]) ? d[TF_REMEMBERED_LINKS_KEY] : [];
const nameCache = d && d[TF_ANALYST_NAME_CACHE_KEY] && typeof d[TF_ANALYST_NAME_CACHE_KEY] === 'object' ? d[TF_ANALYST_NAME_CACHE_KEY] : {};
const maps = tf_mergeNameCacheIntoMaps(tf_buildNameMapsFromSources(sources), nameCache);
const updateContainer = (containerId) => {
const c = document.getElementById(containerId);
if (!c)
return;
const rows = Array.from(c.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const pasteBtn = row.querySelector('.analyst-paste-btn');
const nameBtn = row.querySelector('.analyst-name-btn');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return;
const nm = tf_resolveAnalystNameForUrl(rawUrl, maps);
if (nm) {
if (pasteBtn)
tf_applyAnalystNameToPasteButton(pasteBtn, nm);
if (nameBtn) {
try {
if (nameBtn.dataset)
nameBtn.dataset.tfFullName = nm;
}
catch (e) { }
nameBtn.textContent = tf_truncAnalystName10(nm);
nameBtn.title = nm;
nameBtn.disabled = false;
}
}
}
catch (e) { }
});
};
updateContainer('analyst-links-container');
updateContainer('isignal-links-container');
const enriched = tf_enrichRememberedLinksWithNames(remembered, sources);
try {
if (tf_stableJson(enriched) === tf_stableJson(remembered)) {
if (typeof cb === 'function')
cb();
}
else {
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: enriched }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (typeof cb === 'function')
cb();
});
}
}
catch (e) {
if (typeof cb === 'function')
cb();
}
});
}
catch (e) {
if (typeof cb === 'function')
cb();
}
}
function tf_normPairsForSig(pairs) {
try {
const arr = Array.isArray(pairs) ? pairs.slice() : [];
const cleaned = arr
.map((p) => String(p || '').toUpperCase().trim())
.filter((p) => p);
if (!cleaned.length)
return ['__ALL__'];
if (cleaned.includes('__ALL__'))
return ['__ALL__'];
cleaned.sort();
return cleaned;
}
catch (e) {
return ['__ALL__'];
}
}
function tf_makeChannelSig(url, pairs) {
const u = tf_normalizeTfAccountUrl(url);
if (!u)
return null;
const ps = tf_normPairsForSig(pairs);
return u + '|' + ps.join(',');
}
function tf_computeRowSig(row) {
try {
if (!row)
return null;
const input = row.querySelector('.analyst-link-input');
const select = row.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return null;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl)
return null;
const pairs = getSelectedPairsFromSelect(select);
return tf_makeChannelSig(normUrl, pairs);
}
catch (e) {
return null;
}
}
function tf_setAnalystRowLocked(row, locked) {
try {
if (!row)
return;
if (row.dataset)
row.dataset.tfLocked = locked ? '1' : '0';
row.classList.toggle('tf-row-locked', !!locked);
const input = row.querySelector('.analyst-link-input');
if (input) {
input.disabled = false;
input.readOnly = !!locked;
if (locked)
input.setAttribute('readonly', 'readonly');
else
input.removeAttribute('readonly');
}
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn)
pasteBtn.disabled = false;
const removeBtn = row.querySelector('.analyst-remove-btn');
if (removeBtn)
removeBtn.disabled = false;
const select = row.querySelector('.analyst-pair-select');
if (select)
select.disabled = false;
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
const cbs = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbs.forEach((cb) => {
cb.disabled = !!locked;
});
}
catch (e) { }
}
function tf_setTimeRangeLocked(locked) {
try {
const ids = ['main', 'masuk', 'isignal'];
ids.forEach((k) => {
const toggle = document.getElementById('tf-tr-toggle-' + k);
const panel = document.getElementById('tf-tr-panel-' + k);
if (toggle) {
try {
toggle.disabled = false;
}
catch (e) { }
toggle.title = locked ? 'Add-mode aktif (Import lock). Time Range tetap bisa dipilih.' : '';
try {
toggle.classList.toggle('tf-tr-soft-locked', !!locked);
}
catch (e) { }
}
if (panel) {
const opts = panel.querySelectorAll('.tf-tr-option');
opts.forEach((b) => {
try {
b.disabled = false;
}
catch (e) { }
});
}
});
}
catch (e) { }
}
function tf_setAddModeSecondaryActionsVisible(visible) {
try {
const on = !!visible;
if (!on)
tf_addModeScanLinksManuallyHidden = false;
const showClose = on && !tf_addModeScanLinksManuallyHidden;
['main', 'masuk', 'isignal'].forEach((k) => {
const row2 = document.getElementById('tf-addmode-actions2-' + k);
if (row2)
row2.hidden = false;
const wrap = document.getElementById('tf-addmode-scanwrap-' + k);
if (wrap)
wrap.hidden = false;
const closeBtn = document.getElementById('tf-btn-addmode-close-' + k);
if (closeBtn)
closeBtn.hidden = !showClose;
});
}
catch (e) { }
}
function tf_applyImportLockToContainer(containerEl, baselineCount) {
try {
if (!containerEl)
return;
const rows = Array.from(containerEl.querySelectorAll('.analyst-row'));
const n = Math.max(0, parseInt(baselineCount || 0, 10) || 0);
rows.forEach((row, idx) => {
const shouldLock = idx < n;
tf_setAnalystRowLocked(row, shouldLock);
});
}
catch (e) { }
}
function tf_applyImportLockFromStorageToUI() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([
TF_HAS_IMPORTED_BUNDLE_KEY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
const lockedSigs = (d && Array.isArray(d[TF_IMPORT_LOCKED_SIGS_KEY])) ? d[TF_IMPORT_LOCKED_SIGS_KEY] : [];
void lockedSigs;
const baseMainCount = (d && typeof d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] !== 'undefined')
? (parseInt(d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY], 10) || 0)
: 0;
const baseIsignalCount = (d && typeof d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] !== 'undefined')
? (parseInt(d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY], 10) || 0)
: 0;
const containerMain = document.getElementById('analyst-links-container');
const containerIsignal = document.getElementById('isignal-links-container');
if (hasImp && lockEngaged) {
tf_applyImportLockToContainer(containerMain, baseMainCount);
tf_applyImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
let src=String(text==null?'':text).replace(/^\uFEFF/,'').replace(/^\s*\uFEFF/,'').trim();
if(!src)return null;
let parsed;
try{parsed=JSON.parse(src);}catch(e){
const retry=src.replace(/^\u0000+/,'').replace(/\u0000+$/,'').trim();
if(retry===src)return null;
try{parsed=JSON.parse(retry);}catch(_){return null;}
}
if(typeof parsed==='string'){
const nested=parsed.replace(/^\uFEFF/,'').trim();
if((nested.startsWith('{')&&nested.endsWith('}'))||(nested.startsWith('[')&&nested.endsWith(']'))){
try{parsed=JSON.parse(nested);}catch(_){}
}
}
return parsed&&typeof parsed==='object'?parsed:null;
} catch(e){return null;}
}
function tf_isRecognizedImportStorageV399(storage,payload) {
if(!storage||typeof storage!=='object'||Array.isArray(storage))return false;
if(payload&&payload.schema===TF_EXPORT_SCHEMA)return true;
return !!(
Array.isArray(storage.tfHistorySignals)||
(storage[TF_ANALYST_SOURCES_KEY]&&typeof storage[TF_ANALYST_SOURCES_KEY]==='object'&&!Array.isArray(storage[TF_ANALYST_SOURCES_KEY]))||
(storage.tfMonthlyStats&&typeof storage.tfMonthlyStats==='object'&&!Array.isArray(storage.tfMonthlyStats))||
Array.isArray(storage.tfScoreHistory)||
Array.isArray(storage[TF_REMEMBERED_LINKS_KEY])
);
}
function tf_hasImportContentV399(storage) {
if(!storage||typeof storage!=='object')return false;
return !!(
(Array.isArray(storage.tfHistorySignals)&&storage.tfHistorySignals.length)||
(storage[TF_ANALYST_SOURCES_KEY]&&typeof storage[TF_ANALYST_SOURCES_KEY]==='object'&&Object.keys(storage[TF_ANALYST_SOURCES_KEY]).length)||
(storage.tfMonthlyStats&&typeof storage.tfMonthlyStats==='object'&&Object.keys(storage.tfMonthlyStats).length)||
(Array.isArray(storage.tfScoreHistory)&&storage.tfScoreHistory.length)||
(Array.isArray(storage[TF_REMEMBERED_LINKS_KEY])&&storage[TF_REMEMBERED_LINKS_KEY].length)
);
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
return;
const lists = tf_getSavedListEls();
if (!lists.length)
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_SELECTED_TIME_RANGE_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] && typeof d[TF_ANALYST_SOURCES_KEY] === 'object'
? d[TF_ANALYST_SOURCES_KEY]
: {};
const remembered = Array.isArray(d && d[TF_REMEMBERED_LINKS_KEY])
? d[TF_REMEMBERED_LINKS_KEY]
: [];
const storedNameCache = d && d[TF_ANALYST_NAME_CACHE_KEY] && typeof d[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...d[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const tr = d && d[TF_SELECTED_TIME_RANGE_KEY] ? d[TF_SELECTED_TIME_RANGE_KEY] : 'all_time';
const trLabel = tf_timeRangeLabel(tr);
const byUrl = new Map();
const order = [];
const cacheNext = { ...storedNameCache };
const addChannel = (rawUrl, rawName, rawPairs) => {
try {
const url = tf_normalizeTfAccountUrl(rawUrl);
if (!url)
return;
if (!byUrl.has(url)) {
byUrl.set(url, { url, name: '', pairs: [] });
order.push(url);
}
const entry = byUrl.get(url);
const name = String(rawName || '').trim();
if (!tf_isPlaceholderAnalystName(name)) {
entry.name = name;
__tfStableAnalystNameByUrl[url] = name;
cacheNext[url] = name;
}
const pairs = Array.isArray(rawPairs) ? rawPairs : [];
pairs.forEach((pair) => {
const p = String(pair || '').trim().toUpperCase();
if (!p || p === '__ALL__')
return;
if (!entry.pairs.includes(p))
entry.pairs.push(p);
});
}
catch (e) { }
};
remembered.forEach((item) => {
const it = item && typeof item === 'object' ? item : { url: String(item || '') };
addChannel(it.url || it.link || '', it.name || it.analystName || it.analis || it.label || '', it.pairs);
});
Object.keys(sources).forEach((sourceName) => {
const it = sources[sourceName] || {};
addChannel(it.url || it.link || '', sourceName, it.pairs);
});
Object.keys(storedNameCache).forEach((rawUrl) => {
const name = String(storedNameCache[rawUrl] || '').trim();
const url = tf_normalizeTfAccountUrl(rawUrl);
if (url && !tf_isPlaceholderAnalystName(name)) {
__tfStableAnalystNameByUrl[url] = name;
cacheNext[url] = name;
}
});
const channels = order.map((url, index) => {
const entry = byUrl.get(url);
let name = entry && entry.name ? String(entry.name).trim() : '';
if (tf_isPlaceholderAnalystName(name))
name = '';
if (!name) {
const cached = String(cacheNext[url] || __tfStableAnalystNameByUrl[url] || '').trim();
if (!tf_isPlaceholderAnalystName(cached))
name = cached;
}
if (!name) {
const mm = String(url).match(/\/channels\/(\d+)/i);
name = mm && mm[1] ? `Channel ${mm[1]}` : `Link ${index + 1}`;
}
const pairs = entry && Array.isArray(entry.pairs) ? entry.pairs.slice().sort() : [];
return { name, url, pairs };
});
if (tf_stableJson(cacheNext) !== tf_stableJson(storedNameCache)) {
chrome.storage.local.set({ [TF_ANALYST_NAME_CACHE_KEY]: cacheNext }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
const openUrl = (url) => {
try {
const u = String(url || '').trim();
if (!u)
return;
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime)
chrome.tabs.create({ url: u });
else
window.open(u, '_blank');
}
catch (e) {
try {
window.open(String(url || ''), '_blank');
}
catch (e2) { }
}
};
const renderSignature = tf_stableJson({ tr: trLabel, channels });
lists.forEach((el) => {
if (el.dataset && el.dataset.tfRenderSignature === renderSignature && el.childElementCount > 0)
return;
const previousScrollTop = el.scrollTop || 0;
const fragment = document.createDocumentFragment();
if (!channels.length) {
const empty = document.createElement('div');
empty.className = 'scan-channel-saved-item';
empty.textContent = 'Belum ada data tersimpan. Silakan Scan dulu atau Import file.';
fragment.appendChild(empty);
}
else {
channels.forEach((c) => {
const item = document.createElement('div');
item.className = 'scan-channel-saved-item';
item.dataset.tfUrl = c.url;
const grid = document.createElement('div');
grid.className = 'scan-channel-saved-grid';
const colLink = document.createElement('div');
colLink.className = 'scan-channel-saved-col link';
const a = document.createElement('a');
a.href = '#';
a.textContent = tf_shortUrl(c.url);
a.title = String(c.url || '');
a.addEventListener('click', (ev) => {
ev.preventDefault();
openUrl(c.url);
});
colLink.appendChild(a);
const colName = document.createElement('div');
colName.className = 'scan-channel-saved-col name';
colName.textContent = c.name || '-';
colName.title = c.name || '';
const colPairs = document.createElement('div');
colPairs.className = 'scan-channel-saved-col pairs';
colPairs.textContent = Array.isArray(c.pairs) && c.pairs.length ? c.pairs.join(',') : 'ALL';
grid.appendChild(colLink);
grid.appendChild(colName);
grid.appendChild(colPairs);
const sub = document.createElement('div');
sub.className = 'scan-channel-saved-sub';
const t1 = document.createElement('span');
t1.textContent = `Time: ${trLabel}`;
const t2 = document.createElement('span');
t2.textContent = 'Click link to open';
sub.appendChild(t1);
sub.appendChild(t2);
item.appendChild(grid);
item.appendChild(sub);
fragment.appendChild(item);
});
}
el.replaceChildren(fragment);
if (el.dataset)
el.dataset.tfRenderSignature = renderSignature;
try {
el.scrollTop = Math.min(previousScrollTop, Math.max(0, el.scrollHeight - el.clientHeight));
}
catch (e) { }
});
});
}
catch (e) { }
}
function tf_scheduleSavedChannelsRefresh(options) {
try {
if (__tfSavedChannelsRefreshTimer)
clearTimeout(__tfSavedChannelsRefreshTimer);
const opts = options || {};
__tfSavedChannelsRefreshTimer = setTimeout(() => {
__tfSavedChannelsRefreshTimer = null;
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
if (opts.reloadNames) {
try {
tf_reloadAnalystNamesInSidebarUI();
}
catch (e) { }
}
}, 120);
}
catch (e) { }
}
function tf_refreshTimeRangeUIFromStorage() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const v = d && d[TF_SELECTED_TIME_RANGE_KEY] ? d[TF_SELECTED_TIME_RANGE_KEY] : 'all_time';
const label = tf_timeRangeLabel(v);
const parenMain = document.getElementById('tf-time-range-paren-main');
const parenMasuk = document.getElementById('tf-time-range-paren-masuk');
const parenIsignal = document.getElementById('tf-time-range-paren-isignal');
if (parenMain)
parenMain.textContent = `(${label})`;
if (parenMasuk)
parenMasuk.textContent = `(${label})`;
if (parenIsignal)
parenIsignal.textContent = `(${label})`;
const syncPanel = (panelId) => {
const panel = document.getElementById(panelId);
if (!panel)
return;
const btns = panel.querySelectorAll('.tf-tr-option');
btns.forEach((b) => {
const bv = b && b.dataset ? b.dataset.value : '';
if (bv === v)
b.classList.add('active');
else
b.classList.remove('active');
});
};
syncPanel('tf-tr-panel-main');
syncPanel('tf-tr-panel-masuk');
syncPanel('tf-tr-panel-isignal');
});
}
catch (e) { }
}
function tf_setScanFromIsignalBlockedByImport(hasImported) {
try {
const blocked = !!hasImported;
const blockedSuffix = ' dikunci karena data Import sudah terisi. Klik hyperlink Refresh untuk mengaktifkannya kembali.';
const scanFromIsignalBtn = document.getElementById('scan-from-isignal-btn');
if (scanFromIsignalBtn) {
if (scanFromIsignalBtn.dataset)
scanFromIsignalBtn.dataset.tfImportBlocked = blocked ? '1' : '0';
if (blocked) {
scanFromIsignalBtn.disabled = true;
scanFromIsignalBtn.title = 'Scan From iSignal' + blockedSuffix;
}
else {
const busy = !!(scanFromIsignalBtn.dataset && scanFromIsignalBtn.dataset.busy === '1');
if (!busy)
scanFromIsignalBtn.disabled = false;
if (scanFromIsignalBtn.title && /data Import sudah terisi/i.test(scanFromIsignalBtn.title))
scanFromIsignalBtn.title = '';
}
}
[
document.getElementById('add-analyst-btn'),
document.getElementById('add-analyst-isignal-btn')
].forEach((btn) => {
if (!btn)
return;
if (btn.dataset)
btn.dataset.tfImportBlocked = blocked ? '1' : '0';
btn.disabled = blocked;
if (blocked) {
btn.title = 'Tambahkan Analis' + blockedSuffix;
}
else if (btn.title && /data Import sudah terisi/i.test(btn.title)) {
btn.title = '';
}
});
const scanBtn = document.getElementById('scan-btn');
if (scanBtn) {
if (scanBtn.dataset)
scanBtn.dataset.tfImportBlocked = blocked ? '1' : '0';
scanBtn.disabled = blocked;
if (blocked) {
scanBtn.title = 'Scan Channel ini' + blockedSuffix;
}
else if (scanBtn.title && /data Import sudah terisi/i.test(scanBtn.title)) {
scanBtn.title = '';
}
}
const scanPairSelect = document.getElementById('scan-pair-select');
if (scanPairSelect)
scanPairSelect.disabled = blocked;
const scanPairWidget = document.getElementById('scan-pair-multiselect');
if (scanPairWidget) {
if (scanPairWidget.dataset) {
scanPairWidget.dataset.tfImportBlocked = blocked ? '1' : '0';
if (!scanPairWidget.dataset.tfOriginalTitle) {
scanPairWidget.dataset.tfOriginalTitle = scanPairWidget.getAttribute('title') || 'Pilih Pair untuk Scan Channel ini';
}
}
scanPairWidget.classList.remove('open');
scanPairWidget.style.pointerEvents = blocked ? 'none' : '';
scanPairWidget.style.opacity = blocked ? '0.55' : '';
scanPairWidget.setAttribute('aria-disabled', blocked ? 'true' : 'false');
scanPairWidget.title = blocked
? 'Selector Pair Scan Channel ini' + blockedSuffix
: ((scanPairWidget.dataset && scanPairWidget.dataset.tfOriginalTitle) || 'Pilih Pair untuk Scan Channel ini');
const checkboxes = scanPairWidget.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((cb) => { cb.disabled = blocked; });
}
}
catch (e) { }
}
function tf_updateImportActionIconState(hasImported) {
try {
const loaded = !!hasImported;
const nextState = loaded ? 'loaded' : 'empty';
['tf-btn-import-main','tf-btn-import-masuk','tf-btn-import-isignal'].forEach((id) => {
const btn = document.getElementById(id);
if (!btn)
return;
const prevState = btn.getAttribute('data-tf-import-state') || 'empty';
btn.setAttribute('data-tf-import-state', nextState);
btn.setAttribute('aria-label', loaded
? 'Import / Combine — data import sudah tersedia'
: 'Import / Combine — belum ada data import');
if (prevState !== nextState) {
try {
btn.classList.remove('tf-import-state-changed');
void btn.offsetWidth;
btn.classList.add('tf-import-state-changed');
setTimeout(() => { try { btn.classList.remove('tf-import-state-changed'); } catch (e) { } }, 720);
}
catch (e) { }
}
});
}
catch (e) { }
}
function tf_setUpdateButtonsEnabled(hasImported, importLockEngaged) {
try {
const hasImp = !!hasImported;
const locked = !!importLockEngaged;
try { tf_updateImportActionIconState(hasImp); } catch (e) { }
try {
tf_setScanFromIsignalBlockedByImport(hasImp);
}
catch (e) { }
const btnMain = document.getElementById('tf-btn-update-main');
const btnMasuk = document.getElementById('tf-btn-update-masuk');
const btnIsignal = document.getElementById('tf-btn-update-isignal');
const btnSubmitMain = document.getElementById('tf-btn-submit-main');
const btnSubmitMasuk = document.getElementById('tf-btn-submit-masuk');
const btnSubmitIsignal = document.getElementById('tf-btn-submit-isignal');
const btnAddAnalystMain = document.getElementById('tf-btn-add-analyst-main');
const btnAddAnalystMasuk = document.getElementById('tf-btn-add-analyst-masuk');
const btnAddAnalystIsignal = document.getElementById('tf-btn-add-analyst-isignal');
const enableAddAnalyst = hasImp;
[btnAddAnalystMain, btnAddAnalystMasuk, btnAddAnalystIsignal].forEach((b) => {
if (!b)
return;
b.disabled = !enableAddAnalyst;
if (!hasImp) {
b.title = 'Tambahkan Analis hanya aktif setelah Import file.';
}
else {
b.title = locked ? 'Mode Tambahkan Analis aktif (data Import di-lock).' : '';
}
});
const btnScanLinkMain = document.getElementById('tf-btn-scanlink-main');
const btnScanPairMain = document.getElementById('tf-btn-scanpair-main');
const btnScanLinkMasuk = document.getElementById('tf-btn-scanlink-masuk');
const btnScanPairMasuk = document.getElementById('tf-btn-scanpair-masuk');
const btnScanLinkIsignal = document.getElementById('tf-btn-scanlink-isignal');
const btnScanPairIsignal = document.getElementById('tf-btn-scanpair-isignal');
const btnRefreshMain = document.getElementById('tf-btn-refresh-main');
const btnRefreshMasuk = document.getElementById('tf-btn-refresh-masuk');
const btnRefreshIsignal = document.getElementById('tf-btn-refresh-isignal');
[
btnScanLinkMain, btnScanPairMain,
btnScanLinkMasuk, btnScanPairMasuk,
btnScanLinkIsignal, btnScanPairIsignal
].forEach((b) => {
if (!b)
return;
try {
const enabled = !!hasImp;
b.disabled = !enabled;
b.setAttribute('aria-disabled', enabled ? 'false' : 'true');
b.style.pointerEvents = enabled ? 'auto' : 'none';
b.style.opacity = enabled ? '' : '';
if (b.dataset)
b.dataset.tfImportLockBypass = enabled ? '1' : '0';
if (!enabled) {
const isPair = !!(b.id && String(b.id).indexOf('scanpair') >= 0);
b.title = isPair
? 'Pair hanya aktif setelah Import file.'
: 'Scan Channel ini hanya aktif setelah Import file.';
}
else {
b.title = '';
}
}
catch (e) { }
});
const enableUpdate = hasImp && !locked;
const enableSubmit = hasImp;
[btnMain, btnMasuk, btnIsignal].forEach((b) => {
if (!b)
return;
if (b.dataset && b.dataset.tfStopPending === '1') {
b.disabled = true;
b.setAttribute('aria-disabled', 'true');
b.title = 'Sedang menghentikan Update...';
return;
}
b.disabled = !enableUpdate;
b.setAttribute('aria-disabled', enableUpdate ? 'false' : 'true');
if (!hasImp) {
b.title = 'Update hanya aktif setelah Import file.';
}
else if (locked) {
b.title = 'Update dikunci karena kamu menambah analis baru (data Import di-lock).';
}
else {
b.title = '';
}
});
[btnSubmitMain, btnSubmitMasuk, btnSubmitIsignal].forEach((b) => {
if (!b)
return;
b.disabled = !enableSubmit;
if (!hasImp) {
b.title = 'Submit hanya aktif setelah Import file.';
}
else {
b.title = '';
}
});
try {
tf_updateExportButtonsEnabledFromStorage();
}
catch (e) { }
try {
if (__tfUpdateActivityLocked) tf_setUpdateActivityLock(true);
}
catch (e) { }
}
catch (e) { }
}

let __tfRefreshLoadingFallbackTimer = null;
function tf_ensureRefreshButtonLoadingStyle() {
try {
if (document.getElementById('tf-refresh-loading-style'))
return;
const style = document.createElement('style');
style.id = 'tf-refresh-loading-style';
style.textContent = `
.tf-action-box.tf-refresh-loading,
.tf-submit-action-btn.tf-refresh-loading {
pointer-events: none;
}
.tf-refresh-inline {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 6.3px;
}
.tf-refresh-inline-spinner {
width: 9.9px;
height: 9.9px;
border-radius: 899.1px;
border: 2px solid rgba(191,219,254,0.35);
border-top-color: rgba(191,219,254,0.98);
animation: tfRefreshInlineSpin .75s linear infinite;
flex: 0 0 auto;
}
@keyframes tfRefreshInlineSpin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
}
catch (e) { }
}
function tf_setRefreshButtonsLoading(isLoading) {
try {
tf_ensureRefreshButtonLoadingStyle();
const loading = !!isLoading;
const buttons = [
document.getElementById('tf-btn-refresh-main'),
document.getElementById('tf-btn-refresh-masuk'),
document.getElementById('tf-btn-refresh-isignal')
].filter(Boolean);
if (__tfRefreshLoadingFallbackTimer) {
clearTimeout(__tfRefreshLoadingFallbackTimer);
__tfRefreshLoadingFallbackTimer = null;
}
buttons.forEach((btn) => {
try {
if (!btn)
return;
if (!btn.dataset.tfOrigHtml)
btn.dataset.tfOrigHtml = btn.innerHTML || btn.textContent || 'Refresh';
if (loading) {
btn.disabled = true;
btn.classList.add('tf-refresh-loading');
btn.innerHTML = '<span class="tf-refresh-inline"><span class="tf-refresh-inline-spinner" aria-hidden="true"></span><span>Refresh</span></span>';
btn.title = 'Refresh sedang berjalan...';
}
else {
btn.classList.remove('tf-refresh-loading');
btn.innerHTML = btn.dataset.tfOrigHtml || 'Refresh';
if (btn.title === 'Refresh sedang berjalan...')
btn.title = '';
btn.disabled = false;
}
}
catch (e) { }
});
if (loading) {
__tfRefreshLoadingFallbackTimer = setTimeout(() => {
try {
tf_setRefreshButtonsLoading(false);
}
catch (e) { }
}, 15000);
}
}
catch (e) { }
}
function tf_hasExportablePayloadData(data) {
try {
if (!data || typeof data !== 'object')
return false;
const hasObjectKeys = (obj) => !!(obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length);
const hasNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;
if (hasObjectKeys(data.tfMonthlyStats))
return true;
if (hasNonEmptyArray(data.tfHistorySignals))
return true;
if (hasObjectKeys(data.tfScoreHistory))
return true;
if (hasObjectKeys(data.tfNoDataPairs))
return true;
if (hasObjectKeys(data.tfAvgSlPips))
return true;
if (hasObjectKeys(data[TF_ANALYST_SOURCES_KEY]))
return true;
if (hasNonEmptyArray(data[TF_REMEMBERED_LINKS_KEY]))
return true;
if (hasObjectKeys(data[TF_ALL_ANALYST_PAIRS_KEY_MAIN]))
return true;
if (hasObjectKeys(data[TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL]))
return true;
if (hasObjectKeys(data[TF_ALL_ANALYST_PAIRS_KEY_LEGACY]))
return true;
if (data.tfLastScanMeta || data.tfLastImportMeta)
return true;
return false;
}
catch (e) {
return false;
}
}
function tf_applyExportButtonsEnabledState(hasData) {
try {
const enabled = !!hasData && !__tfUpdateActivityLocked;
const title = enabled ? '' : 'Export hanya aktif jika sudah ada data hasil Scan atau Import.';
[
document.getElementById('tf-btn-export-main'),
document.getElementById('tf-btn-export-masuk'),
document.getElementById('tf-btn-export-isignal')
].forEach((btn) => {
if (!btn)
return;
btn.disabled = !enabled;
btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
btn.title = title;
});
}
catch (e) { }
}
function tf_updateExportButtonsEnabledFromStorage(callback) {
try {
if (!hasChromeStorage()) {
tf_applyExportButtonsEnabledState(true);
if (typeof callback === 'function')
callback(true);
return;
}
chrome.storage.local.get([
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
'tfLastScanMeta',
'tfLastImportMeta'
], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasData = tf_hasExportablePayloadData(d || {});
tf_applyExportButtonsEnabledState(hasData);
if (typeof callback === 'function') {
try {
callback(hasData);
}
catch (e) { }
}
});
}
catch (e) {
try {
tf_applyExportButtonsEnabledState(false);
}
catch (err) { }
if (typeof callback === 'function') {
try {
callback(false);
}
catch (err) { }
}
}
}


function tf_releaseAddAnalystModeAfterSuccessfulSubmit(origin, callback) {
try {
const normalizedOrigin = origin ? String(origin) : '';
const isSubmitOrigin = normalizedOrigin === 'dashboardSubmit' || normalizedOrigin === 'isignalSubmit';
if (!isSubmitOrigin) {
if (typeof callback === 'function') callback(false);
return;
}
const finishUi = (hasImported) => {
try {
tf_addModeEngaged = false;
tf_addModeSigSet = new Set();
tf_addModeScanLinksManuallyHidden = false;
}
catch (e) { }
try {
['analyst-links-container', 'isignal-links-container'].forEach((containerId) => {
const container = document.getElementById(containerId);
if (!container) return;
Array.from(container.querySelectorAll('.analyst-row')).forEach((row) => {
try { tf_setAnalystRowLocked(row, false); } catch (e) { }
try { tf_clearPendingAddAnalystRowMarkers(row); } catch (e) { }
});
});
}
catch (e) { }
try { tf_setTimeRangeLocked(false); } catch (e) { }
try { tf_setAddModeSecondaryActionsVisible(false); } catch (e) { }
try { tf_setUpdateButtonsEnabled(!!hasImported, false); } catch (e) { }
try { tf_syncAddModeScanPairLinkLabels(); } catch (e) { }
try { saveRememberedAnalystLinks(); } catch (e) { }
};
if (!hasChromeStorage()) {
finishUi(true);
if (typeof callback === 'function') callback(true);
return;
}
chrome.storage.local.get([
TF_HAS_IMPORTED_BUNDLE_KEY,
TF_IMPORT_LOCK_ENGAGED_KEY
], (d) => {
try { void chrome.runtime.lastError; } catch (e) { }
const hasImported = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const wasLocked = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
const releaseState = {
[TF_IMPORT_LOCK_ENGAGED_KEY]: false,
[TF_IMPORT_LOCKED_SIGS_KEY]: [],
[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY]: 0,
[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY]: 0
};
chrome.storage.local.set(releaseState, () => {
try { void chrome.runtime.lastError; } catch (e) { }
finishUi(hasImported);
if (typeof callback === 'function') callback(wasLocked);
});
});
}
catch (e) {
try { tf_syncUpdateButtonsEnabledFromStorage(); } catch (err) { }
if (typeof callback === 'function') callback(false);
}
}

function tf_syncUpdateButtonsEnabledFromStorage() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_HAS_IMPORTED_BUNDLE_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
try {
tf_addModeEngaged = !!lockEngaged;
const sigs = (d && Array.isArray(d[TF_IMPORT_LOCKED_SIGS_KEY])) ? d[TF_IMPORT_LOCKED_SIGS_KEY] : [];
tf_addModeSigSet = new Set(sigs);
}
catch (e) {
tf_addModeEngaged = false;
tf_addModeSigSet = new Set();
}
});
}
catch (e) { }
}
function tf_makeUrlPairSig(url, pair) {
try {
const u = url ? String(url).trim() : '';
const p = pair ? String(pair).trim() : '';
if (!u || !p)
return '';
return u + '::' + p;
}
catch (e) {
return '';
}
}
function tf_buildBaselineSigsFromChannels(channels) {
const sigs = [];
try {
(channels || []).forEach((ch) => {
if (!ch || !ch.url)
return;
const url = String(ch.url);
let pairs = Array.isArray(ch.pairs) ? ch.pairs.slice() : [];
pairs = pairs.filter((p) => !!p);
if (!pairs.length)
pairs = ['__ALL__'];
if (pairs.includes('__ALL__')) {
const s = tf_makeUrlPairSig(url, '__ALL__');
if (s)
sigs.push(s);
return;
}
pairs.forEach((p) => {
const s = tf_makeUrlPairSig(url, String(p));
if (s)
sigs.push(s);
});
});
}
catch (e) { }
return Array.from(new Set(sigs));
}
function tf_collectChannelsFromStorage(d) {
let channels = [];
try {
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
if (sources && typeof sources === 'object') {
channels = Object.keys(sources)
.map((name) => {
const it = sources[name] || {};
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const pairs = Array.isArray(it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
return url ? { name, url, pairs } : null;
})
.filter(Boolean);
}
if (!channels.length && Array.isArray(remembered)) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
return url ? { name: `Link ${idx + 1}`, url, pairs } : null;
})
.filter(Boolean);
}
}
catch (e) { }
return channels;
}
function tf_engageAddAnalystMode(cb, baselineCounts) {
try {
if (!hasChromeStorage()) {
tf_softResetUiNow();
tf_reloadDashboardTabs();
return;
}
chrome.storage.local.get([TF_HAS_IMPORTED_BUNDLE_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const already = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (already) {
try {
tf_setUpdateButtonsEnabled(hasImp, true);
}
catch (e) { }
try {
tf_addModeEngaged = true;
}
catch (e) { }
try {
tf_applyImportLockFromStorageToUI();
}
catch (e) { }
if (typeof cb === 'function')
cb();
return;
}
const channels = tf_collectChannelsFromStorage(d);
const sigs = tf_buildBaselineSigsFromChannels(channels);
let baseMainCount = 0;
let baseIsignalCount = 0;
try {
if (baselineCounts && typeof baselineCounts === 'object') {
baseMainCount = parseInt(baselineCounts.main || 0, 10) || 0;
baseIsignalCount = parseInt(baselineCounts.isignal || 0, 10) || 0;
}
else {
const c1 = document.getElementById('analyst-links-container');
const c2 = document.getElementById('isignal-links-container');
baseMainCount = c1 ? (c1.querySelectorAll('.analyst-row').length || 0) : 0;
baseIsignalCount = c2 ? (c2.querySelectorAll('.analyst-row').length || 0) : 0;
}
}
catch (e) { }
baseMainCount = Math.max(0, baseMainCount);
baseIsignalCount = Math.max(0, baseIsignalCount);
chrome.storage.local.set({
[TF_IMPORT_LOCK_ENGAGED_KEY]: true,
[TF_IMPORT_LOCKED_SIGS_KEY]: sigs,
[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY]: baseMainCount,
[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY]: baseIsignalCount
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
tf_setUpdateButtonsEnabled(hasImp, true);
}
catch (e) { }
try {
tf_addModeEngaged = true;
tf_addModeSigSet = new Set(sigs);
}
catch (e) { }
try {
tf_applyImportLockFromStorageToUI();
}
catch (e) { }
try {
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
if (typeof cb === 'function')
cb();
});
});
}
catch (e) {
if (typeof cb === 'function')
cb();
}
}
function tf_filterChannelsByAddMode(channels) {
try {
if (!Array.isArray(channels) || !channels.length)
return [];
if (!tf_addModeEngaged || !(tf_addModeSigSet && tf_addModeSigSet.size)) {
const seen = new Set();
const out = [];
channels.forEach((ch) => {
if (!ch || !ch.url)
return;
const url = String(ch.url);
let pairs = Array.isArray(ch.pairs) ? ch.pairs.slice() : [];
pairs = pairs.filter((p) => !!p);
if (!pairs.length)
pairs = ['__ALL__'];
if (pairs.includes('__ALL__')) {
const sig = tf_makeUrlPairSig(url, '__ALL__');
if (sig && !seen.has(sig)) {
seen.add(sig);
out.push({ ...ch, pairs: ['__ALL__'] });
}
return;
}
const uniq = [];
pairs.forEach((p) => {
const sig = tf_makeUrlPairSig(url, String(p));
if (sig && !seen.has(sig)) {
seen.add(sig);
uniq.push(String(p));
}
});
if (uniq.length)
out.push({ ...ch, pairs: uniq });
});
return out;
}
const baseSet = tf_addModeSigSet;
const seen = new Set();
const seenUrlAll = new Set();
const out = [];
channels.forEach((ch) => {
if (!ch || !ch.url)
return;
const url = String(ch.url);
let pairs = Array.isArray(ch.pairs) ? ch.pairs.slice() : [];
pairs = pairs.filter((p) => !!p);
if (!pairs.length)
pairs = ['__ALL__'];
if (baseSet.has(tf_makeUrlPairSig(url, '__ALL__')))
return;
if (pairs.includes('__ALL__')) {
for (const sig of baseSet) {
if (sig && sig.startsWith(url + '::'))
return;
}
const sigAll = tf_makeUrlPairSig(url, '__ALL__');
if (!sigAll)
return;
if (seenUrlAll.has(url) || seen.has(sigAll))
return;
seenUrlAll.add(url);
seen.add(sigAll);
out.push({ ...ch, pairs: ['__ALL__'] });
return;
}
const uniqPairs = [];
pairs.forEach((pRaw) => {
const p = String(pRaw);
const sig = tf_makeUrlPairSig(url, p);
if (!sig)
return;
if (baseSet.has(sig))
return;
if (seenUrlAll.has(url))
return;
if (seen.has(sig))
return;
seen.add(sig);
uniqPairs.push(p);
});
if (!uniqPairs.length)
return;
out.push({ ...ch, pairs: uniqPairs });
});
return out;
}
catch (e) {
return Array.isArray(channels) ? channels : [];
}
}
function tf_collectRememberedLinksUiSnapshotForExport() {
try {
const containers = [
document.getElementById('analyst-links-container'),
document.getElementById('isignal-links-container')
].filter(Boolean);
const byUrl = new Map();
containers.forEach((container) => {
const rows = Array.from(container.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const url = input ? String(input.value || '').trim() : '';
if (!url)
return;
let nm = '';
try {
const nameBtn = row.querySelector('.analyst-paste-btn, .analyst-name-btn, .tf-analyst-name-pill');
if (nameBtn) {
if (nameBtn.dataset && nameBtn.dataset.tfFullName)
nm = String(nameBtn.dataset.tfFullName || '').trim();
if (!nm && nameBtn.title)
nm = String(nameBtn.title || '').trim();
if (!nm)
nm = String(nameBtn.textContent || '').trim();
}
if (nm === 'Paste' || nm === 'Channel' || nm === 'Nama' || nm === '-' || tf_isPlaceholderAnalystName(nm))
nm = '';
}
catch (e) {
nm = '';
}
const sel = row.querySelector('.analyst-pair-select');
let pairs = [];
if (sel) {
pairs = Array.from(sel.options || [])
.filter((o) => o && o.selected)
.map((o) => String(o.value || '').trim())
.filter(Boolean);
if (!pairs.length || pairs.includes(ALL_PAIR_OPTION_VALUE))
pairs = [];
else
pairs = pairs.filter((pair) => pair !== ALL_PAIR_OPTION_VALUE);
}
const key = tf_normUrlKey(url) || url;
const previous = byUrl.get(key) || null;
const candidate = { url, pairs };
if (nm) {
candidate.name = nm;
candidate.analystName = nm;
}
if (!previous) {
byUrl.set(key, candidate);
return;
}
const previousSpecific = Array.isArray(previous.pairs) && previous.pairs.length > 0;
const candidateSpecific = Array.isArray(candidate.pairs) && candidate.pairs.length > 0;
if (candidateSpecific || !previousSpecific) {
const merged = { ...previous, ...candidate, pairs: candidate.pairs.slice() };
if (!candidate.name && previous.name) {
merged.name = previous.name;
merged.analystName = previous.analystName || previous.name;
}
byUrl.set(key, merged);
}
else if (!previous.name && candidate.name) {
byUrl.set(key, { ...previous, name: candidate.name, analystName: candidate.analystName || candidate.name });
}
}
catch (e) { }
});
});
return Array.from(byUrl.values()).map((item) => ({
...item,
pairs: Array.isArray(item && item.pairs) ? item.pairs.slice() : []
}));
}
catch (e) {
return [];
}
}
function tf_exportScanDataNow() {
try {
if (!hasChromeStorage()) {
alert('Chrome Storage tidak tersedia.');
return;
}
const exportUiSnapshot = tf_collectRememberedLinksUiSnapshotForExport();
try {
saveRememberedAnalystLinks();
}
catch (e) { }
setStatus('Exporting...');
chrome.storage.local.get([...TF_EXPORT_STORAGE_KEYS, 'tfUserProfile', 'tfLastScanMeta', 'tfLastImportMeta'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
const uiSnapshot = Array.isArray(exportUiSnapshot)
? exportUiSnapshot.map((it) => ({
...it,
pairs: Array.isArray(it && it.pairs) ? it.pairs.slice() : []
}))
: null;
if (uiSnapshot) {
data[TF_REMEMBERED_LINKS_KEY] = uiSnapshot;
const sourceMap = data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object'
? data[TF_ANALYST_SOURCES_KEY]
: null;
if (sourceMap) {
const pairsByUrl = new Map();
uiSnapshot.forEach((it) => {
try {
const key = tf_normUrlKey(it && it.url ? it.url : '');
if (!key)
return;
const pairs = Array.isArray(it && it.pairs) && it.pairs.length
? it.pairs.slice()
: [ALL_PAIR_OPTION_VALUE];
pairsByUrl.set(key, pairs);
}
catch (e) { }
});
Object.keys(sourceMap).forEach((name) => {
try {
const item = sourceMap[name] || {};
const key = tf_normUrlKey(item.url || item.link || '');
if (key && pairsByUrl.has(key)) {
sourceMap[name] = { ...item, pairs: pairsByUrl.get(key).slice() };
}
}
catch (e) { }
});
}
}
}
catch (e) { }
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const importedBy = data && data.tfLastImportMeta && data.tfLastImportMeta.exportedBy
? data.tfLastImportMeta.exportedBy
: null;
const importedByList = data && data.tfLastImportMeta && Array.isArray(data.tfLastImportMeta.exportedByList)
? data.tfLastImportMeta.exportedByList
: [];
const scannedBy = data && data.tfLastScanMeta && data.tfLastScanMeta.scannedBy
? data.tfLastScanMeta.scannedBy
: null;
const scannedByList = data && data.tfLastScanMeta && Array.isArray(data.tfLastScanMeta.scannedByList)
? data.tfLastScanMeta.scannedByList
: [];
const tfOwnerKey = (owner) => {
try {
const n = owner && owner.name ? String(owner.name).trim().toLowerCase() : '';
const e = owner && owner.email ? String(owner.email).trim().toLowerCase() : '';
return e || n;
}
catch (e) { return ''; }
};
const fixedScanOwners = [];
const tfPushOwner = (owner) => {
if (!owner || typeof owner !== 'object')
return;
const item = {
name: owner.name ? String(owner.name).trim() : '',
email: owner.email ? String(owner.email).trim() : '',
avatarUrl: owner.avatarUrl ? String(owner.avatarUrl) : ''
};
if (!item.name && !item.email)
return;
const key = tfOwnerKey(item);
if (fixedScanOwners.some((x) => tfOwnerKey(x) === key))
return;
fixedScanOwners.push(item);
};
importedByList.forEach(tfPushOwner);
tfPushOwner(importedBy);
scannedByList.forEach(tfPushOwner);
tfPushOwner(scannedBy);
if (!fixedScanOwners.length)
tfPushOwner(profile);
const fixedScanOwner = fixedScanOwners.length ? fixedScanOwners[0] : null;
try {
if (data && Object.prototype.hasOwnProperty.call(data, 'tfUserProfile'))
delete data.tfUserProfile;
if (data && Object.prototype.hasOwnProperty.call(data, 'tfLastScanMeta'))
delete data.tfLastScanMeta;
if (data && Object.prototype.hasOwnProperty.call(data, 'tfLastImportMeta'))
delete data.tfLastImportMeta;
}
catch (e) { }
try {
const sources = data && data[TF_ANALYST_SOURCES_KEY] ? data[TF_ANALYST_SOURCES_KEY] : null;
if (data && Array.isArray(data[TF_REMEMBERED_LINKS_KEY])) {
const enriched = tf_enrichRememberedLinksWithNames(data[TF_REMEMBERED_LINKS_KEY], sources);
data[TF_REMEMBERED_LINKS_KEY] = enriched;
try {
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: enriched }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
}
catch (e) { }
try {
const remembered0 = data && Array.isArray(data[TF_REMEMBERED_LINKS_KEY]) ? data[TF_REMEMBERED_LINKS_KEY] : null;
const sources0 = data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object' ? data[TF_ANALYST_SOURCES_KEY] : null;
if (remembered0 && remembered0.length && sources0) {
const allowed = new Set();
remembered0.forEach((it) => {
try {
const u = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const k = u ? tf_normUrlKey(u) : '';
if (k)
allowed.add(k);
}
catch (e) { }
});
const filtered = {};
Object.keys(sources0).forEach((nm) => {
try {
const it = sources0[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const k = u ? tf_normUrlKey(u) : '';
if (k && allowed.has(k))
filtered[nm] = it;
}
catch (e) { }
});
data[TF_ANALYST_SOURCES_KEY] = filtered;
}
}
catch (e) { }
const payload = {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: fixedScanOwner ? {
name: fixedScanOwner.name || '',
email: fixedScanOwner.email || '',
avatarUrl: fixedScanOwner.avatarUrl || ''
} : null,
exportedByList: fixedScanOwners.map((owner) => ({
name: owner.name || '',
email: owner.email || '',
avatarUrl: owner.avatarUrl || ''
})),
localState: tf_collectLocalStateForExport(),
storage: (() => {
try {
const s = Object.assign({}, (data || {}));
try {
if (Object.prototype.hasOwnProperty.call(s, 'tfUserProfile'))
delete s.tfUserProfile;
}
catch (e) { }
return s;
}
catch (e) {
return (data || {});
}
})()
};
const name = `tf_scan_export_${tf_makePrettyFilenameTimestamp()}.json`;
tf_downloadJsonFile(name, payload);
setStatus('Export selesai ✅');
});
}
catch (e) {
setStatus('Export gagal');
}
}

function tf_cloneJsonSafe(value, fallback) {
try {
return JSON.parse(JSON.stringify(value));
}
catch (e) {
return fallback;
}
}
function tf_ownerListFromPayload(payload) {
const out = [];
const keyOf = (o) => {
try {
const e = o && o.email ? String(o.email).trim().toLowerCase() : '';
const n = o && o.name ? String(o.name).trim().toLowerCase() : '';
return e || n;
}
catch (e) { return ''; }
};
const push = (o) => {
if (!o || typeof o !== 'object')
return;
const item = {
name: o.name ? String(o.name).trim() : '',
email: o.email ? String(o.email).trim() : '',
avatarUrl: o.avatarUrl ? String(o.avatarUrl) : ''
};
if (!item.name && !item.email)
return;
const k = keyOf(item);
if (out.some((x) => keyOf(x) === k))
return;
out.push(item);
};
try {
(Array.isArray(payload && payload.exportedByList) ? payload.exportedByList : []).forEach(push);
push(payload && payload.exportedBy ? payload.exportedBy : null);
const storage = payload && payload.storage && typeof payload.storage === 'object' ? payload.storage : null;
const metas = [
storage && storage.tfLastImportMeta ? storage.tfLastImportMeta : null,
storage && storage.tfLastScanMeta ? storage.tfLastScanMeta : null,
payload && payload.tfLastImportMeta ? payload.tfLastImportMeta : null,
payload && payload.tfLastScanMeta ? payload.tfLastScanMeta : null
];
metas.forEach((meta) => {
(Array.isArray(meta && meta.exportedByList) ? meta.exportedByList : []).forEach(push);
push(meta && meta.exportedBy ? meta.exportedBy : null);
(Array.isArray(meta && meta.scannedByList) ? meta.scannedByList : []).forEach(push);
push(meta && meta.scannedBy ? meta.scannedBy : null);
});
}
catch (e) { }
return out;
}
function tf_historyCombineKey(it) {
try {
const norm = (v) => String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
const normNumberLike = (v) => {
const raw = norm(v);
if (!raw)
return '';
const n = Number(raw.replace(/,/g, ''));
return Number.isFinite(n) ? String(Math.round(n * 100000) / 100000) : raw.toLowerCase();
};
const analyst = norm(it && it.analyst).toLowerCase();
const pair = norm(it && it.pair).toUpperCase();
const created = norm((it && (it.createdSortKey != null ? it.createdSortKey : it.createdDate)) || '').toLowerCase();
const closed = norm((it && (it.sortKey != null ? it.sortKey : it.displayDate)) || '').toLowerCase();
const signalId = norm(it && it.signalId).toLowerCase();
// Created At + Closed At are always the core identity. signalId (when present)
// prevents two legitimate signals with the exact same timestamps from being merged.
if (signalId)
return [analyst, pair, created, closed, 'signal:' + signalId].join('|');
const entry = normNumberLike(it && it.entry);
const type = norm(it && it.type).toLowerCase();
return [analyst, pair, created, closed, 'entry:' + entry, 'type:' + type].join('|');
}
catch (e) { return ''; }
}
function tf_recordCompletenessScore(it) {
try {
const keys = ['entry', 'takeProfit', 'stopLoss', 'type', 'createdDate', 'openedDate', 'displayDate', 'signalId', 'expiredDate'];
let n = 0;
keys.forEach((k) => {
const v = it && it[k];
if (v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim() !== '-')
n += 1;
});
return n;
}
catch (e) { return 0; }
}
function tf_mergeHistoryArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = tf_historyCombineKey(it) || JSON.stringify(it);
const prev = map.get(key);
if (!prev) {
map.set(key, tf_cloneJsonSafe(it, { ...it }));
return;
}
const prevScore = tf_recordCompletenessScore(prev);
const nextScore = tf_recordCompletenessScore(it);
const base = nextScore > prevScore ? { ...prev, ...it } : { ...it, ...prev };
Object.keys(prev || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = prev[k];
});
Object.keys(it || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = it[k];
});
map.set(key, base);
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeScoreArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = [String(it.analyst || it.analystName || '').trim().toLowerCase(), String(it.pair || '').trim().toUpperCase(), String(it.displayDate || it.date || it.sortKey || '').trim(), String(it.score || it.value || '').trim()].join('|');
if (!map.has(key))
map.set(key, tf_cloneJsonSafe(it, { ...it }));
else
map.set(key, { ...map.get(key), ...it });
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeMonthlyStats(a, b) {
const out = tf_cloneJsonSafe(a && typeof a === 'object' ? a : {}, {});
const src = b && typeof b === 'object' ? b : {};
Object.keys(src).forEach((analystKey) => {
const prev = out[analystKey] && typeof out[analystKey] === 'object' ? out[analystKey] : {};
const next = src[analystKey] && typeof src[analystKey] === 'object' ? src[analystKey] : {};
out[analystKey] = { ...prev, ...tf_cloneJsonSafe(next, {}) };
});
return out;
}
function tf_mergeRememberedLinks(a, b) {
const byUrl = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const key = tf_normUrlKey(url);
if (!key)
return;
const rawPairs = Array.isArray(it.pairs) ? it.pairs.map((p) => String(p || '').trim().toUpperCase()).filter(Boolean) : [];
const explicit = rawPairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL');
const prev = byUrl.get(key) || { url, pairs: [] };
const prevExplicit = Array.isArray(prev.pairs) ? prev.pairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL') : [];
const mergedExplicit = Array.from(new Set([...prevExplicit, ...explicit]));
const name = String(it.name || it.analystName || '').trim();
byUrl.set(key, {
...prev,
...it,
url,
pairs: mergedExplicit.length ? mergedExplicit : [ALL_PAIR_OPTION_VALUE],
name: name || prev.name || prev.analystName || '',
analystName: name || prev.analystName || prev.name || ''
});
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(byUrl.values());
}
function tf_mergeAnalystSources(a, b) {
const rows = [];
const addMap = (m) => {
const obj = m && typeof m === 'object' ? m : {};
Object.keys(obj).forEach((name) => rows.push({ name, ...(obj[name] || {}) }));
};
addMap(a);
addMap(b);
const byUrl = new Map();
rows.forEach((it) => {
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const key = tf_normUrlKey(url);
if (!key)
return;
const prev = byUrl.get(key) || { name: '', url, pairs: [] };
const incomingName = String(it.name || '').trim();
const prevName = String(prev.name || '').trim();
const chosenName = (!tf_isPlaceholderAnalystName(incomingName) && incomingName)
? incomingName
: (prevName || incomingName);
const inPairs = Array.isArray(it.pairs) ? it.pairs.map((p) => String(p || '').trim().toUpperCase()).filter(Boolean) : [];
const prevPairs = Array.isArray(prev.pairs) ? prev.pairs : [];
const specific = Array.from(new Set([...prevPairs, ...inPairs].filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL')));
byUrl.set(key, { name: chosenName, url, pairs: specific.length ? specific : [ALL_PAIR_OPTION_VALUE] });
});
const out = {};
for (const row of byUrl.values()) {
let name = row.name || '';
if (!name) {
const m = String(row.url || '').match(/\/channels\/(\d+)/i);
name = m && m[1] ? ('Channel ' + m[1]) : row.url;
}
let finalName = name;
let suffix = 2;
while (Object.prototype.hasOwnProperty.call(out, finalName) && tf_normUrlKey(out[finalName].url || '') !== tf_normUrlKey(row.url || '')) {
finalName = name + ' #' + String(suffix++);
}
out[finalName] = { url: row.url, pairs: row.pairs };
}
return out;
}
function tf_combineImportPayloads(payloads, fileNames) {
const list = (Array.isArray(payloads) ? payloads : []).filter((p) => p && typeof p === 'object');
if (!list.length)
return null;
for (const p of list) {
const st=p&&p.storage&&typeof p.storage==='object'&&!Array.isArray(p.storage)?p.storage:p;
if(!tf_isRecognizedImportStorageV399(st,p)||!tf_hasImportContentV399(st))return null;
}
const primary = list[0];
const outStorage = tf_cloneJsonSafe(primary.storage && typeof primary.storage === 'object' ? primary.storage : primary, {});
const owners = [];
const ownerKey = (o) => String((o && (o.email || o.name)) || '').trim().toLowerCase();
const pushOwner = (o) => {
if (!o || typeof o !== 'object')
return;
const item = { name: String(o.name || '').trim(), email: String(o.email || '').trim(), avatarUrl: String(o.avatarUrl || '') };
if (!item.name && !item.email)
return;
const key = ownerKey(item);
if (!owners.some((x) => ownerKey(x) === key))
owners.push(item);
};
list.forEach((payload, idx) => {
tf_ownerListFromPayload(payload).forEach(pushOwner);
if (idx === 0)
return;
const src = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
outStorage.tfHistorySignals = tf_mergeHistoryArrays(outStorage.tfHistorySignals, src.tfHistorySignals);
outStorage.tfScoreHistory = tf_mergeScoreArrays(outStorage.tfScoreHistory, src.tfScoreHistory);
outStorage.tfMonthlyStats = tf_mergeMonthlyStats(outStorage.tfMonthlyStats, src.tfMonthlyStats);
outStorage.tfNoDataPairs = { ...(outStorage.tfNoDataPairs || {}), ...(tf_cloneJsonSafe(src.tfNoDataPairs, {}) || {}) };
outStorage.tfAvgSlPips = { ...(outStorage.tfAvgSlPips || {}), ...(tf_cloneJsonSafe(src.tfAvgSlPips, {}) || {}) };
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_mergeRememberedLinks(outStorage[TF_REMEMBERED_LINKS_KEY], src[TF_REMEMBERED_LINKS_KEY]);
outStorage[TF_ANALYST_SOURCES_KEY] = tf_mergeAnalystSources(outStorage[TF_ANALYST_SOURCES_KEY], src[TF_ANALYST_SOURCES_KEY]);
outStorage[TF_ANALYST_NAME_CACHE_KEY] = { ...(outStorage[TF_ANALYST_NAME_CACHE_KEY] || {}), ...(tf_cloneJsonSafe(src[TF_ANALYST_NAME_CACHE_KEY], {}) || {}) };
Object.keys(src || {}).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(outStorage, k))
outStorage[k] = tf_cloneJsonSafe(src[k], src[k]);
});
});
try {
if ((!Array.isArray(outStorage[TF_REMEMBERED_LINKS_KEY]) || outStorage[TF_REMEMBERED_LINKS_KEY].length === 0) && outStorage[TF_ANALYST_SOURCES_KEY] && typeof outStorage[TF_ANALYST_SOURCES_KEY] === 'object' && !Array.isArray(outStorage[TF_ANALYST_SOURCES_KEY])) {
const __tfSourcesV401 = outStorage[TF_ANALYST_SOURCES_KEY];
outStorage[TF_REMEMBERED_LINKS_KEY] = Object.keys(__tfSourcesV401 || {}).sort().map((n) => {
const it = __tfSourcesV401[n] || {};
return { name: n, url: it.url || it.link || '', pairs: Array.isArray(it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'] };
}).filter((x) => x.url);
}
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(outStorage[TF_REMEMBERED_LINKS_KEY] || [], outStorage[TF_ANALYST_SOURCES_KEY] || {});
outStorage[TF_REMEMBER_LINKS_ENABLED_KEY] = Array.isArray(outStorage[TF_REMEMBERED_LINKS_KEY]) && outStorage[TF_REMEMBERED_LINKS_KEY].length > 0;
}
catch (e) { }
return {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: owners.length ? owners[0] : (primary.exportedBy || null),
exportedByList: owners,
combined: list.length > 1,
combinedFileCount: list.length,
combinedFiles: Array.isArray(fileNames) ? fileNames.slice() : [],
localState: tf_cloneJsonSafe(primary.localState || {}, {}),
storage: outStorage
};
}

function tf_importPayloadToStorage(payload, afterImport) {
try {
if (!payload || typeof payload !== 'object') {
alert('File tidak valid.');
return;
}
const storage = payload.storage && typeof payload.storage === 'object' && !Array.isArray(payload.storage) ? payload.storage : payload;
if (!tf_isRecognizedImportStorageV399(storage,payload)) {
alert('File JSON valid, tetapi bukan format data TF Analyzer yang dikenali.');
setStatus('Import / Combine gagal — format data tidak dikenali.');
return false;
}
if (!tf_hasImportContentV399(storage)) {
alert('File JSON terbaca, tetapi tidak berisi History/Analis/Monthly/Score yang dapat di-import. Data lama tidak dihapus.');
setStatus('Import / Combine gagal — file kosong. Data lama tetap aman.');
return false;
}
if ((!Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) || storage[TF_REMEMBERED_LINKS_KEY].length === 0) && storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object' && !Array.isArray(storage[TF_ANALYST_SOURCES_KEY])) {
const sources = storage[TF_ANALYST_SOURCES_KEY];
const names = Object.keys(sources || {}).sort();
storage[TF_REMEMBERED_LINKS_KEY] = names
.map((n) => {
const it = sources[n] || {};
return {
url: it.url || '',
pairs: Array.isArray(it.pairs) ? it.pairs : ['__ALL__']
};
})
.filter((x) => x.url);
if (storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
}
if (Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) && storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
if (!storage[TF_SELECTED_TIME_RANGE_KEY]) {
storage[TF_SELECTED_TIME_RANGE_KEY] = 'all_time';
}
try {
const __tfDefaults = {};
__tfDefaults['tfMonthlyStats'] = {};
__tfDefaults['tfHistorySignals'] = [];
__tfDefaults['tfScoreHistory'] = [];
__tfDefaults['tfNoDataPairs'] = {};
__tfDefaults['tfAvgSlPips'] = {};
__tfDefaults[TF_ANALYST_SOURCES_KEY] = {};
__tfDefaults[TF_REMEMBERED_LINKS_KEY] = [];
__tfDefaults[TF_REMEMBER_LINKS_ENABLED_KEY] = false;
Object.keys(__tfDefaults).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(storage, k))
storage[k] = __tfDefaults[k];
});
}
catch (e) { }
try {
const remembered = Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) ? storage[TF_REMEMBERED_LINKS_KEY] : null;
const sources = storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object' ? storage[TF_ANALYST_SOURCES_KEY] : null;
if (remembered && remembered.length && sources) {
const allowed = new Set();
remembered.forEach((it) => {
try {
const u = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const k = u ? tf_normUrlKey(u) : '';
if (k)
allowed.add(k);
}
catch (e) { }
});
const filtered = {};
Object.keys(sources).forEach((nm) => {
try {
const it = sources[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const k = u ? tf_normUrlKey(u) : '';
if (k && allowed.has(k))
filtered[nm] = it;
}
catch (e) { }
});
storage[TF_ANALYST_SOURCES_KEY] = filtered;
}
}
catch (e) { }
try {
if (Array.isArray(storage[TF_REMEMBERED_LINKS_KEY])) {
storage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(storage[TF_REMEMBERED_LINKS_KEY], storage[TF_ANALYST_SOURCES_KEY]);
}
}
catch (e) { }
try {
const shouldClean = !!(payload && payload.forceCleanOrphans === true);
if (shouldClean) {
const allowedNames = new Set();
try {
const src = (storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object') ? storage[TF_ANALYST_SOURCES_KEY] : {};
Object.keys(src || {}).forEach((nm) => {
const n = String(nm || '').trim();
if (n)
allowedNames.add(n);
});
}
catch (e) { }
const hasAllowed = allowedNames.size > 0;
const baseFromMonthlyKey = (k) => {
const s = String(k || '').trim();
const m = s.match(/^(.*)\s*\(([A-Z0-9]+)\)\s*$/);
if (m && m[1])
return String(m[1]).trim();
return s;
};
if (hasAllowed) {
try {
if (Array.isArray(storage.tfHistorySignals)) {
storage.tfHistorySignals = storage.tfHistorySignals.filter((it) => {
if (!it || !it.analyst)
return false;
const a = String(it.analyst || '').trim();
return a && allowedNames.has(a);
});
}
}
catch (e) { }
try {
if (Array.isArray(storage.tfScoreHistory)) {
storage.tfScoreHistory = storage.tfScoreHistory.filter((it) => {
const a = String(it && (it.analyst || it.analystName) || '').trim();
return a && allowedNames.has(a);
});
}
}
catch (e) { }
try {
if (storage.tfAvgSlPips && typeof storage.tfAvgSlPips === 'object') {
const out = {};
Object.keys(storage.tfAvgSlPips).forEach((nm) => {
const a = String(nm || '').trim();
if (a && allowedNames.has(a))
out[a] = storage.tfAvgSlPips[nm];
});
storage.tfAvgSlPips = out;
}
}
catch (e) { }
try {
if (storage.tfNoDataPairs && typeof storage.tfNoDataPairs === 'object') {
const out = {};
Object.keys(storage.tfNoDataPairs).forEach((nm) => {
const a = String(nm || '').trim();
if (a && allowedNames.has(a))
out[a] = storage.tfNoDataPairs[nm];
});
storage.tfNoDataPairs = out;
}
}
catch (e) { }
try {
if (storage.tfMonthlyStats && typeof storage.tfMonthlyStats === 'object') {
const out = {};
Object.keys(storage.tfMonthlyStats).forEach((k) => {
const base = baseFromMonthlyKey(k);
if (base && allowedNames.has(base))
out[k] = storage.tfMonthlyStats[k];
});
storage.tfMonthlyStats = out;
}
}
catch (e) { }
try {
const ls = (payload && payload.localState && typeof payload.localState === 'object') ? payload.localState : null;
if (ls) {
const cleanJsonMapString = (rawStr) => {
try {
const obj = JSON.parse(String(rawStr || ''));
if (!obj || typeof obj !== 'object')
return rawStr;
const out = {};
Object.keys(obj).forEach((k) => {
const kk = String(k || '');
const base = kk.split('|')[0] ? String(kk.split('|')[0]).trim() : '';
if (base && allowedNames.has(base))
out[kk] = obj[k];
});
return JSON.stringify(out);
}
catch (e) {
return rawStr;
}
};
if (Object.prototype.hasOwnProperty.call(ls, 'tf_sl_type_selection')) {
ls['tf_sl_type_selection'] = cleanJsonMapString(ls['tf_sl_type_selection']);
}
if (Object.prototype.hasOwnProperty.call(ls, 'tf_risk_overrides')) {
ls['tf_risk_overrides'] = cleanJsonMapString(ls['tf_risk_overrides']);
}
}
}
catch (e) { }
}
}
}
catch (e) { }
try {
tf_applyLocalStateFromImport(payload.localState);
}
catch (e) { }
const toSet = {};
TF_EXPORT_STORAGE_KEYS.forEach((k) => {
if (Object.prototype.hasOwnProperty.call(storage, k)) {
toSet[k] = storage[k];
}
});
try {
if (Object.prototype.hasOwnProperty.call(toSet, 'tfUserProfile'))
delete toSet.tfUserProfile;
}
catch (e) { }
try {
const __tfImportOwners = tf_ownerListFromPayload(payload);
toSet.tfLastImportMeta = (__tfImportOwners.length || (payload && payload.exportedBy)) ? {
exportedAt: payload.exportedAt || '',
exportedBy: __tfImportOwners.length ? __tfImportOwners[0] : (payload.exportedBy || null),
exportedByList: __tfImportOwners,
combined: !!(payload && payload.combined),
combinedFileCount: payload && payload.combinedFileCount ? Number(payload.combinedFileCount) : (__tfImportOwners.length > 1 ? __tfImportOwners.length : 1),
combinedFiles: payload && Array.isArray(payload.combinedFiles) ? payload.combinedFiles.slice() : []
} : null;
toSet.tfLastScanMeta = null;
}
catch (e) { }
try {
const existingImportedLinks = Array.isArray(toSet[TF_REMEMBERED_LINKS_KEY]) ? toSet[TF_REMEMBERED_LINKS_KEY] : [];
if (!existingImportedLinks.length) {
const rebuiltImportedLinks = tf_buildRememberedLinksFromImportedSources(toSet[TF_ANALYST_SOURCES_KEY]);
if (rebuiltImportedLinks.length) toSet[TF_REMEMBERED_LINKS_KEY] = rebuiltImportedLinks;
}
toSet[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;
toSet[TF_IMPORT_LOCK_ENGAGED_KEY] = false;
toSet[TF_IMPORT_LOCKED_SIGS_KEY] = [];
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] = 0;
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] = 0;
toSet.tfLastImportAt = new Date().toISOString();
setStatus('Importing...');
chrome.storage.local.set(toSet, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
setStatus('Import selesai ✅');
try {
loadPopupStateFromStorage();
}
catch (e) { }
// REV402: do not block the import-complete frame with duplicate sidebar/time-range work.
const __tfPostImportRefreshV402 = () => {
try { tf_refreshTimeRangeUIFromStorage(); } catch (e) { }
try { tf_renderSavedChannelsStatusFromStorage(); } catch (e) { }
};
try {
if (typeof requestIdleCallback === 'function') requestIdleCallback(__tfPostImportRefreshV402, { timeout: 350 });
else setTimeout(__tfPostImportRefreshV402, 0);
} catch (e) { setTimeout(__tfPostImportRefreshV402, 0); }
if (typeof afterImport === 'function') {
try {
afterImport();
}
catch (e) { }
}
});
}
catch (e) {
alert('Gagal import file.');
}
}
let __tfUpdatePickerBusy=false;
async function tf_chooseUpdateAnalysts(){
const d=await chrome.storage.local.get([TF_ANALYST_SOURCES_KEY,TF_REMEMBERED_LINKS_KEY]);
const sources=d[TF_ANALYST_SOURCES_KEY]||{},remembered=d[TF_REMEMBERED_LINKS_KEY],maps=tf_buildNameMapsFromSources(sources);
const list=Array.isArray(remembered)&&remembered.length?remembered:Object.entries(sources).map(([name,c])=>({...c,name,url:c.url||c.link}));
const channels=list.map((c,i)=>{const url=tf_normalizeTfAccountUrl(c.url||c.link||'');return {url,name:tf_resolveAnalystNameForUrl(url,maps)||c.name||c.analystName||'Analis '+(i+1)};}).filter(c=>c.url);
if(!channels.length){alert('Tidak ada analis untuk Update. Silakan Import data terlebih dahulu.');return null;}
return TFUpdatePicker.select(channels);
}
function tf_startBatchScanFromStoredConfig(originLabel,selectedUpdateUrls) {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY, TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
let channels = [];
const nameMaps = tf_buildNameMapsFromSources(sources);
const isPlaceholderName = (s) => {
const t = String(s || '').trim();
if (!t)
return true;
if (/^channel\s*id$/i.test(t))
return true;
if (/^channel\s+\d+$/i.test(t))
return true;
if (/^link\s+\d+$/i.test(t))
return true;
return false;
};
if (Array.isArray(remembered) && remembered.length) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
let nm = (it && (it.name || it.analystName)) ? String(it.name || it.analystName) : '';
if (isPlaceholderName(nm))
nm = '';
if (!nm && url) {
try {
nm = tf_resolveAnalystNameForUrl(url, nameMaps) || '';
}
catch (e) {
nm = '';
}
}
if (!nm) {
const fb = (it && it._fallbackLabel) ? String(it._fallbackLabel) : '';
if (fb && !isPlaceholderName(fb))
nm = fb;
}
if (!nm && url) {
const m = String(url).match(/\/channels\/(\d+)/i);
if (m && m[1])
nm = 'Channel ' + m[1];
}
if (!nm)
nm = `Link ${idx + 1}`;
return url ? { name: nm, url, pairs } : null;
})
.filter(Boolean);
}
if (!channels.length && sources && typeof sources === 'object') {
channels = Object.keys(sources)
.map((name) => {
const it = sources[name] || {};
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const pairs = Array.isArray(it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
return url ? { name, url, pairs } : null;
})
.filter(Boolean);
}
try {
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
const lockedSigs = (d && Array.isArray(d[TF_IMPORT_LOCKED_SIGS_KEY])) ? d[TF_IMPORT_LOCKED_SIGS_KEY] : [];
tf_addModeEngaged = lockEngaged;
tf_addModeSigSet = new Set(lockedSigs);
const isUpdateNow = String(originLabel || '').toLowerCase().includes('update');
if (lockEngaged && !isUpdateNow) {
channels = tf_filterChannelsByAddMode(channels);
}
}
catch (e) { }
if(String(originLabel||'').toLowerCase().includes('update')&&Array.isArray(selectedUpdateUrls)){
const selected=new Set(selectedUpdateUrls.map(tf_normalizeTfAccountUrl));channels=channels.filter(c=>selected.has(c.url));
}
if (!channels.length) {
alert('Tidak ada link channel di file / storage. Silakan Import file yang benar.');
return;
}
try {
const isUpdate = String(originLabel || '').toLowerCase().includes('update');
const scanMode = isUpdate ? 'update' : 'full';
const allowedRanges = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
const storedRange = d && d[TF_SELECTED_TIME_RANGE_KEY] ? String(d[TF_SELECTED_TIME_RANGE_KEY]) : 'all_time';
const payload = {
type: 'startBatchScan',
channels: channels,
origin: originLabel || 'updateButton',
scanMode
};
// Hanya full scan yang boleh memakai selector Time Range.
// Update tidak mengirim forceTimeRange agar pilihan UI/storage tidak berubah.
if (!isUpdate) {
payload.forceTimeRange = allowedRanges.has(storedRange) ? storedRange : 'all_time';
}
if (isUpdate) {
__tfUpdateStopOptimisticUnlock = false;
try { tf_setUpdateActivityLock(true); } catch (e) { }
}
const sendUpdateRequest = (attempt) => {
try {
chrome.runtime.sendMessage(payload, (response) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError || null;
}
catch (e) { }
if ((runtimeError || !response) && attempt < 1) {
setTimeout(() => sendUpdateRequest(attempt + 1), 350);
return;
}
if (runtimeError) {
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + (runtimeError.message || 'background tidak merespons.'));
return;
}
if (!response || response.ok === false) {
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + ((response && response.error) ? response.error : 'background tidak merespons.'));
return;
}
setStatus('Update scan dimulai...');
});
}
catch (error) {
if (attempt < 1) {
setTimeout(() => sendUpdateRequest(attempt + 1), 350);
return;
}
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + ((error && error.message) ? error.message : String(error)));
}
};
sendUpdateRequest(0);
}
catch (e) {
setStatus('Update gagal dimulai: ' + ((e && e.message) ? e.message : String(e)));
}
});
}
catch (e) { }
}

let __tfUpdateActivityLocked = false;
let __tfUpdateStopOptimisticUnlock = false;
function tf_setUpdateActivityLock(on) {
try {
const locked = !!on;
__tfUpdateActivityLocked = locked;
const ids = [
  'tf-btn-import-main','tf-btn-import-masuk','tf-btn-import-isignal',
  'tf-btn-export-main','tf-btn-export-masuk','tf-btn-export-isignal',
  'tf-btn-add-analyst-main','tf-btn-add-analyst-masuk','tf-btn-add-analyst-isignal',
  'tf-btn-submit-main','tf-btn-submit-masuk','tf-btn-submit-isignal',
  'tf-btn-scanlink-main','tf-btn-scanlink-masuk','tf-btn-scanlink-isignal',
  'tf-btn-scanpair-main','tf-btn-scanpair-masuk','tf-btn-scanpair-isignal',
  'batch-scan-btn','batch-scan-isignal-btn','scan-btn',
  'add-analyst-btn','add-analyst-isignal-btn','scan-from-isignal-btn'
];
const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
  .concat(Array.from(document.querySelectorAll('.analyst-remove-btn')));
nodes.forEach((el) => {
  try {
    if (!el || !el.dataset) return;
    if (locked) {
      if (typeof el.dataset.tfUpdatePrevDisabled === 'undefined')
        el.dataset.tfUpdatePrevDisabled = el.disabled ? '1' : '0';
      if (typeof el.dataset.tfUpdatePrevTitle === 'undefined')
        el.dataset.tfUpdatePrevTitle = el.title || '';
      el.disabled = true;
      el.setAttribute('aria-disabled', 'true');
      el.classList.add('tf-update-activity-locked');
      el.title = 'Dikunci sementara selama proses Update berjalan.';
    } else {
      const prev = el.dataset.tfUpdatePrevDisabled;
      if (prev === '0') el.disabled = false;
      else if (prev === '1') el.disabled = true;
      el.setAttribute('aria-disabled', el.disabled ? 'true' : 'false');
      el.classList.remove('tf-update-activity-locked');
      if (typeof el.dataset.tfUpdatePrevTitle !== 'undefined')
        el.title = el.dataset.tfUpdatePrevTitle || '';
      delete el.dataset.tfUpdatePrevDisabled;
      delete el.dataset.tfUpdatePrevTitle;
    }
  } catch (e) { }
});
// Refresh sengaja tetap aktif, kecuali sedang menjalankan animasi Refresh sendiri.
['tf-btn-refresh-main','tf-btn-refresh-masuk','tf-btn-refresh-isignal'].forEach((id) => {
  const b = document.getElementById(id);
  if (b && !b.classList.contains('tf-refresh-loading')) b.disabled = false;
});
if (!locked) {
  try { tf_syncUpdateButtonsEnabledFromStorage(); } catch (e) { }
  try { tf_updateExportButtonsEnabledFromStorage(); } catch (e) { }
}
}
catch (e) { }
}

function tf_btnEnsureOriginal(btn) {
if (!btn || !btn.dataset)
return;
if (!btn.dataset.tfOrigText)
btn.dataset.tfOrigText = btn.textContent || '';
if (!btn.dataset.tfOrigClass)
btn.dataset.tfOrigClass = btn.className || '';
}
function tf_isStopMode(btn) {
return !!(btn && btn.dataset && btn.dataset.tfStopMode === '1');
}
function tf_setStopMode(btn, on) {
if (!btn)
return;
tf_btnEnsureOriginal(btn);
const origClass = btn.dataset.tfOrigClass || '';
const isLinkStyle = origClass.includes('tf-action-link');
const isBoxStyle = origClass.includes('tf-action-box') || origClass.includes('tf-submit-action-btn');
if (on) {
btn.dataset.tfStopMode = '1';
const isUpdateButton = !!(btn.id && String(btn.id).indexOf('tf-btn-update-') === 0);
btn.textContent = isUpdateButton ? 'Stop!' : TF_STOP_LABEL;
btn.className = isBoxStyle
? (origClass + ' tf-action-stop')
: (isLinkStyle ? 'tf-action-link tf-action-stop' : 'btn danger');
}
else {
btn.dataset.tfStopMode = '0';
btn.textContent = btn.dataset.tfOrigText || 'Submit';
btn.className = btn.dataset.tfOrigClass || 'btn';
}
}
function tf_isSingleScanOrigin(origin) {
const o = origin ? String(origin) : '';
return o === 'scanChannelButton' || o === 'scanChannelHyperlink';
}
function tf_getScanHyperlinkButtons() {
return [
document.getElementById('tf-btn-scanlink-main'),
document.getElementById('tf-btn-scanlink-masuk'),
document.getElementById('tf-btn-scanlink-isignal')
].filter(Boolean);
}
function tf_isScanHyperlinkStopMode() {
try {
return tf_getScanHyperlinkButtons().some((btn) => !!(btn.dataset && btn.dataset.tfStopMode === '1'));
}
catch (e) {
return false;
}
}
function tf_setScanHyperlinkStopMode(on, stopping) {
try {
const isOn = !!on;
const isStopping = !!stopping;
tf_getScanHyperlinkButtons().forEach((btn) => {
if (!btn || !btn.dataset)
return;
if (!btn.dataset.tfScanLinkOrigText)
btn.dataset.tfScanLinkOrigText = btn.textContent || 'Scan Channel ini';
if (!btn.dataset.tfScanLinkOrigClass)
btn.dataset.tfScanLinkOrigClass = btn.className || 'tf-action-link';
if (isOn) {
btn.dataset.tfStopMode = '1';
btn.dataset.tfScanStopping = isStopping ? '1' : '0';
btn.disabled = false;
btn.removeAttribute('disabled');
btn.setAttribute('aria-disabled', 'false');
btn.setAttribute('aria-busy', 'true');
btn.style.pointerEvents = 'auto';
btn.className = (btn.dataset.tfScanLinkOrigClass || 'tf-action-link') + ' tf-action-stop tf-scanlink-running';
btn.innerHTML = '<span class="tf-scanlink-mini-spinner" aria-hidden="true"></span><span>' + (isStopping ? 'Stopping...' : 'Stop!!') + '</span>';
btn.title = isStopping
? 'Sedang menghentikan scan dan membuang hasil sementara.'
: 'Hentikan Scan Channel ini. Hasil scan sementara tidak akan disimpan.';
}
else {
btn.dataset.tfStopMode = '0';
btn.dataset.tfScanStopping = '0';
btn.removeAttribute('aria-busy');
btn.className = btn.dataset.tfScanLinkOrigClass || 'tf-action-link';
btn.textContent = btn.dataset.tfScanLinkOrigText || 'Scan Channel ini';
btn.title = '';
}
});
}
catch (e) { }
}
function tf_setStopModeAll(on) {
try {
tf_setStopMode(document.getElementById('batch-scan-btn'), on);
tf_setStopMode(document.getElementById('batch-scan-isignal-btn'), on);
tf_setStopMode(document.getElementById('scan-btn'), on);
if (!on)
tf_setScanHyperlinkStopMode(false, false);
}
catch (e) { }
}
function tf_getButtonForOrigin(origin) {
const o = origin ? String(origin) : '';
if (o === 'dashboardSubmit')
return document.getElementById('batch-scan-btn');
if (o === 'isignalSubmit')
return document.getElementById('batch-scan-isignal-btn');
if (o === 'scanChannelButton')
return document.getElementById('scan-btn');
if (o === 'updateButton')
return document.getElementById('tf-btn-update-main') || document.getElementById('tf-btn-update-masuk');
return null;
}
let tf_scanUiInProgress = false;
let tf_scanUiOrigin = '';
function tf_applyStopModeFromScanState(inProgress, origin) {
const on = !!inProgress;
tf_scanUiInProgress = on;
const o = origin ? String(origin) : '';
tf_scanUiOrigin = on ? o : '';
const btnDash = document.getElementById('batch-scan-btn');
const btnIsig = document.getElementById('batch-scan-isignal-btn');
const btnScan = document.getElementById('scan-btn');
const btnUpdMain = document.getElementById('tf-btn-update-main');
const btnUpdMasuk = document.getElementById('tf-btn-update-masuk');
const btnUpdIsignal = document.getElementById('tf-btn-update-isignal');
if (!on) {
__tfUpdateStopOptimisticUnlock = false;
[btnUpdMain, btnUpdMasuk, btnUpdIsignal].forEach((btn) => {
try {
if (btn && btn.dataset) delete btn.dataset.tfStopPending;
if (btn) btn.removeAttribute('aria-busy');
}
catch (e) { }
});
try { tf_setUpdateActivityLock(false); } catch (e) { }
try {
tf_setStopMode(btnDash, false);
}
catch (e) { }
try {
tf_setStopMode(btnIsig, false);
}
catch (e) { }
try {
tf_setStopMode(btnScan, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdMain, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdMasuk, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdIsignal, false);
}
catch (e) { }
try {
tf_setScanHyperlinkStopMode(false, false);
}
catch (e) { }
return;
}
const target = tf_getButtonForOrigin(origin);
try { tf_setUpdateActivityLock(o === 'updateButton' && !__tfUpdateStopOptimisticUnlock); } catch (e) { }
try {
tf_setStopMode(btnDash, target === btnDash);
}
catch (e) { }
try {
tf_setStopMode(btnIsig, target === btnIsig);
}
catch (e) { }
try {
tf_setStopMode(btnScan, target === btnScan);
}
catch (e) { }
const isUpdateOrigin = o === 'updateButton';
try {
tf_setStopMode(btnUpdMain, isUpdateOrigin || target === btnUpdMain);
}
catch (e) { }
try {
tf_setStopMode(btnUpdMasuk, isUpdateOrigin || target === btnUpdMasuk);
}
catch (e) { }
try {
tf_setStopMode(btnUpdIsignal, isUpdateOrigin || target === btnUpdIsignal);
}
catch (e) { }
try {
tf_setScanHyperlinkStopMode(o === 'scanChannelHyperlink', false);
}
catch (e) { }
}
let tf_keepalivePort = null;
let tf_keepalivePingTimer = null;
let tf_keepaliveReconnectTimer = null;
let tf_keepaliveWanted = false;
let tf_uiPresencePort = null;
let tf_uiPresenceHeartbeatTimer = null;
let tf_uiPresencePortPingTimer = null;
let tf_uiPresenceReconnectTimer = null;
let tf_uiPresenceClosing = false;
let tf_uiPresenceCachedCredential = null;
let tf_uiPresenceEndpoint = '';
async function tf_uiPresenceDirectBestEffort(active, eventName) {
try {
const c = tf_uiPresenceCachedCredential;
if (!c || !c.email || !c.token) return null;
let endpoint = String(tf_uiPresenceEndpoint || '').trim();
if (!endpoint) {
const stored = await tfStorageGet([TF_LICENSE_PRESENCE_ENDPOINT_KEY]);
endpoint = String(stored[TF_LICENSE_PRESENCE_ENDPOINT_KEY] || '').trim();
if (endpoint) tf_uiPresenceEndpoint = endpoint;
}
if (!endpoint) return null;
const response = await fetch(endpoint, {
method: 'POST', redirect: 'follow', cache: 'no-store', keepalive: active !== true,
headers: { 'Content-Type': 'application/json;charset=UTF-8' },
body: JSON.stringify({
action: 'presence', email: c.email, token: c.token, deviceId: c.deviceId || '',
uiPresenceActive: active === true,
presenceEvent: String(eventName || (active ? 'HEARTBEAT' : 'CLOSE')).toUpperCase(),
clientPage: 'side_panel_direct', requestNonce: String(Date.now()) + '-presence-direct-' + Math.random().toString(36).slice(2)
})
});
try { return await response.json(); } catch (e) { return null; }
}
catch (e) { return null; }
}
async function tf_uiPresenceHeartbeatOnce(eventName, activeOverride) {
try {
const stored = await tfStorageGet([TF_LICENSE_CREDENTIALS_KEY, TF_LICENSE_PRESENCE_ENDPOINT_KEY]);
const credentials = stored[TF_LICENSE_CREDENTIALS_KEY] || {};
const email = tfCleanEmail(credentials.email || credentials.emailOriginal || credentials.emailCanonical || '');
const token = tfNormalizeToken(credentials.token || '');
if (!email || !token) return null;
const deviceId = await tfGetDeviceId();
tf_uiPresenceCachedCredential = { email, token, deviceId };
if (stored[TF_LICENSE_PRESENCE_ENDPOINT_KEY]) tf_uiPresenceEndpoint = String(stored[TF_LICENSE_PRESENCE_ENDPOINT_KEY]);
const active = typeof activeOverride === 'boolean' ? activeOverride : true;
const result = await tfCallLicenseApi('lookup', email, token, {
timeoutMs: 8000, attempts: 1, retryDelayMs: 0,
uiPresenceActive: active,
presenceEvent: String(eventName || 'HEARTBEAT').toUpperCase()
});
if (result && result.presenceEndpoint) {
tf_uiPresenceEndpoint = String(result.presenceEndpoint);
try { await tfStorageSet({ [TF_LICENSE_PRESENCE_ENDPOINT_KEY]: tf_uiPresenceEndpoint }); } catch (e) { }
}
void tf_uiPresenceDirectBestEffort(active, eventName || 'HEARTBEAT');
return result;
}
catch (e) { return null; }
}
function tf_uiPresenceStartHeartbeat() {
try { if (tf_uiPresenceHeartbeatTimer) clearInterval(tf_uiPresenceHeartbeatTimer); } catch (e) { }
void tf_uiPresenceHeartbeatOnce('OPEN', true);
tf_uiPresenceHeartbeatTimer = setInterval(() => { void tf_uiPresenceHeartbeatOnce('HEARTBEAT', true); }, 30000);
}
function tf_uiPresenceSendCloseBestEffort() {
try {
if (tf_uiPresenceHeartbeatTimer) clearInterval(tf_uiPresenceHeartbeatTimer);
tf_uiPresenceHeartbeatTimer = null;
// IMPORTANT: do not send CLOSE through the legacy Worker. Older Worker builds
// may strip presenceEvent/uiPresenceActive and would turn this into a generic
// lookup heartbeat. Direct bridge is used when available; otherwise TTL is the fallback.
void tf_uiPresenceDirectBestEffort(false, 'CLOSE');
}
catch (e) { }
}
function tf_uiPresenceClearPortTimers() {
try { if (tf_uiPresencePortPingTimer) clearInterval(tf_uiPresencePortPingTimer); } catch (e) { }
tf_uiPresencePortPingTimer = null;
try { if (tf_uiPresenceReconnectTimer) clearTimeout(tf_uiPresenceReconnectTimer); } catch (e) { }
tf_uiPresenceReconnectTimer = null;
}
function tf_uiPresenceScheduleReconnect() {
if (tf_uiPresenceClosing || tf_uiPresenceReconnectTimer) return;
try {
tf_uiPresenceReconnectTimer = setTimeout(() => {
tf_uiPresenceReconnectTimer = null;
if (!tf_uiPresenceClosing) tf_uiPresenceOpen(true);
}, 1000);
}
catch (e) { }
}
function tf_uiPresenceClose() {
tf_uiPresenceClosing = true;
tf_uiPresenceClearPortTimers();
try { tf_uiPresenceSendCloseBestEffort(); } catch (e) { }
try { if (tf_uiPresencePort) tf_uiPresencePort.disconnect(); } catch (e) { }
tf_uiPresencePort = null;
}
try { window.addEventListener('pagehide', tf_uiPresenceClose, { once: true }); } catch (e) { }
try { window.addEventListener('beforeunload', tf_uiPresenceClose, { once: true }); } catch (e) { }
function tf_uiPresenceOpen(isReconnect) {
try {
if (tf_uiPresenceClosing || tf_uiPresencePort) return;
if (!chrome || !chrome.runtime || !chrome.runtime.connect) return;
const port = chrome.runtime.connect({ name: 'tf_ui_presence' });
tf_uiPresencePort = port;
try {
port.postMessage({ type: 'tf_ui_presence_ping', at: Date.now(), reconnect: isReconnect === true });
}
catch (e) { }
try {
if (tf_uiPresencePortPingTimer) clearInterval(tf_uiPresencePortPingTimer);
tf_uiPresencePortPingTimer = setInterval(() => {
try {
if (tf_uiPresencePort === port) port.postMessage({ type: 'tf_ui_presence_ping', at: Date.now() });
}
catch (e) { }
}, 20000);
}
catch (e) { }
try { tf_uiPresenceStartHeartbeat(); } catch (e) { }
try {
port.onDisconnect.addListener(() => {
if (tf_uiPresencePort === port) tf_uiPresencePort = null;
try { if (tf_uiPresencePortPingTimer) clearInterval(tf_uiPresencePortPingTimer); } catch (e) { }
tf_uiPresencePortPingTimer = null;
// Manifest V3 may recycle the service worker while the Side Panel is still open.
// Reconnect instead of treating that transient disconnect as a real panel close.
if (!tf_uiPresenceClosing) tf_uiPresenceScheduleReconnect();
});
}
catch (e) { }
}
catch (e) {
tf_uiPresencePort = null;
if (!tf_uiPresenceClosing) tf_uiPresenceScheduleReconnect();
}
}
function tf_keepaliveOpen() {
tf_keepaliveWanted = true;
try {
if (tf_keepalivePort) return;
if (!chrome || !chrome.runtime || !chrome.runtime.connect) return;
const port = chrome.runtime.connect({ name: 'tf_keepalive' });
tf_keepalivePort = port;
try { port.postMessage({ type: 'tf_keepalive_ping', at: Date.now() }); } catch (e) { }
try {
if (tf_keepalivePingTimer) clearInterval(tf_keepalivePingTimer);
tf_keepalivePingTimer = setInterval(() => {
try { if (tf_keepalivePort === port) port.postMessage({ type: 'tf_keepalive_ping', at: Date.now() }); } catch (e) { }
}, 20000);
}
catch (e) { }
try {
port.onDisconnect.addListener(() => {
if (tf_keepalivePort === port) tf_keepalivePort = null;
try { if (tf_keepalivePingTimer) clearInterval(tf_keepalivePingTimer); } catch (e) { }
tf_keepalivePingTimer = null;
if (!tf_keepaliveWanted || tf_keepaliveReconnectTimer) return;
try {
tf_keepaliveReconnectTimer = setTimeout(() => {
tf_keepaliveReconnectTimer = null;
if (tf_keepaliveWanted) tf_keepaliveOpen();
}, 1000);
}
catch (e) { }
});
}
catch (e) { }
}
catch (e) {
tf_keepalivePort = null;
}
}
function tf_keepaliveClose() {
tf_keepaliveWanted = false;
try { if (tf_keepalivePingTimer) clearInterval(tf_keepalivePingTimer); } catch (e) { }
tf_keepalivePingTimer = null;
try { if (tf_keepaliveReconnectTimer) clearTimeout(tf_keepaliveReconnectTimer); } catch (e) { }
tf_keepaliveReconnectTimer = null;
try { if (tf_keepalivePort) tf_keepalivePort.disconnect(); } catch (e) { }
tf_keepalivePort = null;
}
function tf_sendStopProgress(cb) {
try {
tf_keepaliveClose();
}
catch (e) { }
let cbDone = false;
const finish = (r) => {
if (cbDone)
return;
cbDone = true;
if (typeof cb === 'function')
cb(r || null);
};
try {
chrome.runtime.sendMessage({ type: 'stopBatchScan' }, (r) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
finish(r);
});
}
catch (e) {
finish({ ok: false, error: String(e) });
}
try {
if (typeof tf_activeSingleScanTabId !== 'undefined' && tf_activeSingleScanTabId) {
tf_sendStopScanToTab(tf_activeSingleScanTabId, () => { });
}
}
catch (e) { }
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const t = tabs && tabs[0];
if (t && t.id) {
tf_sendStopScanToTab(t.id, () => { });
}
});
}
catch (e) { }
}
let tf_activeSingleScanTabId = null;
let tf_activeSingleScanUiSessionId = null;
function tf_sendStopScanToTab(tabId, cb) {
if (!tabId) {
if (typeof cb === 'function')
cb({ ok: false, error: 'no tabId' });
return;
}
try {
chrome.tabs.sendMessage(tabId, { type: 'stopScan' }, (r) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (typeof cb === 'function')
cb(r || null);
});
}
catch (e) {
if (typeof cb === 'function')
cb({ ok: false, error: String(e) });
}
}
let tf__bootLoadingActive = false;
let tf__bootFinished = false;
function tf_setBootLoading(active, title, sub) {
try {
tf__bootLoadingActive = !!active;
const overlay = document.getElementById('boot-loading-overlay');
const titleEl = document.getElementById('boot-loading-title');
const subEl = document.getElementById('boot-loading-sub');
if (titleEl && typeof title === 'string')
titleEl.textContent = title;
if (subEl && typeof sub === 'string')
subEl.textContent = sub;
if (overlay)
overlay.style.display = active ? 'flex' : 'none';
if (active) {
const ids = ['login-container', 'masuk-container', 'main-container'];
ids.forEach((id) => {
const el = document.getElementById(id);
if (el)
el.style.display = 'none';
});
}
}
catch (e) { }
}
function tf_bootFinish() {
if (tf__bootFinished)
return;
tf__bootFinished = true;
try {
tf_setBootLoading(false);
}
catch (e) { }
try {
loadPopupStateFromStorage();
}
catch (e) { }
}
function tf_isProfileReady(profile) {
try {
if (!profile || typeof profile !== 'object')
return false;
const name = String(profile.name || '').trim();
const email = String(profile.email || '').trim();
const avatar = String(profile.avatarUrl || '').trim();
const online = /online|connected/i.test(String(profile.statusText || 'Online'));
const genericName = /^(akun\s+tradersfamily|user\s+belum\s+login|user|profile|account|memuat\s+profil|thumbnail)$/i.test(name) || /\bchannel\s*(image|photo|avatar|logo)\b/i.test(name) || /\b(analyst|analis|signal)\s*image\b/i.test(name);
const defaultAvatar = /user-default|default[-_]?avatar|avatar[-_]?default|placeholder|no[-_]?avatar/i.test(avatar);
return !!(name && !genericName && online && (email || (avatar && !defaultAvatar)));
}
catch (e) {
return false;
}
}
function tf_bootFinishMaybeWaitProfile() {
try {
if (!hasChromeStorage()) {
tf_bootFinish();
return;
}
chrome.storage.local.get(['tfRootLoginState', 'tfUserProfile'], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const state = d && d.tfRootLoginState ? String(d.tfRootLoginState) : 'unknown';
const profile = d && d.tfUserProfile ? d.tfUserProfile : null;
if (state !== 'logged_in') {
tf_bootFinish();
return;
}
if (tf_isProfileReady(profile)) {
try {
applyProfileToPopup(profile);
}
catch (e) { }
tf_bootFinish();
return;
}
try {
tf_setBootLoading(true, 'Login terdeteksi...', 'Mengambil profil (foto & nama)...');
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_tf_profile' }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
const startedAt = Date.now();
const timeoutMs = 15000;
const tick = () => {
try {
chrome.storage.local.get(['tfUserProfile'], (x) => {
const p = x && x.tfUserProfile ? x.tfUserProfile : null;
if (tf_isProfileReady(p)) {
try {
applyProfileToPopup(p);
}
catch (e) { }
tf_bootFinish();
return;
}
if (Date.now() - startedAt >= timeoutMs) {
tf_bootFinish();
return;
}
setTimeout(tick, 350);
});
}
catch (e) {
tf_bootFinish();
}
};
setTimeout(tick, 350);
});
}
catch (e) {
try {
tf_bootFinish();
}
catch (err) { }
}
}
function showDashboardSubview() {
const dash = document.getElementById('dashboard-view');
const isig = document.getElementById('isignal-view');
if (dash)
dash.style.display = 'block';
if (isig)
isig.style.display = 'none';
}
function showIsignalSubview() {
const dash = document.getElementById('dashboard-view');
const isig = document.getElementById('isignal-view');
if (dash)
dash.style.display = 'none';
if (isig)
isig.style.display = 'block';
}
function tf_openTabWaitComplete(url, active, timeoutMs) {
return new Promise((resolve, reject) => {
if (!chrome || !chrome.tabs)
return reject(new Error('chrome.tabs tidak tersedia'));
let finished = false;
const timeout = setTimeout(() => {
if (finished)
return;
finished = true;
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
reject(new Error('timeout membuka halaman'));
}, timeoutMs || 20000);
const onUpdated = (tabId, info, tab) => {
if (finished)
return;
if (!tabId)
return;
if (!createdTabId)
return;
if (tabId !== createdTabId)
return;
if (info && info.status === 'complete') {
finished = true;
clearTimeout(timeout);
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
resolve({ tabId, tab });
}
};
let createdTabId = null;
try {
chrome.tabs.onUpdated.addListener(onUpdated);
}
catch (e) { }
chrome.tabs.create({ url, active: !!active }, (t) => {
if (chrome.runtime && chrome.runtime.lastError) {
finished = true;
clearTimeout(timeout);
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
return reject(new Error(chrome.runtime.lastError.message));
}
createdTabId = t && t.id ? t.id : null;
if (!createdTabId) {
finished = true;
clearTimeout(timeout);
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
return reject(new Error('Gagal membuat tab'));
}
try {
chrome.tabs.get(createdTabId, (fresh) => {
if (finished)
return;
if (chrome.runtime && chrome.runtime.lastError)
return;
if (fresh && fresh.status === 'complete') {
finished = true;
clearTimeout(timeout);
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
resolve({ tabId: createdTabId, tab: fresh });
}
});
}
catch (e) { }
});
});
}
function tf_sendMessageToTab(tabId, payload) {
return new Promise((resolve) => {
try {
chrome.tabs.sendMessage(tabId, payload, (r) => {
let err = null;
try {
if (chrome.runtime && chrome.runtime.lastError)
err = chrome.runtime.lastError.message;
}
catch (e) { }
resolve({ response: r, error: err });
});
}
catch (e) {
resolve({ response: null, error: e && e.message ? e.message : String(e) });
}
});
}
function tf_delayMs(ms) {
return new Promise((r) => setTimeout(r, ms));
}
async function tf_waitContentReady(tabId, timeoutMs) {
const t0 = Date.now();
const max = typeof timeoutMs === 'number' ? timeoutMs : 12000;
while (Date.now() - t0 < max) {
const { response, error } = await tf_sendMessageToTab(tabId, { type: 'ping' });
if (!error && response && response.ok)
return true;
if (error && /Receiving end does not exist|Could not establish connection/i.test(error)) {
await tf_delayMs(450);
continue;
}
if (error)
throw new Error(error);
await tf_delayMs(450);
}
try {
const tab = await new Promise((resolve) => chrome.tabs.get(tabId, (t) => resolve(t)));
const u = tab && tab.url ? String(tab.url) : '';
if (u && !/\/channels\//i.test(u)) {
throw new Error('Halaman iSignal tidak terbuka (mungkin redirect login). URL: ' + u);
}
}
catch (e) { }
throw new Error('Content script belum siap (timeout).');
}
function tf_populateIsignalRows(items) {
const container = document.getElementById('isignal-links-container');
if (!container)
return;
const templateRow = container.querySelector('.analyst-row');
if (!templateRow)
return;
const template = templateRow.cloneNode(true);
container.innerHTML = '';
const safeItems = Array.isArray(items) ? items : [];
if (!safeItems.length) {
const row = template.cloneNode(true);
const input = row.querySelector('.analyst-link-input');
if (input)
input.value = '';
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn)
nameBtn.textContent = '-';
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
try {
const sel = row.querySelector('.analyst-pair-select');
if (sel)
tf_applyPairsArrayToSelect(sel, tf_getAllAnalystPairsCachedIsignal());
}
catch (e) { }
try {
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
}
catch (e) { }
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
container.appendChild(row);
return;
}
safeItems.forEach((it) => {
const row = template.cloneNode(true);
const url = (it && it.url) ? String(it.url).trim() : '';
const nm = (it && it.name) ? String(it.name).trim() : '';
const input = row.querySelector('.analyst-link-input');
if (input) {
input.value = url;
input.readOnly = true;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
nameBtn.textContent = nm ? tf_truncAnalystName10(nm) : '-';
try {
if (nm && nameBtn.dataset)
nameBtn.dataset.tfFullName = nm;
}
catch (e) { }
try {
if (nm)
nameBtn.title = nm;
}
catch (e) { }
nameBtn.disabled = false;
}
const select = row.querySelector('.analyst-pair-select');
if (select) {
try {
const savedPairs = Array.isArray(it && it.pairs) ? it.pairs : tf_getAllAnalystPairsCachedIsignal();
tf_applyPairsArrayToSelect(select, savedPairs);
}
catch (e) { }
}
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
try {
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
}
catch (e) { }
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
container.appendChild(row);
try {
const pairsUpsert = Array.isArray(it && it.pairs)
? it.pairs
: ((typeof tf_getAllAnalystPairsCachedIsignal === 'function') ? tf_getAllAnalystPairsCachedIsignal() : ['__ALL__']);
if (url) {
tf_upsertMainAnalystRowByUrl(url, pairsUpsert);
if (nm && nm !== '-')
tf_applyAnalystNameToSidebarByUrl(url, nm);
}
}
catch (e) { }
});
try {
saveRememberedAnalystLinks();
}
catch (e) { }
}
function saveRememberedAnalystLinks() {
try {
if (!hasChromeStorage())
return;
const globalRememberCheckbox = document.getElementById('remember-all-links-checkbox');
const enabled = globalRememberCheckbox ? !!globalRememberCheckbox.checked : true;
if (!enabled) {
try {
window.__tfRememberedLinksUiSnapshot = [];
}
catch (e) { }
chrome.storage.local.set({ [TF_REMEMBER_LINKS_ENABLED_KEY]: false }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
chrome.storage.local.remove([TF_REMEMBERED_LINKS_KEY]);
}
catch (e) { }
});
return;
}
const containers = [
document.getElementById('analyst-links-container'),
document.getElementById('isignal-links-container')
].filter(Boolean);
const byUrl = new Map();
containers.forEach((container) => {
const rows = Array.from(container.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const url = input ? String(input.value || '').trim() : '';
if (!url)
return;
let nm = '';
try {
const nameBtn = row.querySelector('.analyst-paste-btn, .analyst-name-btn, .tf-analyst-name-pill');
if (nameBtn) {
try {
if (nameBtn.dataset && nameBtn.dataset.tfFullName)
nm = String(nameBtn.dataset.tfFullName || '').trim();
}
catch (e) { }
if (!nm) {
try {
nm = nameBtn.title ? String(nameBtn.title || '').trim() : '';
}
catch (e) { }
}
if (!nm) {
try {
nm = String(nameBtn.textContent || '').trim();
}
catch (e) { }
}
}
if (nm === 'Paste' || nm === 'Channel' || nm === 'Nama' || nm === '-')
nm = '';
if (tf_isPlaceholderAnalystName(nm))
nm = '';
}
catch (e) {
nm = '';
}
const sel = row.querySelector('.analyst-pair-select');
let pairs = [];
if (sel) {
const opts = Array.from(sel.options || []).filter((o) => o && o.selected);
pairs = opts.map((o) => String(o.value || '').trim()).filter(Boolean);
if (!pairs.length || pairs.includes(ALL_PAIR_OPTION_VALUE)) {
pairs = [];
}
else {
pairs = pairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE);
}
}
const key = tf_normUrlKey(url) || url;
const previous = byUrl.get(key) || null;
const candidate = { url, pairs };
if (nm) {
candidate.name = nm;
candidate.analystName = nm;
}
if (!previous) {
byUrl.set(key, candidate);
return;
}
const previousSpecific = Array.isArray(previous.pairs) && previous.pairs.length > 0;
const candidateSpecific = Array.isArray(candidate.pairs) && candidate.pairs.length > 0;
if (candidateSpecific || !previousSpecific) {
const merged = { ...previous, ...candidate, pairs: candidate.pairs };
if (!candidate.name && previous.name) {
merged.name = previous.name;
merged.analystName = previous.analystName || previous.name;
}
byUrl.set(key, merged);
}
else if (!previous.name && candidate.name) {
byUrl.set(key, { ...previous, name: candidate.name, analystName: candidate.analystName || candidate.name });
}
}
catch (e) { }
});
});
const items = Array.from(byUrl.values());
try {
window.__tfRememberedLinksUiSnapshot = items.map((it) => ({
...it,
pairs: Array.isArray(it && it.pairs) ? it.pairs.slice() : []
}));
}
catch (e) { }
chrome.storage.local.get([TF_REMEMBER_LINKS_ENABLED_KEY, TF_REMEMBERED_LINKS_KEY], (stored) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sameEnabled = stored && stored[TF_REMEMBER_LINKS_ENABLED_KEY] === true;
const previousItems = Array.isArray(stored && stored[TF_REMEMBERED_LINKS_KEY]) ? stored[TF_REMEMBERED_LINKS_KEY] : [];
if (sameEnabled && tf_stableJson(previousItems) === tf_stableJson(items))
return;
chrome.storage.local.set({
[TF_REMEMBER_LINKS_ENABLED_KEY]: true,
[TF_REMEMBERED_LINKS_KEY]: items
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
});
}
catch (e) { }
}
function tf_collectChannelsFromContainer(containerEl) {
const channels = [];
if (!containerEl)
return channels;
const rows = Array.from(containerEl.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
if (row && row.dataset && row.dataset.tfLocked === '1')
return;
}
catch (e) { }
const input = row.querySelector('.analyst-link-input');
const select = row.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl) {
return;
}
try {
if (input)
input.value = normUrl;
}
catch (e) { }
const pairs = getSelectedPairsFromSelect(select);
channels.push({ url: normUrl, pairs });
});
return channels;
}
function tf_upsertMainAnalystRowByUrl(rawUrl, pairs, options) {
try {
const container = document.getElementById('analyst-links-container');
if (!container)
return false;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl)
return false;
const key = tf_normUrlKey(normUrl);
if (!key)
return false;
const rows = Array.from(container.querySelectorAll('.analyst-row'));
let targetRow = null;
const dupRows = [];
rows.forEach((r) => {
try {
const inp = r ? r.querySelector('.analyst-link-input') : null;
const v = inp && inp.value ? String(inp.value).trim() : '';
const k = tf_normUrlKey(v);
if (k && k === key) {
if (!targetRow)
targetRow = r;
else
dupRows.push(r);
}
}
catch (e) { }
});
dupRows.forEach((r) => {
try {
r.remove();
}
catch (e) { }
});
let pendingRow = null;
try {
const pendingToken = options && options.pendingRowToken ? String(options.pendingRowToken) : '';
const pendingSession = options && options.uiSessionId ? String(options.uiSessionId) : '';
pendingRow = tf_findPendingAddAnalystRow(pendingToken, pendingSession);
if (!targetRow && pendingRow)
targetRow = pendingRow;
}
catch (e) {
pendingRow = null;
}
const normalizedPairs = (() => {
try {
const arr = Array.isArray(pairs) ? pairs.map((p) => String(p || '').trim()).filter(Boolean) : [];
if (!arr.length)
return [ALL_PAIR_OPTION_VALUE];
if (arr.includes(ALL_PAIR_OPTION_VALUE) || arr.includes('__ALL__'))
return [ALL_PAIR_OPTION_VALUE];
return arr.filter((p) => p !== '__ALL__' && p !== ALL_PAIR_OPTION_VALUE);
}
catch (e) {
return [ALL_PAIR_OPTION_VALUE];
}
})();
const applyPairsToRow = (row) => {
try {
const inp = row.querySelector('.analyst-link-input');
if (inp) {
inp.value = normUrl;
}
const sel = row.querySelector('.analyst-pair-select');
if (sel) {
tf_applyPairsArrayToSelect(sel, normalizedPairs);
}
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
try {
tf_clearPendingAddAnalystRowMarkers(row);
}
catch (e) { }
}
catch (e) { }
};
if (targetRow) {
applyPairsToRow(targetRow);
try {
if (pendingRow && pendingRow !== targetRow)
pendingRow.remove();
}
catch (e) { }
}
else {
const clone = tf_cloneBaseAnalystRowTemplate(false) || (container.querySelector('.analyst-row') ? container.querySelector('.analyst-row').cloneNode(true) : null);
if (!clone)
return false;
try {
tf_forcePasteButtonInRow(clone);
}
catch (e) { }
try {
if (clone.dataset)
clone.dataset.tfLocked = '0';
}
catch (e) { }
try {
clone.classList.remove('tf-row-locked');
}
catch (e) { }
try {
const inp = clone.querySelector('.analyst-link-input');
if (inp) {
inp.value = normUrl;
inp.disabled = false;
try {
inp.readOnly = false;
}
catch (e) { }
try {
inp.removeAttribute('readonly');
}
catch (e) { }
}
}
catch (e) { }
try {
const sel = clone.querySelector('.analyst-pair-select');
if (sel) {
sel.disabled = false;
tf_applyPairsArrayToSelect(sel, normalizedPairs);
try {
initAnalystPairSelect(sel);
}
catch (e) { }
}
}
catch (e) { }
try {
const widget = clone.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
}
catch (e) { }
try {
initPairMultiSelectForRow(clone);
}
catch (e) { }
const rememberRow = container.querySelector('.remember-links-row');
if (rememberRow && rememberRow.parentNode === container)
container.insertBefore(clone, rememberRow);
else
container.appendChild(clone);
}
try {
saveRememberedAnalystLinks();
}
catch (e) { }
try {
tf_reloadAnalystNamesInSidebarUI();
}
catch (e) { }
return true;
}
catch (e) {
return false;
}
}
function hasChromeStorage() {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
function openOrReloadDashboard(opts) {
const activate = (opts && typeof opts.activate === 'boolean') ? opts.activate : true;
return new Promise((resolve) => {
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({ type: 'open_or_reload_dashboard', activate }, (res) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (res && res.ok)
return resolve(true);
try {
const url = chrome.runtime.getURL('dashboard.html');
chrome.tabs.create({ url, active: activate }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(false);
});
}
catch (e) {
resolve(false);
}
});
return;
}
}
catch (e) { }
resolve(false);
});
}
function reloadTabThen(tabId, cb) {
if (!tabId || typeof chrome === 'undefined' || !chrome.tabs) {
try {
cb && cb(false, 'chrome.tabs tidak tersedia');
}
catch (e) { }
return;
}
let finished = false;
const done = (ok, err) => {
if (finished)
return;
finished = true;
try {
chrome.tabs.onUpdated.removeListener(onUpdated);
}
catch (e) { }
try {
clearTimeout(timer);
}
catch (e) { }
try {
cb && cb(!!ok, err || null);
}
catch (e) { }
};
const onUpdated = (id, info) => {
if (id !== tabId)
return;
if (info && info.status === 'complete') {
done(true, null);
}
};
const timer = setTimeout(() => {
done(false, 'reload timeout');
}, 15000);
try {
chrome.tabs.onUpdated.addListener(onUpdated);
}
catch (e) {
}
try {
chrome.tabs.reload(tabId, { bypassCache: true }, () => {
if (chrome.runtime.lastError) {
done(false, chrome.runtime.lastError.message);
}
});
}
catch (e) {
done(false, String(e));
}
}
const __scanChannelUI = {
sessions: {}
};
const __historyBatchUI = {
rows: {},
state: {},
detailOrder: []
};
function scui_ensureProgressScaffold(outerId, overallId, detailId) {
try {
const outer = document.getElementById(outerId);
if (!outer)
return { overallEl: null, detailEl: null };
let overallEl = document.getElementById(overallId);
let detailEl = document.getElementById(detailId);
if (overallEl && detailEl)
return { overallEl, detailEl };
const legacyRows = Array.from(outer.children || []).filter((node) => {
try {
return node && node.classList && node.classList.contains('scan-channel-status-item');
}
catch (e) {
return false;
}
});
outer.innerHTML = '';
const overallTable = document.createElement('div');
overallTable.className = 'scan-progress-table';
const overallTitle = document.createElement('div');
overallTitle.className = 'scan-progress-table-title';
overallTitle.textContent = 'Overall';
overallEl = document.createElement('div');
overallEl.id = overallId;
overallEl.className = 'scan-progress-table-list';
overallTable.appendChild(overallTitle);
overallTable.appendChild(overallEl);
const batchTable = document.createElement('div');
batchTable.className = 'scan-progress-table';
const batchTitle = document.createElement('div');
batchTitle.className = 'scan-progress-table-title';
batchTitle.textContent = 'Batch';
detailEl = document.createElement('div');
detailEl.id = detailId;
detailEl.className = 'scan-progress-table-list batch';
batchTable.appendChild(batchTitle);
batchTable.appendChild(detailEl);
outer.appendChild(overallTable);
outer.appendChild(batchTable);
legacyRows.forEach((row) => {
try {
detailEl.appendChild(row);
}
catch (e) { }
});
return { overallEl, detailEl };
}
catch (e) {
return { overallEl: null, detailEl: null };
}
}
function scui_getListEls() {
const out = [];
try {
const main = scui_ensureProgressScaffold(
'scan-channel-status-list',
'scan-progress-overall',
'scan-progress-detail'
);
if (main.overallEl || main.detailEl)
out.push(main);
}
catch (e) { }
try {
const isignal = scui_ensureProgressScaffold(
'scan-channel-status-list-isignal',
'scan-progress-overall-isignal',
'scan-progress-detail-isignal'
);
if (isignal.overallEl || isignal.detailEl)
out.push(isignal);
}
catch (e) { }
return out;
}
function scui__makeSessionId() {
try {
return 'scui_' + Date.now() + '_' + Math.floor(Math.random() * 1e9);
}
catch (e) {
return String(Date.now());
}
}
function scui_shouldStickToBottom(listEl) {
try {
if (!listEl)
return false;
const distance = listEl.scrollHeight - listEl.clientHeight - listEl.scrollTop;
return distance <= 24;
}
catch (e) {
return false;
}
}
function scui_scrollToBottomIfNeeded(listEl, shouldStick) {
if (!shouldStick || !listEl)
return;
try {
requestAnimationFrame(() => {
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
});
}
catch (e) { }
}
function scui_createSession(opts) {
const pairLabel = (opts && opts.pairLabel) ? String(opts.pairLabel) : '';
const sessionId = scui__makeSessionId();
const containers = scui_getListEls();
const targets = [];
const makeName = (analystName, pairNow) => {
const a = analystName ? (String(analystName) + ' - ') : '';
const p = pairNow ? ('Pair: ' + String(pairNow)) : (pairLabel ? ('Pair: ' + pairLabel) : '');
return a + 'Scan Channel ini' + (p ? (' - ' + p) : '');
};
containers.forEach((c) => {
const listEl = (c && c.overallEl) ? c.overallEl : ((c && c.detailEl) ? c.detailEl : null);
if (!listEl)
return;
const shouldStick = scui_shouldStickToBottom(listEl);
const row = document.createElement('div');
row.className = 'scan-channel-status-item';
const nameEl = document.createElement('span');
nameEl.className = 'scan-channel-status-name';
nameEl.textContent = makeName('', '');
const stateEl = document.createElement('span');
stateEl.className = 'scan-channel-status-state';
stateEl.textContent = 'Progress...';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
targets.push({ listEl, rowEl: row, nameEl, stateEl });
scui_scrollToBottomIfNeeded(listEl, shouldStick);
});
__scanChannelUI.sessions[sessionId] = {
sessionId,
pairLabel,
analystName: '',
pair: '',
total: 0,
current: 0,
stateText: 'Progress...',
targets
};
return sessionId;
}
function scui_update(sessionId, patch) {
const s = __scanChannelUI.sessions[sessionId];
if (!s)
return;
try {
if (patch && typeof patch.analystName === 'string')
s.analystName = patch.analystName;
if (patch && typeof patch.pair === 'string')
s.pair = patch.pair;
if (patch && typeof patch.total === 'number')
s.total = patch.total;
if (patch && typeof patch.current === 'number')
s.current = patch.current;
if (patch && typeof patch.stateText === 'string')
s.stateText = patch.stateText;
}
catch (e) { }
const analystName = s.analystName || '';
const pairNow = s.pair || '';
const total = (typeof s.total === 'number') ? s.total : 0;
const current = (typeof s.current === 'number') ? s.current : 0;
const a = analystName ? (analystName + ' - ') : '';
const p = pairNow ? ('Pair: ' + pairNow) : (s.pairLabel ? ('Pair: ' + s.pairLabel) : '');
const nameText = a + 'Scan Channel ini' + (p ? (' - ' + p) : '');
let stateText = s.stateText || 'Progress...';
if (!patch || typeof patch.stateText !== 'string') {
if (total > 0)
stateText = 'Progress... (' + current + '/' + total + ')';
}
else {
if (total > 0)
stateText = stateText + ' (' + current + '/' + total + ')';
}
const targets = (Array.isArray(s.targets) && s.targets.length) ? s.targets : [];
targets.forEach((t) => {
try {
if (t.nameEl)
t.nameEl.textContent = nameText;
}
catch (e) { }
try {
if (t.stateEl)
t.stateEl.textContent = stateText;
}
catch (e) { }
// Baris tetap pada posisi awal. Jangan memindahkan DOM atau memaksa
// scroll setiap progress berubah karena itu menyebabkan scrollbar berkedip.
});
}
function hbui_getListEls() {
return scui_getListEls();
}
function hbui_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (typeof batchIndex === 'number') ? String(batchIndex) : String(batchIndex || '');
return a + '||' + p + '||' + b;
}
function hbui_upsert(patch) {
const analystName = (patch && patch.analystName) ? String(patch.analystName) : '';
const pair = (patch && patch.pair) ? String(patch.pair) : '';
const batchIndex = (() => { try {
if (!patch || patch.batchIndex == null)
return null;
const v = parseInt(patch.batchIndex, 10);
return (Number.isFinite(v) ? v : null);
}
catch (e) {
return null;
} })();
const stateText = (patch && patch.stateText) ? String(patch.stateText) : 'Progress...';
const key = hbui_makeKey(analystName, pair, (batchIndex != null ? batchIndex : ''));
try {
__historyBatchUI.state[key] = { analystName, pair, batchIndex: (batchIndex != null ? batchIndex : ''), stateText, ts: Date.now() };
if (batchIndex != null && batchIndex !== 0) {
__historyBatchUI.detailOrder.push(key);
while (__historyBatchUI.detailOrder.length > 2000) {
__historyBatchUI.detailOrder.shift();
}
}
}
catch (e) { }
const containers = hbui_getListEls();
if (!containers || !containers.length)
return;
try {
const existingEntry = __historyBatchUI.rows[key];
if (existingEntry && Array.isArray(existingEntry.targets)) {
const expectedLists = containers.map((container) => {
return batchIndex === 0
? (container && container.overallEl ? container.overallEl : null)
: (container && container.detailEl ? container.detailEl : null);
}).filter(Boolean);
const hasCompleteTargets = expectedLists.every((expectedList) => {
return existingEntry.targets.some((target) => {
try {
return !!(
target &&
target.listEl === expectedList &&
target.rowEl &&
target.rowEl.isConnected
);
}
catch (e) {
return false;
}
});
});
if (!hasCompleteTargets) {
existingEntry.targets.forEach((target) => {
try {
if (target && target.rowEl && target.rowEl.parentNode)
target.rowEl.parentNode.removeChild(target.rowEl);
}
catch (e) { }
});
delete __historyBatchUI.rows[key];
}
}
}
catch (e) { }
if (!__historyBatchUI.rows[key]) {
const targets = [];
containers.forEach((c) => {
const listEl = (batchIndex === 0)
? (c && c.overallEl ? c.overallEl : null)
: (c && c.detailEl ? c.detailEl : null);
if (!listEl)
return;
const shouldStick = scui_shouldStickToBottom(listEl);
const row = document.createElement('div');
row.className = 'scan-channel-status-item';
const nameEl = document.createElement('span');
nameEl.className = 'scan-channel-status-name';
const b = (batchIndex === 0)
? 'Overall'
: ((batchIndex != null && !Number.isNaN(batchIndex)) ? ('Batch ' + batchIndex) : 'Batch');
const a = analystName || 'Analis';
const p = pair || 'PAIR';
nameEl.textContent = b + ', ' + p + ', ' + a;
const stateEl = document.createElement('span');
stateEl.className = 'scan-channel-status-state';
stateEl.textContent = stateText || 'Progress...';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
targets.push({ listEl, rowEl: row, nameEl, stateEl, kind: (batchIndex === 0 ? 'overall' : 'detail') });
scui_scrollToBottomIfNeeded(listEl, shouldStick);
});
__historyBatchUI.rows[key] = { targets };
}
const entry = __historyBatchUI.rows[key];
(entry.targets || []).forEach((t) => {
if (!t)
return;
try {
if (t.stateEl)
t.stateEl.textContent = stateText || 'Progress...';
}
catch (e) { }
// Update teks saja. Posisi baris dan posisi scroll pengguna dipertahankan.
});
}
function hbui_clearAll() {
try {
__historyBatchUI.rows = {};
}
catch (e) { }
try {
__historyBatchUI.state = {};
}
catch (e) { }
try {
__historyBatchUI.detailOrder = [];
}
catch (e) { }
}
function hbui_clearRowsDom() {
try {
Object.keys(__historyBatchUI.rows || {}).forEach((key) => {
const entry = __historyBatchUI.rows[key];
(entry && Array.isArray(entry.targets) ? entry.targets : []).forEach((target) => {
try {
if (target && target.rowEl && target.rowEl.parentNode)
target.rowEl.parentNode.removeChild(target.rowEl);
}
catch (e) { }
});
});
}
catch (e) { }
hbui_clearAll();
}
function hbui_restoreFromProgressMap(mapObj) {
try {
if (!mapObj || typeof mapObj !== 'object')
return 0;
const entries = Object.keys(mapObj).map((key) => mapObj[key]).filter((entry) => entry && typeof entry === 'object');
entries.sort((left, right) => {
const lts = Number(left && left.ts) || 0;
const rts = Number(right && right.ts) || 0;
if (lts !== rts)
return lts - rts;
const la = String((left && left.analystName) || '');
const ra = String((right && right.analystName) || '');
if (la !== ra)
return la.localeCompare(ra);
const lp = String((left && left.pair) || '');
const rp = String((right && right.pair) || '');
if (lp !== rp)
return lp.localeCompare(rp);
return (parseInt(left && left.batchIndex, 10) || 0) - (parseInt(right && right.batchIndex, 10) || 0);
});
entries.forEach((entry) => {
const parsedBatch = parseInt(entry.batchIndex, 10);
hbui_upsert({
analystName: entry.analystName || '',
pair: entry.pair || '',
batchIndex: Number.isFinite(parsedBatch) ? parsedBatch : null,
stateText: entry.stateText || 'Progress...'
});
});
return entries.length;
}
catch (e) {
return 0;
}
}
function hbui_restoreStoredProgress() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get(['tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
hbui_restoreFromProgressMap(data && data.tfHistoryBatchProgressMap);
}
catch (e) { }
});
}
catch (e) { }
}
function scui_markError(sessionId, errText) {
const s = __scanChannelUI.sessions[sessionId];
if (!s)
return;
const text = (errText ? ('Error: ' + errText) : 'Error');
const targets = (Array.isArray(s.targets) && s.targets.length)
? s.targets
: [{ listEl: null, stateEl: s.stateEl }];
targets.forEach((t) => {
if (t.stateEl)
t.stateEl.textContent = text;
});
}
function scui_clearAll() {
try {
const containers = scui_getListEls();
containers.forEach((c) => {
try {
if (c && c.overallEl)
c.overallEl.innerHTML = '';
}
catch (e) { }
try {
if (c && c.detailEl)
c.detailEl.innerHTML = '';
}
catch (e) { }
});
}
catch (e) { }
try {
__scanChannelUI.sessions = {};
}
catch (e) { }
try {
tf_activeSingleScanUiSessionId = null;
}
catch (e) { }
}
const TF_LOGIN_STATE_STALE_MS = 12 * 60 * 60 * 1000;
let tf__currentView = null;
let tf__candidateView = null;
let tf__candidateSince = 0;
let tf__applyTimer = null;
let __tfProgressUiMutedUntil = 0;
function tf_clearProgressUiAndStorage() {
try {
__tfProgressUiMutedUntil = Date.now() + 650;
}
catch (e) { }
try {
hbui_clearAll();
}
catch (e) { }
try {
scui_clearAll();
}
catch (e) { }
try {
if (hasChromeStorage()) {
chrome.storage.local.remove([
  'tfHistoryBatchProgressMap',
  'tfHistoryBatchProgressLog',
  'tfHistoryBatchProgressUpdatedAt'
], () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
}
function tf__applyView(view) {
if (!view)
return;
if (tf__currentView === view)
return;
tf__currentView = view;
if (view === 'login')
return showLoginView();
if (view === 'main')
return showMainView();
return showMasukView();
}
function tf__setCandidateView(view) {
const now = Date.now();
if (tf__candidateView !== view) {
tf__candidateView = view;
tf__candidateSince = now;
}
const stableMs = now - (tf__candidateSince || 0);
if (stableMs >= 650) {
try {
if (tf__applyTimer) {
clearTimeout(tf__applyTimer);
tf__applyTimer = null;
}
}
catch (e) { }
tf__applyView(view);
return;
}
try {
if (tf__applyTimer)
return;
tf__applyTimer = setTimeout(() => {
tf__applyTimer = null;
try {
if (tf__candidateView)
tf__applyView(tf__candidateView);
}
catch (e) { }
}, 700);
}
catch (e) {
tf__applyView(view);
}
}
function ensureTradersFamilyHomeTab(onDone) {
let completed = false;
let accountProbeStarted = false;
const finish = () => {
if (completed)
return;
completed = true;
try { onDone && onDone(); } catch (e) { }
};
const finishAfterAccountProbe = () => {
if (accountProbeStarted)
return;
accountProbeStarted = true;
try {
if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
finish();
return;
}
let settled = false;
const done = () => {
if (settled) return;
settled = true;
finish();
};
chrome.runtime.sendMessage({ type: 'ensure_tf_profile', force: true }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
done();
});
setTimeout(done, 15000);
}
catch (e) {
finish();
}
};
try {
const url = 'https://tradersfamily.id/?tfext=1&ts=' + Date.now();
try {
chrome.storage.local.set({
tfRootLoginState: 'unknown',
tfRootLoginStateAt: Date.now()
}, () => { });
}
catch (e) { }
function fallbackOpen() {
try {
if (chrome && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: false }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
}
catch (e) { }
setTimeout(finishAfterAccountProbe, 2200);
}
if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
fallbackOpen();
return;
}
chrome.runtime.sendMessage({ type: 'ensure_tf_root' }, (res) => {
let hadPortError = false;
try { hadPortError = !!(chrome.runtime && chrome.runtime.lastError); } catch (e) { hadPortError = true; }
if (hadPortError || !res || res.ok === false) {
try {
chrome.storage.local.set({
tfRootLoginState: 'unknown',
tfRootLoginStateAt: Date.now()
}, () => { });
}
catch (e) { }
fallbackOpen();
return;
}
try {
const rootState = res && res.state ? String(res.state) : 'unknown';
if (rootState) {
chrome.storage.local.set({
tfRootLoginState: rootState,
tfRootLoginStateAt: Date.now()
}, () => { });
}
// REV215: public-root checks may be temporarily inconclusive. Logged-in is positive,
// logged-out is accepted only after background verification, and unknown must preserve
// the previous authenticated UI while account/profile probing gets another chance.
if (rootState === 'logged_in') {
finishAfterAccountProbe();
return;
}
if (rootState === 'logged_out') {
try {
chrome.storage.local.set({
tfLoginConfirmed: false,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true
}, () => { });
}
catch (e) { }
finish();
return;
}
// unknown/candidate: do not force Login; try profile/account sync and preserve current UI.
try { chrome.storage.local.set({ tfForceLoginForm: false }, () => { }); } catch (e) { }
finishAfterAccountProbe();
}
catch (e) { }
});
}
catch (e) {
finishAfterAccountProbe();
}
}
const ALL_PAIR_OPTION_VALUE = '__ALL__';
let tf__baseAnalystRowTemplateNode = null;
let tf__baseIsignalAnalystRowTemplateNode = null;
function tf_captureBaseAnalystRowTemplates() {
try {
const mainC = document.getElementById('analyst-links-container');
const isC = document.getElementById('isignal-links-container');
if (!tf__baseAnalystRowTemplateNode && mainC) {
const r = mainC.querySelector('.analyst-row');
if (r)
tf__baseAnalystRowTemplateNode = r.cloneNode(true);
}
if (!tf__baseIsignalAnalystRowTemplateNode && isC) {
const r2 = isC.querySelector('.analyst-row');
if (r2)
tf__baseIsignalAnalystRowTemplateNode = r2.cloneNode(true);
}
}
catch (e) { }
}
function tf_cloneBaseAnalystRowTemplate(preferIsignal) {
try {
const base = preferIsignal
? (tf__baseIsignalAnalystRowTemplateNode || tf__baseAnalystRowTemplateNode)
: (tf__baseAnalystRowTemplateNode || tf__baseIsignalAnalystRowTemplateNode);
return base ? base.cloneNode(true) : null;
}
catch (e) {
return null;
}
}
function tf_forcePasteButtonInRow(row) {
try {
if (!row)
return;
let btn = row.querySelector('.analyst-paste-btn');
if (btn) {
btn.textContent = 'Paste';
btn.disabled = false;
btn.classList.remove('tf-analyst-name-pill');
btn.classList.remove('secondary');
return;
}
btn = row.querySelector('button.tf-analyst-name-pill') || row.querySelector('button.analyst-name-btn');
if (!btn)
return;
btn.classList.remove('tf-analyst-name-pill');
btn.classList.remove('analyst-name-btn');
btn.classList.remove('secondary');
btn.classList.add('analyst-paste-btn');
btn.textContent = 'Paste';
btn.disabled = false;
}
catch (e) { }
}
const allPairs = [
'XAUUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD',
'USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'NZDJPY', 'CADJPY', 'CHFJPY',
'USDCAD', 'USDCHF'
];
function getSelectedPairsFromSelect(selectEl) {
try {
if (!selectEl)
return [ALL_PAIR_OPTION_VALUE];
const opts = Array.from(selectEl.options || []);
const selected = opts.filter((o) => !!o.selected).map((o) => String(o.value));
const useAll = !selected.length || selected.includes(ALL_PAIR_OPTION_VALUE);
if (useAll)
return [ALL_PAIR_OPTION_VALUE];
const clean = selected.filter((v) => v && v !== ALL_PAIR_OPTION_VALUE);
return clean.length ? clean : [ALL_PAIR_OPTION_VALUE];
}
catch (e) {
return [ALL_PAIR_OPTION_VALUE];
}
}
function initAnalystPairSelect(selectEl) {
try {
if (!selectEl)
return;
if (selectEl.dataset && selectEl.dataset.inited === '1')
return;
if (selectEl.dataset)
selectEl.dataset.inited = '1';
const enforce = () => {
const opts = Array.from(selectEl.options || []);
const selected = opts.filter((o) => o.selected).map((o) => String(o.value));
const hasAll = selected.includes(ALL_PAIR_OPTION_VALUE);
const others = selected.filter((v) => v && v !== ALL_PAIR_OPTION_VALUE);
if (hasAll) {
opts.forEach((o) => { o.selected = (String(o.value) === ALL_PAIR_OPTION_VALUE); });
return;
}
if (others.length) {
opts.forEach((o) => {
if (String(o.value) === ALL_PAIR_OPTION_VALUE)
o.selected = false;
});
return;
}
const allOpt = opts.find((o) => String(o.value) === ALL_PAIR_OPTION_VALUE);
if (allOpt) {
opts.forEach((o) => { o.selected = false; });
allOpt.selected = true;
}
};
try {
enforce();
}
catch (e) { }
selectEl.addEventListener('change', () => {
try {
enforce();
}
catch (e) { }
});
}
catch (e) {
}
}
function initPairMultiSelectForRow(rowEl) {
try {
if (!rowEl)
return;
const widget = rowEl.querySelector('.pair-multiselect');
const selectEl = rowEl.querySelector('.analyst-pair-select');
if (!widget || !selectEl)
return;
if (widget.dataset && widget.dataset.inited === '1') {
try {
if (typeof widget.__tf_syncFromSelect === 'function')
widget.__tf_syncFromSelect();
widget.classList.remove('open');
}
catch (e) { }
return;
}
if (widget.dataset)
widget.dataset.inited = '1';
const display = widget.querySelector('.pair-multiselect-display');
const labelEl = widget.querySelector('.pair-multiselect-label');
const checkboxes = Array.from(widget.querySelectorAll('input[type="checkbox"][data-value]'));
const updateLabel = () => {
if (!labelEl)
return;
const sel = getSelectedPairsFromSelect(selectEl);
const useAll = !sel || !sel.length || sel.includes(ALL_PAIR_OPTION_VALUE);
if (useAll) {
labelEl.textContent = 'ALL';
return;
}
if (sel.length === 1) {
labelEl.textContent = sel[0];
}
else {
labelEl.textContent = `${sel.length} Pairs`;
}
};
const syncCheckboxesFromSelect = () => {
const opts = Array.from(selectEl.options || []);
checkboxes.forEach((cb) => {
const v = cb.dataset.value;
const opt = opts.find((o) => String(o.value) === String(v));
cb.checked = !!(opt && opt.selected);
});
const any = checkboxes.some((c) => c.checked);
if (!any) {
const allCb = checkboxes.find((c) => c.dataset.value === ALL_PAIR_OPTION_VALUE);
if (allCb)
allCb.checked = true;
try {
const opts2 = Array.from(selectEl.options || []);
opts2.forEach((o) => { o.selected = (String(o.value) === ALL_PAIR_OPTION_VALUE); });
}
catch (e) { }
}
updateLabel();
};
const enforceRulesUpdateSelect = (changedCb) => {
const allCb = checkboxes.find((c) => c.dataset.value === ALL_PAIR_OPTION_VALUE);
const otherCbs = checkboxes.filter((c) => c.dataset.value !== ALL_PAIR_OPTION_VALUE);
const isAllChanged = !!(changedCb && allCb && changedCb === allCb);
if (allCb) {
if (isAllChanged) {
if (allCb.checked) {
otherCbs.forEach((c) => { c.checked = false; });
}
else {
const anyOther = otherCbs.some((c) => c.checked);
if (!anyOther)
allCb.checked = true;
}
}
else {
const anyOther = otherCbs.some((c) => c.checked);
if (anyOther) {
allCb.checked = false;
}
else {
allCb.checked = true;
}
}
}
if (allCb && allCb.checked) {
otherCbs.forEach((c) => { c.checked = false; });
}
const opts = Array.from(selectEl.options || []);
opts.forEach((o) => { o.selected = false; });
const useAll = !!(allCb && allCb.checked);
if (useAll) {
const allOpt = opts.find((o) => String(o.value) === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
else {
const chosen = otherCbs.filter((c) => c.checked).map((c) => c.dataset.value);
chosen.forEach((v) => {
const opt = opts.find((o) => String(o.value) === String(v));
if (opt)
opt.selected = true;
});
if (!opts.some((o) => o.selected)) {
const allOpt = opts.find((o) => String(o.value) === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
}
updateLabel();
try {
saveRememberedAnalystLinks();
}
catch (e) { }
};
if (display) {
display.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
try {
const openWidgets = document.querySelectorAll('.pair-multiselect.open');
openWidgets.forEach((w) => {
if (w !== widget)
w.classList.remove('open');
});
}
catch (e) { }
widget.classList.toggle('open');
});
}
checkboxes.forEach((cb) => {
cb.addEventListener('change', (ev) => {
try {
ev.stopPropagation();
}
catch (e) { }
try {
enforceRulesUpdateSelect(cb);
}
catch (e) { }
});
});
document.addEventListener('click', (ev) => {
try {
const t = ev && ev.target ? ev.target : null;
if (!t)
return;
if (!widget.contains(t))
widget.classList.remove('open');
}
catch (e) { }
});
widget.__tf_syncFromSelect = () => {
try {
syncCheckboxesFromSelect();
}
catch (e) { }
};
syncCheckboxesFromSelect();
}
catch (e) {
}
}
function tf_getPairLabelForScan(_selectEl, pairsArr) {
try {
const arr = Array.isArray(pairsArr) ? pairsArr.map(String) : [];
const useAll = !arr.length || arr.includes(ALL_PAIR_OPTION_VALUE);
if (useAll)
return 'ALL';
if (arr.length <= 2)
return arr.join(', ');
return arr.slice(0, 2).join(', ') + ' +' + (arr.length - 2);
}
catch (e) {
return 'ALL';
}
}
let __tf_allAnalystPairsCacheMain = [ALL_PAIR_OPTION_VALUE];
let __tf_allAnalystPairsCacheIsignal = [ALL_PAIR_OPTION_VALUE];
function tf_normalizePairsArrForAllAnalyst(arr) {
try {
if (!Array.isArray(arr) || !arr.length)
return [ALL_PAIR_OPTION_VALUE];
const clean = arr.map((x) => String(x || '').trim()).filter(Boolean);
if (!clean.length)
return [ALL_PAIR_OPTION_VALUE];
if (clean.includes(ALL_PAIR_OPTION_VALUE))
return [ALL_PAIR_OPTION_VALUE];
return clean.filter((x) => x !== ALL_PAIR_OPTION_VALUE);
}
catch (e) {
return [ALL_PAIR_OPTION_VALUE];
}
}
function tf_loadAllAnalystPairsMainFromStorage(cb) {
try {
if (!hasChromeStorage()) {
__tf_allAnalystPairsCacheMain = [ALL_PAIR_OPTION_VALUE];
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheMain);
return;
}
chrome.storage.local.get([TF_ALL_ANALYST_PAIRS_KEY_MAIN, TF_ALL_ANALYST_PAIRS_KEY_LEGACY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const rawMain = d ? d[TF_ALL_ANALYST_PAIRS_KEY_MAIN] : null;
const rawLegacy = d ? d[TF_ALL_ANALYST_PAIRS_KEY_LEGACY] : null;
const raw = (rawMain !== undefined && rawMain !== null) ? rawMain : rawLegacy;
__tf_allAnalystPairsCacheMain = tf_normalizePairsArrForAllAnalyst(raw);
if ((rawMain === undefined || rawMain === null) && rawLegacy !== undefined && rawLegacy !== null) {
try {
chrome.storage.local.set({ [TF_ALL_ANALYST_PAIRS_KEY_MAIN]: __tf_allAnalystPairsCacheMain }, () => { });
}
catch (e) { }
}
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheMain);
});
}
catch (e) {
__tf_allAnalystPairsCacheMain = [ALL_PAIR_OPTION_VALUE];
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheMain);
}
}
function tf_loadAllAnalystPairsIsignalFromStorage(cb) {
try {
if (!hasChromeStorage()) {
__tf_allAnalystPairsCacheIsignal = [ALL_PAIR_OPTION_VALUE];
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheIsignal);
return;
}
chrome.storage.local.get([TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const raw = d ? d[TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL] : null;
__tf_allAnalystPairsCacheIsignal = tf_normalizePairsArrForAllAnalyst(raw);
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheIsignal);
});
}
catch (e) {
__tf_allAnalystPairsCacheIsignal = [ALL_PAIR_OPTION_VALUE];
if (typeof cb === 'function')
cb(__tf_allAnalystPairsCacheIsignal);
}
}
function tf_getAllAnalystPairsCachedMain() {
return Array.isArray(__tf_allAnalystPairsCacheMain) && __tf_allAnalystPairsCacheMain.length
? __tf_allAnalystPairsCacheMain.slice()
: [ALL_PAIR_OPTION_VALUE];
}
function tf_getAllAnalystPairsCachedIsignal() {
return Array.isArray(__tf_allAnalystPairsCacheIsignal) && __tf_allAnalystPairsCacheIsignal.length
? __tf_allAnalystPairsCacheIsignal.slice()
: [ALL_PAIR_OPTION_VALUE];
}
function tf_getAllAnalystPairsCached() {
return tf_getAllAnalystPairsCachedMain();
}
function tf_applyPairsArrayToSelect(selectEl, pairsArr) {
if (!selectEl)
return;
const arr = tf_normalizePairsArrForAllAnalyst(pairsArr);
const options = Array.from(selectEl.options || []);
options.forEach((o) => { o.selected = false; });
const useAll = !arr || !arr.length || arr.includes(ALL_PAIR_OPTION_VALUE);
if (useAll) {
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
return;
}
arr.forEach((v) => {
const opt = options.find((o) => o.value === v);
if (opt)
opt.selected = true;
});
if (!options.some((o) => o.selected)) {
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
}
function tf_syncWidgetFromSelect(widgetEl) {
if (!widgetEl)
return;
try {
if (typeof widgetEl.__tf_syncFromSelect === 'function')
widgetEl.__tf_syncFromSelect();
}
catch (e) { }
}
function tf_applyGlobalPairsToContainer(containerEl, pairsArr) {
const arr = tf_normalizePairsArrForAllAnalyst(pairsArr);
if (!containerEl)
return;
const rows = Array.from(containerEl.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
const sel = row.querySelector('.analyst-pair-select');
if (!sel)
return;
tf_applyPairsArrayToSelect(sel, arr);
const widget = row.querySelector('.pair-multiselect');
tf_syncWidgetFromSelect(widget);
});
}
function tf_applyGlobalPairsToMainRows(pairsArr) {
try {
const container = document.getElementById('analyst-links-container');
tf_applyGlobalPairsToContainer(container, pairsArr);
}
catch (e) { }
try {
saveRememberedAnalystLinks();
}
catch (e) { }
}
function tf_applyGlobalPairsToIsignalRows(pairsArr) {
try {
const container = document.getElementById('isignal-links-container');
tf_applyGlobalPairsToContainer(container, pairsArr);
}
catch (e) { }
}
function tf_initAllAnalystPairsMultiSelectGroup(controls, groupName, loadFn, saveFn, applyFn) {
const closeAll = () => {
controls.forEach(({ widget }) => {
try {
if (widget)
widget.classList.remove('open');
}
catch (e) { }
});
};
const initOne = (select, widget) => {
if (!select || !widget)
return;
if (widget.dataset && widget.dataset.inited === '1')
return;
const display = widget.querySelector('.pair-multiselect-display');
const labelEl = widget.querySelector('.pair-multiselect-label');
const checkboxes = Array.from(widget.querySelectorAll('input[type="checkbox"][data-value]'));
const updateLabel = () => {
if (!labelEl)
return;
const selected = getSelectedPairsFromSelect(select);
const useAll = !selected || !selected.length || selected.includes(ALL_PAIR_OPTION_VALUE);
if (useAll || (selected && selected.length === allPairs.length)) {
labelEl.textContent = 'ALL';
return;
}
if (selected.length === 1)
labelEl.textContent = selected[0];
else
labelEl.textContent = `${selected.length} Pairs`;
};
const syncCheckboxes = () => {
const opts = Array.from(select.options || []);
checkboxes.forEach((cb) => {
const v = cb.dataset.value;
const opt = opts.find((o) => o.value === v);
cb.checked = !!(opt && opt.selected);
});
updateLabel();
};
const enforceRulesUpdateSelect = (changedCb) => {
const allCb = checkboxes.find((c) => c.dataset.value === ALL_PAIR_OPTION_VALUE);
const otherCbs = checkboxes.filter((c) => c.dataset.value !== ALL_PAIR_OPTION_VALUE);
const isAllChanged = !!(changedCb && allCb && changedCb === allCb);
if (allCb) {
if (isAllChanged) {
if (allCb.checked) {
otherCbs.forEach((c) => { c.checked = false; });
}
else {
const anyOther = otherCbs.some((c) => c.checked);
if (!anyOther)
allCb.checked = true;
}
}
else {
const anyOther = otherCbs.some((c) => c.checked);
if (anyOther)
allCb.checked = false;
else
allCb.checked = true;
}
}
if (allCb && allCb.checked) {
otherCbs.forEach((c) => { c.checked = false; });
}
const opts = Array.from(select.options || []);
opts.forEach((o) => { o.selected = false; });
const useAll = !!(allCb && allCb.checked);
if (useAll) {
const allOpt = opts.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
else {
const chosen = otherCbs.filter((c) => c.checked).map((c) => c.dataset.value);
chosen.forEach((v) => {
const opt = opts.find((o) => o.value === v);
if (opt)
opt.selected = true;
});
if (!opts.some((o) => o.selected)) {
const allOpt = opts.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
}
updateLabel();
try {
const arr = useAll ? [ALL_PAIR_OPTION_VALUE] : otherCbs.filter((c) => c.checked).map((c) => c.dataset.value);
saveFn(tf_normalizePairsArrForAllAnalyst(arr));
}
catch (e) { }
try {
applyFn(saveFn.__last || null);
}
catch (e) { }
try {
const cacheArr = (saveFn.__last && Array.isArray(saveFn.__last) && saveFn.__last.length) ? saveFn.__last : (useAll ? [ALL_PAIR_OPTION_VALUE] : []);
controls.forEach(({ select: s, widget: w }) => {
if (!s || !w)
return;
if (s === select)
return;
tf_applyPairsArrayToSelect(s, cacheArr);
tf_syncWidgetFromSelect(w);
});
}
catch (e) { }
};
if (display) {
display.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
const isOpen = widget.classList.contains('open');
closeAll();
if (!isOpen)
widget.classList.add('open');
});
}
checkboxes.forEach((cb) => {
cb.addEventListener('change', (ev) => {
try {
ev.stopPropagation();
}
catch (e) { }
try {
enforceRulesUpdateSelect(cb);
}
catch (e) { }
});
});
document.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
if (!t)
return;
if (widget.contains(t))
return;
try {
widget.classList.remove('open');
}
catch (e) { }
});
widget.__tf_syncFromSelect = () => {
try {
syncCheckboxes();
}
catch (e) { }
};
try {
syncCheckboxes();
}
catch (e) { }
if (widget.dataset)
widget.dataset.inited = '1';
};
controls.forEach((c) => initOne(c.select, c.widget));
loadFn((arr) => {
const normalized = tf_normalizePairsArrForAllAnalyst(arr);
saveFn(normalized);
controls.forEach(({ select, widget }) => {
if (!select || !widget)
return;
tf_applyPairsArrayToSelect(select, normalized);
tf_syncWidgetFromSelect(widget);
});
});
}
function tf_saveAllAnalystPairsMainToStorage(arr) {
try {
const normalized = tf_normalizePairsArrForAllAnalyst(arr);
tf_saveAllAnalystPairsMainToStorage.__last = normalized;
__tf_allAnalystPairsCacheMain = normalized;
if (hasChromeStorage()) {
chrome.storage.local.set({
[TF_ALL_ANALYST_PAIRS_KEY_MAIN]: normalized,
[TF_ALL_ANALYST_PAIRS_KEY_LEGACY]: normalized
}, () => { });
}
}
catch (e) { }
}
function tf_saveAllAnalystPairsIsignalToStorage(arr) {
try {
const normalized = tf_normalizePairsArrForAllAnalyst(arr);
tf_saveAllAnalystPairsIsignalToStorage.__last = normalized;
__tf_allAnalystPairsCacheIsignal = normalized;
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL]: normalized }, () => { });
}
}
catch (e) { }
}
function initAllAnalystPairsMultiSelect() {
const controlsMain = [
{ select: document.getElementById('tf-allpairs-select-main'), widget: document.getElementById('tf-allpairs-multiselect-main') },
{ select: document.getElementById('tf-allpairs-select-masuk'), widget: document.getElementById('tf-allpairs-multiselect-masuk') },
];
const controlsIsignal = [
{ select: document.getElementById('tf-allpairs-select-isignal'), widget: document.getElementById('tf-allpairs-multiselect-isignal') },
];
try {
tf_initAllAnalystPairsMultiSelectGroup(controlsMain, 'main', tf_loadAllAnalystPairsMainFromStorage, tf_saveAllAnalystPairsMainToStorage, (arr) => { tf_applyGlobalPairsToMainRows(arr || tf_getAllAnalystPairsCachedMain()); });
}
catch (e) { }
try {
tf_initAllAnalystPairsMultiSelectGroup(controlsIsignal, 'isignal', tf_loadAllAnalystPairsIsignalFromStorage, tf_saveAllAnalystPairsIsignalToStorage, (arr) => { tf_applyGlobalPairsToIsignalRows(arr || tf_getAllAnalystPairsCachedIsignal()); });
}
catch (e) { }
}
function tf_refreshAllAnalystPairsUIFromStorage() {
const controlsMain = [
{ select: document.getElementById('tf-allpairs-select-main'), widget: document.getElementById('tf-allpairs-multiselect-main') },
{ select: document.getElementById('tf-allpairs-select-masuk'), widget: document.getElementById('tf-allpairs-multiselect-masuk') },
];
const controlsIsignal = [
{ select: document.getElementById('tf-allpairs-select-isignal'), widget: document.getElementById('tf-allpairs-multiselect-isignal') },
];
tf_loadAllAnalystPairsMainFromStorage((arrMain) => {
const a = tf_normalizePairsArrForAllAnalyst(arrMain);
__tf_allAnalystPairsCacheMain = a;
controlsMain.forEach(({ select, widget }) => {
if (!select || !widget)
return;
tf_applyPairsArrayToSelect(select, a);
tf_syncWidgetFromSelect(widget);
});
});
tf_loadAllAnalystPairsIsignalFromStorage((arrIs) => {
const a = tf_normalizePairsArrForAllAnalyst(arrIs);
__tf_allAnalystPairsCacheIsignal = a;
controlsIsignal.forEach(({ select, widget }) => {
if (!select || !widget)
return;
tf_applyPairsArrayToSelect(select, a);
tf_syncWidgetFromSelect(widget);
});
});
}
function tf_syncAddModeScanPairLinkLabels() {
try {
const selectEl = document.getElementById('scan-pair-select');
if (!selectEl)
return;
const options = Array.from(selectEl.options || []);
const selectedValues = options.filter((o) => o.selected).map((o) => String(o.value));
const useAll = !selectedValues.length || selectedValues.includes(ALL_PAIR_OPTION_VALUE);
let labelText = 'ALL';
if (!useAll) {
if (selectedValues.length === 1) {
labelText = selectedValues[0];
}
else {
labelText = selectedValues.length + ' Pairs';
}
}
const finalText = (useAll ? 'ALL' : labelText) + ' ▾';
['main', 'masuk', 'isignal'].forEach((k) => {
const el = document.getElementById('tf-btn-scanpair-' + k);
if (el)
el.textContent = finalText;
});
}
catch (e) { }
}
function initScanPairMultiSelect() {
const selectEl = document.getElementById('scan-pair-select');
const widget = document.getElementById('scan-pair-multiselect');
if (!selectEl || !widget)
return;
if (widget.dataset && widget.dataset.inited === '1') {
try {
if (typeof widget.__tf_syncFromSelect === 'function')
widget.__tf_syncFromSelect();
widget.classList.remove('open');
}
catch (e) { }
return;
}
if (widget.dataset)
widget.dataset.inited = '1';
const display = widget.querySelector('.pair-multiselect-display');
const labelEl = widget.querySelector('.pair-multiselect-label');
const checkboxes = Array.from(widget.querySelectorAll('input[type="checkbox"][data-value]'));
function saveToStorage() {
if (!hasChromeStorage())
return;
try {
const opts = Array.from(selectEl.options || []);
const selected = opts.filter(o => o.selected).map(o => String(o.value));
const useAll = !selected.length || selected.includes(ALL_PAIR_OPTION_VALUE);
const arr = useAll ? [ALL_PAIR_OPTION_VALUE] : selected.filter(v => v && v !== ALL_PAIR_OPTION_VALUE);
const legacy = (arr.length === 1) ? arr[0] : ALL_PAIR_OPTION_VALUE;
chrome.storage.local.set({ tfScanChannelPairs: arr, tfScanChannelPair: legacy }, () => { });
}
catch (e) { }
}
function updateFromCheckboxes(changedCb) {
const allCb = checkboxes.find((cb) => cb.dataset.value === ALL_PAIR_OPTION_VALUE);
const otherCbs = checkboxes.filter((cb) => cb.dataset.value !== ALL_PAIR_OPTION_VALUE);
if (allCb) {
if (changedCb && changedCb === allCb) {
if (allCb.checked) {
otherCbs.forEach((cb) => { cb.checked = false; });
}
}
else {
const anyOtherChecked = otherCbs.some((cb) => cb.checked);
if (anyOtherChecked) {
allCb.checked = false;
}
else {
allCb.checked = true;
}
}
}
const options = Array.from(selectEl.options || []);
options.forEach((opt) => { opt.selected = false; });
const activeOthers = otherCbs.filter((cb) => cb.checked).map((cb) => cb.dataset.value);
let useAll = !!(allCb && allCb.checked && activeOthers.length === 0);
if (useAll) {
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
}
else {
activeOthers.forEach((val) => {
const opt = options.find((o) => o.value === val);
if (opt)
opt.selected = true;
});
}
if (!useAll && activeOthers.length === 0 && allCb) {
allCb.checked = true;
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
useAll = true;
}
let text = 'ALL';
if (!useAll && activeOthers.length) {
if (activeOthers.length <= 2) {
text = activeOthers.join(', ');
}
else {
text = activeOthers.slice(0, 2).join(', ') + ' +' + (activeOthers.length - 2);
}
}
if (labelEl)
labelEl.textContent = text;
try {
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
}
function updateFromSelect() {
const options = Array.from(selectEl.options || []);
const selectedValues = options.filter((o) => o.selected).map((o) => String(o.value));
const useAll = !selectedValues.length || selectedValues.includes(ALL_PAIR_OPTION_VALUE);
const allCb = checkboxes.find((cb) => cb.dataset.value === ALL_PAIR_OPTION_VALUE);
const otherCbs = checkboxes.filter((cb) => cb.dataset.value !== ALL_PAIR_OPTION_VALUE);
if (allCb)
allCb.checked = useAll;
otherCbs.forEach((cb) => {
cb.checked = !useAll && selectedValues.includes(cb.dataset.value);
});
if (!checkboxes.some((cb) => cb.checked) && allCb) {
allCb.checked = true;
}
updateFromCheckboxes();
}
try {
widget.__tf_syncFromSelect = updateFromSelect;
}
catch (e) { }
updateFromSelect();
checkboxes.forEach((cb) => {
cb.addEventListener('change', (event) => {
try {
event.stopPropagation();
}
catch (e) { }
updateFromCheckboxes(cb);
saveToStorage();
});
});
if (display) {
display.addEventListener('click', (event) => {
try {
event.stopPropagation();
}
catch (e) { }
if (widget.dataset && widget.dataset.tfImportBlocked === '1') {
widget.classList.remove('open');
return;
}
try {
const openWidgets = document.querySelectorAll('.pair-multiselect.open');
openWidgets.forEach((other) => {
if (other !== widget)
other.classList.remove('open');
});
}
catch (e) { }
widget.classList.toggle('open');
});
}
document.addEventListener('click', (event) => {
try {
if (!widget.contains(event.target))
widget.classList.remove('open');
}
catch (e) { }
});
}
let tf__stableSidebarEmail = '';
function tf_setProfileTextIfChanged(el, value) {
try {
if (!el)
return;
const next = String(value == null ? '' : value);
if (el.textContent !== next)
el.textContent = next;
}
catch (e) { }
}
function tf_setProfileImageIfChanged(el, value) {
try {
if (!el || !value)
return;
const next = String(value);
if (el.getAttribute('src') !== next)
el.setAttribute('src', next);
}
catch (e) { }
}
function applyProfileToPopup(profile) {
try {
const nameEl = document.getElementById('popup-user-name');
const emailEl = document.getElementById('popup-user-email');
const avatarEl = document.getElementById('popup-user-avatar');
const statusEl = document.getElementById('popup-user-status-text');
const masukNameEl = document.getElementById('masuk-user-name');
const masukEmailEl = document.getElementById('masuk-user-email');
const masukAvatarEl = document.getElementById('masuk-user-avatar');
const masukStatusEl = document.getElementById('masuk-user-status-text');
if (!profile)
return;
function applyDotState(containerId, statusText) {
try {
const container = document.getElementById(containerId);
if (!container)
return;
const dot = container.querySelector('.status-dot');
if (!dot)
return;
const raw = (statusText || '').toString().trim();
const low = raw.toLowerCase();
const isOffline = /offline|off\s*line|tidak\s*online|disconnected/i.test(low);
const isOnline = /online|connected/i.test(low) && !isOffline;
const nextState = isOffline ? 'offline' : ((!raw || !isOnline) ? 'unknown' : 'online');
if (dot.dataset.tfState === nextState)
return;
dot.dataset.tfState = nextState;
dot.classList.toggle('offline', nextState === 'offline');
dot.classList.toggle('unknown', nextState === 'unknown');
}
catch (e) { }
}
const incomingEmail = String(profile.email || '').trim().toLowerCase();
if (incomingEmail)
tf__stableSidebarEmail = incomingEmail;
const safeEmail = incomingEmail || tf__stableSidebarEmail || String((emailEl && emailEl.textContent) || (masukEmailEl && masukEmailEl.textContent) || '').trim().toLowerCase();
const rawName = String(profile.name || '').trim();
const genericName = /^(akun\s+tradersfamily|user\s+belum\s+login|user|profile|account|memuat\s+profil|thumbnail)$/i.test(rawName) || /\bchannel\s*(image|photo|avatar|logo)\b/i.test(rawName) || /\b(analyst|analis|signal)\s*image\b/i.test(rawName);
const safeName = (!genericName ? rawName : '') || (safeEmail ? safeEmail.split('@')[0] : '');
const profileOnline = /online|connected/i.test(String(profile.statusText || 'Online'));
const displayName = safeName || (profileOnline ? 'Memuat profil...' : 'User belum login');
tf_setProfileTextIfChanged(nameEl, displayName);
tf_setProfileTextIfChanged(masukNameEl, displayName);
if (safeEmail) {
tf_setProfileTextIfChanged(emailEl, safeEmail);
tf_setProfileTextIfChanged(masukEmailEl, safeEmail);
}
else if (profileOnline) {
tf_setProfileTextIfChanged(emailEl, 'Sinkronisasi email akun...');
tf_setProfileTextIfChanged(masukEmailEl, 'Sinkronisasi email akun...');
}
const avatarValue = String(profile.avatarUrl || '').trim();
const avatarIsDefault = /user-default|default[-_]?avatar|avatar[-_]?default|placeholder|no[-_]?avatar/i.test(avatarValue);
if (avatarValue && !avatarIsDefault) {
tf_setProfileImageIfChanged(avatarEl, avatarValue);
tf_setProfileImageIfChanged(masukAvatarEl, avatarValue);
}
const nextStatus = profile.statusText || 'Online';
tf_setProfileTextIfChanged(statusEl, nextStatus);
tf_setProfileTextIfChanged(masukStatusEl, nextStatus);
applyDotState('main-container', nextStatus);
applyDotState('masuk-container', nextStatus);
if (!safeEmail && hasChromeStorage()) {
try {
chrome.storage.local.get(['tfStableProfileEmail', 'tfRememberLogin'], (d) => {
try {
const stable = String(d && d.tfStableProfileEmail || '').trim().toLowerCase();
const r = d && d.tfRememberLogin ? d.tfRememberLogin : null;
const remembered = r && r.enabled ? String(r.email || '').trim().toLowerCase() : '';
const fallbackEmail = stable || remembered;
if (!fallbackEmail)
return;
tf__stableSidebarEmail = fallbackEmail;
tf_setProfileTextIfChanged(emailEl, fallbackEmail);
tf_setProfileTextIfChanged(masukEmailEl, fallbackEmail);
}
catch (e) { }
});
}
catch (e) { }
}
}
catch (e) {
console.warn('TF popup: gagal apply profile', e);
}
}
function showLoginView() {
try {
tf__currentView = 'login';
}
catch (e) { }
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
if (loginContainer)
loginContainer.style.display = 'block';
if (mainContainer)
mainContainer.style.display = 'none';
const masukContainer = document.getElementById('masuk-container');
if (masukContainer)
masukContainer.style.display = 'none';
const statusText = document.getElementById('popup-user-status-text');
if (statusText) {
statusText.textContent = 'Offline';
}
}
function showMainView() {
try {
tf__currentView = 'main';
}
catch (e) { }
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
if (loginContainer)
loginContainer.style.display = 'none';
if (mainContainer)
mainContainer.style.display = 'block';
const masukContainer = document.getElementById('masuk-container');
if (masukContainer)
masukContainer.style.display = 'none';
try {
if (!tf__openedChannelsThisPopup) {
tf__openedChannelsThisPopup = true;
tf_openOrFocusChannelsTab(true);
}
}
catch (e) { }
}
function showMasukView() {
try {
tf__currentView = 'masuk';
}
catch (e) { }
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');
const masukContainer = document.getElementById('masuk-container');
if (loginContainer)
loginContainer.style.display = 'none';
if (mainContainer)
mainContainer.style.display = 'none';
if (masukContainer)
masukContainer.style.display = 'block';
const statusText = document.getElementById('popup-user-status-text');
if (statusText) {
statusText.textContent = 'Online';
}
}
function loadPopupStateFromStorage() {
if (!hasChromeStorage()) {
showMainView();
return;
}
const loginEmail = document.getElementById('login-email');
const rememberCheckbox = document.getElementById('login-remember');
chrome.storage.local.get(['tfRootLoginState', 'tfRootLoginStateAt', 'tfAccountLoginState', 'tfAccountLoginStateAt', 'tfLoginConfirmed', 'tfLoginConfirmedAt', 'tfUserProfile', 'tfStableProfileEmail', 'tfEnteredMain', 'tfEnterMainAfterLogin', 'tfLoginError', 'tfForceLoginForm', 'tfRememberLogin', 'tfRememberedAnalystLinks', 'tfRememberLinksEnabled', 'tfHasImportedBundle', 'tfImportLockEngaged', 'tfImportLockedSigs', 'tfScanChannelPair', 'tfScanChannelPairs', 'tfShownMainOnceThisLogin', 'tfScanInProgress', 'tfScanOrigin', 'tfExplicitLogoutAt', 'tfPeriodicLogoutAt', 'tfMonthlyStats', 'tfHistorySignals', TF_ANALYST_SOURCES_KEY], (data) => {
const confirmed = !!(data && data.tfLoginConfirmed);
const enteredMain = !!(data && data.tfEnteredMain);
const enterMainAfterLogin = !!(data && data.tfEnterMainAfterLogin);
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const stableProfileEmail = String(data && data.tfStableProfileEmail || '').trim().toLowerCase();
if (stableProfileEmail)
tf__stableSidebarEmail = stableProfileEmail;
const rememberCfg = data && data.tfRememberLogin ? data.tfRememberLogin : null;
const loginError = data && data.tfLoginError ? data.tfLoginError : null;
let rememberedLinks = (data && Array.isArray(data.tfRememberedAnalystLinks))
? data.tfRememberedAnalystLinks
: [];
const rememberLinksEnabled = (data && typeof data.tfRememberLinksEnabled === 'boolean')
? !!data.tfRememberLinksEnabled
: true;
const hasImportedPayloadData = !!(data && ((Array.isArray(data.tfHistorySignals) && data.tfHistorySignals.length) || (data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object' && Object.keys(data.tfMonthlyStats).length)));
const hasImportedBundle = !!(data && data.tfHasImportedBundle) || hasImportedPayloadData;
if (hasImportedPayloadData && !(data && data.tfHasImportedBundle)) {
try { chrome.storage.local.set({ [TF_HAS_IMPORTED_BUNDLE_KEY]: true }, () => { try { void chrome.runtime.lastError; } catch (e) { } }); } catch (e) { }
}
const lockEngaged = !!(data && data[TF_IMPORT_LOCK_ENGAGED_KEY]);
try {
tf_setUpdateButtonsEnabled(hasImportedBundle, lockEngaged);
}
catch (e) { }
try {
tf_applyStopModeFromScanState(!!(data && data.tfScanInProgress), (data && data.tfScanOrigin) ? data.tfScanOrigin : null);
}
catch (e) { }
try {
const srcObj = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? data[TF_ANALYST_SOURCES_KEY]
: null;
if (hasImportedBundle && (!Array.isArray(rememberedLinks) || !rememberedLinks.length) && srcObj) {
try {
const rebuiltLinks = tf_buildRememberedLinksFromImportedSources(srcObj);
if (rebuiltLinks.length) {
rememberedLinks = rebuiltLinks;
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: rebuiltLinks, [TF_REMEMBER_LINKS_ENABLED_KEY]: true }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
}
catch (e) { }
}
const tfNameByUrl = {};
const tfNameByChannelId = {};
if (srcObj) {
Object.keys(srcObj).forEach((nm) => {
try {
const it = srcObj[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const nms = nm ? String(nm).trim() : '';
if (u && nms && !tf_isPlaceholderAnalystName(nms)) {
tfNameByUrl[u] = nms;
const mm = String(u).match(/\/channels\/(\d+)/);
if (mm && mm[1]) {
tfNameByChannelId[String(mm[1])] = nms;
}
}
}
catch (e) { }
});
}
const container = document.getElementById('analyst-links-container');
const globalRememberCheckbox = document.getElementById('remember-all-links-checkbox');
if (globalRememberCheckbox) {
globalRememberCheckbox.checked = rememberLinksEnabled;
}
if (container) {
const templateRow = container.querySelector('.analyst-row');
const rememberRow = container.querySelector('.remember-links-row');
if (templateRow) {
container.innerHTML = '';
if (rememberedLinks.length) {
rememberedLinks.forEach((item) => {
const row = templateRow.cloneNode(true);
const input = row.querySelector('.analyst-link-input');
if (input && item.url) {
input.value = item.url;
}
try {
const pasteBtn = row.querySelector('.analyst-paste-btn');
const urlNow = (item && item.url) ? String(item.url).trim() : (input && input.value ? String(input.value).trim() : '');
if (pasteBtn) {
const canShowName = !!hasImportedBundle;
if (urlNow && canShowName) {
const normUrl = tf_normalizeTfAccountUrl(urlNow);
let nm = '';
try {
const rawNm = (item && (item.name || item.analystName || item.analis || item.label))
? (item.name || item.analystName || item.analis || item.label)
: '';
nm = rawNm ? String(rawNm).trim() : '';
}
catch (e) { }
if (tf_isPlaceholderAnalystName(nm))
nm = '';
if (!nm && normUrl && tfNameByUrl[normUrl]) {
nm = String(tfNameByUrl[normUrl]).trim();
}
if (!nm && normUrl) {
const mm = String(normUrl).match(/\/channels\/(\d+)/);
const cid = (mm && mm[1]) ? String(mm[1]) : '';
if (cid) {
if (tfNameByChannelId && tfNameByChannelId[cid]) {
nm = String(tfNameByChannelId[cid] || '').trim();
}
if (!nm) {
try {
Object.keys(tfNameByUrl || {}).some((u2) => {
const m2 = String(u2 || '').match(/\/channels\/(\d+)/);
if (m2 && String(m2[1]) === cid) {
nm = String(tfNameByUrl[u2] || '').trim();
return !!nm;
}
return false;
});
}
catch (e) { }
}
if (!nm)
nm = `Channel ${cid}`;
}
}
if (nm && !tf_isPlaceholderAnalystName(nm)) {
tf_applyAnalystNameToPasteButton(pasteBtn, nm);
}
else {
try {
if (pasteBtn.dataset)
delete pasteBtn.dataset.tfFullName;
}
catch (e) { }
pasteBtn.textContent = 'Channel';
pasteBtn.disabled = false;
pasteBtn.title = 'Buka channel di tab baru';
pasteBtn.classList.remove('tf-analyst-name-pill');
}
if (!pasteBtn.classList.contains('analyst-paste-btn'))
pasteBtn.classList.add('analyst-paste-btn');
try {
if (input) {
input.disabled = false;
input.readOnly = true;
input.setAttribute('readonly', 'readonly');
}
const selLock = row.querySelector('.analyst-pair-select');
if (selLock)
selLock.disabled = false;
const widgetLock = row.querySelector('.pair-multiselect');
if (widgetLock) {
widgetLock.style.pointerEvents = '';
widgetLock.style.opacity = '';
}
const cbsLock = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbsLock.forEach((cb) => { cb.disabled = true; });
}
catch (e) { }
}
else {
pasteBtn.textContent = 'Paste';
pasteBtn.disabled = false;
pasteBtn.title = '';
try {
if (pasteBtn.dataset)
delete pasteBtn.dataset.tfFullName;
}
catch (e) { }
pasteBtn.classList.remove('tf-analyst-name-pill');
if (!pasteBtn.classList.contains('analyst-paste-btn'))
pasteBtn.classList.add('analyst-paste-btn');
try {
if (input) {
input.disabled = false;
input.readOnly = false;
try {
input.removeAttribute('readonly');
}
catch (e) { }
}
const selUnlock = row.querySelector('.analyst-pair-select');
if (selUnlock)
selUnlock.disabled = false;
const widgetUnlock = row.querySelector('.pair-multiselect');
if (widgetUnlock) {
widgetUnlock.style.pointerEvents = '';
widgetUnlock.style.opacity = '';
}
const cbsUnlock = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbsUnlock.forEach((cb) => { cb.disabled = false; });
}
catch (e) { }
}
}
}
catch (e) { }
const selectEl = row.querySelector('.analyst-pair-select');
if (selectEl) {
const options = Array.from(selectEl.options || []);
options.forEach((opt) => { opt.selected = false; });
const pairs = Array.isArray(item.pairs) ? item.pairs : [];
if (!pairs.length) {
const allOpt = options.find((o) => o.value === ALL_PAIR_OPTION_VALUE);
if (allOpt) {
allOpt.selected = true;
}
}
else {
options.forEach((opt) => {
if (pairs.includes(opt.value)) {
opt.selected = true;
}
});
}
}
container.appendChild(row);
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
initPairMultiSelectForRow(row);
});
}
else {
const row = templateRow.cloneNode(true);
container.appendChild(row);
const widget = row.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
}
initAnalystPairSelect(row.querySelector('.analyst-pair-select'));
initPairMultiSelectForRow(row);
}
if (rememberRow) {
container.appendChild(rememberRow);
}
}
}
}
catch (e) {
console.warn('Gagal restore Link Analis yang di-remember', e);
}
if (rememberCfg && rememberCheckbox) {
rememberCheckbox.checked = !!rememberCfg.enabled;
if (rememberCfg.enabled && loginEmail && rememberCfg.email) {
loginEmail.value = rememberCfg.email;
}
}
try {
const scanSel = document.getElementById('scan-pair-select');
if (scanSel) {
let storedArr = null;
if (data && Array.isArray(data.tfScanChannelPairs)) {
storedArr = data.tfScanChannelPairs.map(String);
}
else if (data && typeof data.tfScanChannelPair === 'string') {
const v = String(data.tfScanChannelPair || '__ALL__');
storedArr = [v];
}
if (!storedArr || !storedArr.length)
storedArr = ['__ALL__'];
const opts = Array.from(scanSel.options || []);
opts.forEach(o => { o.selected = false; });
const hasAll = storedArr.includes('__ALL__');
if (hasAll) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
else {
storedArr.forEach((val) => {
const opt = opts.find(o => o.value === val);
if (opt)
opt.selected = true;
});
if (!opts.some(o => o.selected)) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
}
try {
const widget = document.getElementById('scan-pair-multiselect');
if (widget && typeof widget.__tf_syncFromSelect === 'function') {
widget.__tf_syncFromSelect();
}
}
catch (e) { }
}
}
catch (e) { }
const rawRootState = (data && data.tfRootLoginState) ? String(data.tfRootLoginState) : 'unknown';
const rootAt = (data && data.tfRootLoginStateAt) ? Number(data.tfRootLoginStateAt) : 0;
const rootState = (rootAt && (Date.now() - rootAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawRootState;
const rootLoggedIn = rootState === 'logged_in';
const rootLoggedOut = rootState === 'logged_out';
const rawAccState = (data && data.tfAccountLoginState) ? String(data.tfAccountLoginState) : 'unknown';
const accAt = (data && data.tfAccountLoginStateAt) ? Number(data.tfAccountLoginStateAt) : 0;
const accState = (accAt && (Date.now() - accAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawAccState;
const accLoggedIn = accState === 'logged_in';
const accLoggedOut = accState === 'logged_out';
const forceLoginForm = !!(data && data.tfForceLoginForm);
const isSessionExpiredMsg = !!(loginError && /Silahkan\s*login|Session\s*berakhir|Session\s*TradersFamily\s*tidak\s*aktif/i.test(String(loginError)));
let candidateView = null;
const now = Date.now();
const rootAge = rootAt ? (now - rootAt) : 999999;
const accAge = accAt ? (now - accAt) : 999999;
const confirmedAt = Number(data && data.tfLoginConfirmedAt || 0);
const confirmedAge = confirmedAt ? (now - confirmedAt) : 999999;
const accRecentLoggedIn = accLoggedIn && accAge < TF_LOGIN_STATE_STALE_MS;
const rootRecentLoggedIn = rootLoggedIn && rootAge < TF_LOGIN_STATE_STALE_MS;
const confirmedRecent = confirmed && confirmedAge < TF_LOGIN_STATE_STALE_MS;
const shownMainOnceThisLogin = !!(data && data.tfShownMainOnceThisLogin);
const explicitLogoutAt = Number(data && data.tfExplicitLogoutAt || 0);
const explicitLogoutRecent = !!(explicitLogoutAt && (now - explicitLogoutAt) >= 0 && (now - explicitLogoutAt) < (30 * 60 * 1000));
const latestLoginAt = Math.max(
accRecentLoggedIn ? accAt : 0,
rootRecentLoggedIn ? rootAt : 0,
confirmedRecent ? confirmedAt : 0
);
const latestLogoutAt = Math.max(
(accLoggedOut && accAge < TF_LOGIN_STATE_STALE_MS) ? accAt : 0,
(rootLoggedOut && rootAge < TF_LOGIN_STATE_STALE_MS) ? rootAt : 0,
explicitLogoutRecent ? explicitLogoutAt : 0
);
// REV201 — mirror the stable legacy rule from tradersfamily.id navbar:
//   User Profile => logged in
//   Masuk / no User Profile => logged out
// A fresh root result wins over stale account/profile/cache state.
const rootFresh = rootAt > 0 && rootAge < TF_LOGIN_STATE_STALE_MS;
const accFresh = accAt > 0 && accAge < TF_LOGIN_STATE_STALE_MS;
// REV202 — an explicit Logout clicked inside the extension is authoritative.
// Root/account pages that were already open can keep stale "User Profile" DOM after
// the server session has been destroyed. Keep Login visible until a new login flow
// explicitly clears tfExplicitLogoutAt.
const scanInProgress = !!(data && data.tfScanInProgress);
if (explicitLogoutRecent) {
candidateView = 'login';
if (!forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: true, tfLoginConfirmed: false, tfEnteredMain: false, tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (forceLoginForm && (isSessionExpiredMsg || rootLoggedOut || accLoggedOut)) {
// REV377 — confirmed SESSION_EXPIRED/login-required is stronger than tfScanInProgress.
// Scan cleanup may still show Stop! briefly, but the sidebar must already show Login.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (scanInProgress) {
// Keep Dashboard only for inconclusive/stale probes while a valid scan is active.
candidateView = 'main';
} else if (rootFresh && rootLoggedIn) {
candidateView = 'main';
if (forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: false, tfLoginConfirmed: true, tfLoginConfirmedAt: Date.now() }, () => { }); } catch (e) { }
}
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else if (rootFresh && rootLoggedOut) {
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (accFresh && accLoggedIn && (!rootAt || accAt > rootAt)) {
// Fresh account login can bridge the short window before the next root navbar probe.
candidateView = 'main';
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else {
// Unknown is deliberately safe: show login form, never Offline dashboard.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
}
if (profile && (profile.name || profile.avatarUrl || profile.email)) {
applyProfileToPopup(profile);
}
try {
if (candidateView === 'main' && !tf__openedChannelsThisPopup) {
tf__openedChannelsThisPopup = true;
tf_openOrFocusChannelsTab();
}
}
catch (e) { }
tf__setCandidateView(candidateView);
if (loginError) {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) {
loginStatusEl.textContent = loginError;
}
chrome.storage.local.remove(['tfLoginError'], () => { });
}
});
}
document.addEventListener('DOMContentLoaded', async () => {
if (window.tfIntegrityReady && !(await window.tfIntegrityReady))
return;
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
try {
tf_initConfirmModal();
}
catch (e) { }
try {
tf_uiPresenceOpen();
}
catch (e) { }
try {
tf_captureBaseAnalystRowTemplates();
}
catch (e) { }
// Do not reset tfEnteredMain here. Opening the side panel must not erase
// authenticated evidence from a website session that is already active.
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
const timeRangeToggleMain = document.getElementById('tf-tr-toggle-main');
const timeRangeToggleMasuk = document.getElementById('tf-tr-toggle-masuk');
const timeRangeToggleIsignal = document.getElementById('tf-tr-toggle-isignal');
const timeRangePanelMain = document.getElementById('tf-tr-panel-main');
const timeRangePanelMasuk = document.getElementById('tf-tr-panel-masuk');
const timeRangePanelIsignal = document.getElementById('tf-tr-panel-isignal');
const timeRangeParenMain = document.getElementById('tf-time-range-paren-main');
const timeRangeParenMasuk = document.getElementById('tf-time-range-paren-masuk');
const timeRangeParenIsignal = document.getElementById('tf-time-range-paren-isignal');
const timeRangeTitleMain = document.getElementById('tf-tr-title-main');
const timeRangeTitleMasuk = document.getElementById('tf-tr-title-masuk');
const timeRangeTitleIsignal = document.getElementById('tf-tr-title-isignal');
const TF_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_TIME_RANGE_ALLOWED = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
const TF_TIME_RANGE_DEFAULT = 'all_time';
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL',
};
function tf_normalizeTimeRange(v) {
const s = String(v || '').trim();
if (TF_TIME_RANGE_ALLOWED.has(s))
return s;
return TF_TIME_RANGE_DEFAULT;
}
function tf_setActiveOption(root, v) {
if (!root)
return;
try {
const btns = root.querySelectorAll('.tf-tr-option');
btns.forEach((b) => {
const bv = b && b.dataset ? b.dataset.value : null;
b.classList.toggle('active', bv === v);
});
}
catch (e) { }
}
function tf_applyTimeRangeToUI(v) {
const label = TF_TIME_RANGE_LABELS[v] || TF_TIME_RANGE_LABELS[TF_TIME_RANGE_DEFAULT];
try {
if (timeRangeParenMain)
timeRangeParenMain.textContent = `(${label})`;
if (timeRangeParenMasuk)
timeRangeParenMasuk.textContent = `(${label})`;
if (timeRangeParenIsignal)
timeRangeParenIsignal.textContent = `(${label})`;
tf_setActiveOption(timeRangePanelMain, v);
tf_setActiveOption(timeRangePanelMasuk, v);
tf_setActiveOption(timeRangePanelIsignal, v);
}
catch (e) { }
}
function tf_saveTimeRange(v) {
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: v }, () => { });
}
}
catch (e) { }
}
function tf_getCurrentTimeRangeForScan() {
try {
const panels = [timeRangePanelMain, timeRangePanelMasuk, timeRangePanelIsignal];
for (const panel of panels) {
if (!panel)
continue;
const active = panel.querySelector('.tf-tr-option.active[data-value]');
if (active && active.dataset && active.dataset.value) {
return tf_normalizeTimeRange(active.dataset.value);
}
}
}
catch (e) { }
return TF_TIME_RANGE_DEFAULT;
}
function tf_sendStartBatchScanWithSelectedTimeRange(message, callback) {
const forceTimeRange = tf_getCurrentTimeRangeForScan();
const payload = Object.assign({}, message || {}, { forceTimeRange });
const send = () => {
try {
chrome.runtime.sendMessage(payload, callback);
}
catch (e) {
if (typeof callback === 'function')
callback(null);
}
};
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: forceTimeRange }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
send();
});
return;
}
}
catch (e) { }
send();
}
function tf_closeTimeRangePanels() {
try {
if (timeRangePanelMain)
timeRangePanelMain.hidden = true;
if (timeRangePanelMasuk)
timeRangePanelMasuk.hidden = true;
if (timeRangePanelIsignal)
timeRangePanelIsignal.hidden = true;
if (timeRangeToggleMain)
timeRangeToggleMain.setAttribute('aria-expanded', 'false');
if (timeRangeToggleMasuk)
timeRangeToggleMasuk.setAttribute('aria-expanded', 'false');
if (timeRangeToggleIsignal)
timeRangeToggleIsignal.setAttribute('aria-expanded', 'false');
}
catch (e) { }
}
function tf_toggleTimeRangePanelAny(toggle, panel) {
if (!toggle || !panel)
return;
const isOpen = panel.hidden === false;
const all = [
{ t: timeRangeToggleMain, p: timeRangePanelMain },
{ t: timeRangeToggleMasuk, p: timeRangePanelMasuk },
{ t: timeRangeToggleIsignal, p: timeRangePanelIsignal },
];
all.forEach((o) => {
if (!o || !o.t || !o.p)
return;
if (o.t === toggle)
return;
try {
o.p.hidden = true;
o.t.setAttribute('aria-expanded', 'false');
}
catch (e) { }
});
try {
panel.hidden = isOpen;
toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}
catch (e) { }
}
function tf_initTimeRangeSelector() {
const fallback = TF_TIME_RANGE_DEFAULT;
if (!hasChromeStorage()) {
tf_applyTimeRangeToUI(fallback);
return;
}
try {
chrome.storage.local.get([TF_TIME_RANGE_KEY], (res) => {
const raw = res ? res[TF_TIME_RANGE_KEY] : null;
const v = tf_normalizeTimeRange(raw);
tf_applyTimeRangeToUI(v);
if (!raw || raw !== v) {
tf_saveTimeRange(v);
}
});
}
catch (e) {
tf_applyTimeRangeToUI(fallback);
}
}
function tf_bindTimeRangeAccordion(toggle, panel, otherToggle, otherPanel) {
if (!toggle || !panel)
return;
const header = toggle.closest('.tf-tr-header');
if (header) {
header.addEventListener('click', (ev) => {
const isArrow = ev && ev.target ? !!ev.target.closest('.tf-tr-arrowbtn') : false;
if (isArrow)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
const box = toggle.closest('.profile-time-range');
if (box) {
box.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inHeader = t ? !!t.closest('.tf-tr-header') : false;
const inPanel = t ? !!t.closest('.tf-tr-panel') : false;
const isArrow = t ? !!t.closest('.tf-tr-arrowbtn') : false;
const isOption = t ? !!t.closest('.tf-tr-option') : false;
if (inHeader || inPanel || isArrow || isOption)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
toggle.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
panel.addEventListener('click', (ev) => {
const btn = ev && ev.target ? ev.target.closest('.tf-tr-option') : null;
if (!btn)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
const v = tf_normalizeTimeRange(btn.dataset ? btn.dataset.value : null);
tf_applyTimeRangeToUI(v);
tf_saveTimeRange(v);
tf_closeTimeRangePanels();
});
}
try {
tf_bindTimeRangeAccordion(timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTimeRangeAccordion(timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTimeRangeAccordion(timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
const tf_bindTitleClick = (titleEl, toggleEl, panelEl, otherToggleEl, otherPanelEl) => {
if (!titleEl || !toggleEl || !panelEl)
return;
titleEl.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggleEl, panelEl);
});
};
tf_bindTitleClick(timeRangeTitleMain, timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTitleClick(timeRangeTitleMasuk, timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTitleClick(timeRangeTitleIsignal, timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
tf_initTimeRangeSelector();
document.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inMain = (timeRangeToggleMain && timeRangeToggleMain.contains(t)) ||
(timeRangeTitleMain && timeRangeTitleMain.contains(t)) ||
(timeRangePanelMain && timeRangePanelMain.contains(t));
const inMasuk = (timeRangeToggleMasuk && timeRangeToggleMasuk.contains(t)) ||
(timeRangeTitleMasuk && timeRangeTitleMasuk.contains(t)) ||
(timeRangePanelMasuk && timeRangePanelMasuk.contains(t));
const inIsignal = (timeRangeToggleIsignal && timeRangeToggleIsignal.contains(t)) ||
(timeRangeTitleIsignal && timeRangeTitleIsignal.contains(t)) ||
(timeRangePanelIsignal && timeRangePanelIsignal.contains(t));
if (!inMain && !inMasuk && !inIsignal) {
tf_closeTimeRangePanels();
}
}, true);
document.addEventListener('keydown', (ev) => {
const k = ev ? (ev.key || ev.code || ev.keyCode) : null;
if (k === 'Escape' || k === 'Esc' || k === 27) {
tf_closeTimeRangePanels();
}
}, true);
}
catch (e) { }
const loginBtn = document.getElementById('login-btn');
const loginMt4Btn = document.getElementById('login-mt4-btn');
const loginGoogleBtn = document.getElementById('login-google-btn');
const loginUpgradePlanBtn = document.getElementById('login-upgrade-plan-btn');
const loginStatus = document.getElementById('login-status');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const rememberCheckbox = document.getElementById('login-remember');
const tfLoginOverlay = document.getElementById('tf-login-overlay');
const tfLoginOvTitle = document.getElementById('tf-login-ov-title');
const tfLoginOvSub = document.getElementById('tf-login-ov-sub');
const tfLoginOvCancel = document.getElementById('tf-login-ov-cancel');
const tfLoginOvRetry = document.getElementById('tf-login-ov-retry');
let tf__authTabId = null;
let tf__logoutTabId = null;
let tf__googleTimeoutT = null;
let tf__standardRetryTimer = null;
let tf__standardLoginAttempt = 0;
let tf__standardLoginIdentity = '';
let tf__standardLoginPassword = '';
let tf__standardRememberEnabled = false;
let tf__loginFlow = null;
let tf__loginFlowStartedAt = 0;
let tf__loginFlowToken = null;
let tf__openedChannelsThisPopup = false;
function tf_showLoginOverlay(title, sub, opts) {
try {
if (tfLoginOvTitle)
tfLoginOvTitle.textContent = title || 'Loading...';
if (tfLoginOvSub)
tfLoginOvSub.textContent = sub || '';
const showCancel = !!(opts && opts.showCancel);
const showRetry = !!(opts && opts.showRetry);
const hideSpinner = !!(opts && opts.hideSpinner);
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = showCancel ? '' : 'none';
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = showRetry ? '' : 'none';
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = hideSpinner ? 'none' : '';
}
catch (e) { }
if (tfLoginOverlay) {
tfLoginOverlay.style.display = 'flex';
tfLoginOverlay.setAttribute('aria-hidden', 'false');
try {
tfLoginOverlay.removeAttribute('inert');
}
catch (e) { }
try {
tfLoginOverlay.inert = false;
}
catch (e) { }
}
}
catch (e) { }
}
function tf__loginOverlayMoveFocusOut() {
try {
if (!tfLoginOverlay)
return;
const ae = document.activeElement;
if (ae && tfLoginOverlay.contains(ae)) {
try {
if (typeof ae.blur === 'function')
ae.blur();
}
catch (e) { }
const safe = loginBtn || loginMt4Btn || loginGoogleBtn || loginEmail || document.body;
try {
if (safe && typeof safe.focus === 'function')
safe.focus({ preventScroll: true });
}
catch (e) { }
}
}
catch (e) { }
}
function tf_hideLoginOverlay() {
try {
if (tfLoginOverlay) {
tf__loginOverlayMoveFocusOut();
try {
tfLoginOverlay.setAttribute('inert', '');
}
catch (e) { }
try {
tfLoginOverlay.inert = true;
}
catch (e) { }
tfLoginOverlay.setAttribute('aria-hidden', 'true');
tfLoginOverlay.style.display = 'none';
}
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = '';
}
catch (e) { }
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = 'none';
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = '';
}
catch (e) { }
}
function tf_cleanupTransientLoginTabs(extraTabIds) {
try {
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) return;
const ids = Array.isArray(extraTabIds) ? extraTabIds.filter((id) => id != null).map((id) => Number(id)) : [];
chrome.runtime.sendMessage({ type: 'tf_close_transient_login_tabs', tabIds: ids }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
catch (e) { }
}
function tf_setManualAuthState(active, mode, token) {
try {
if (!hasChromeStorage()) return;
const now = Date.now();
chrome.storage.local.set({
tfManualAuthActive: !!active,
tfManualAuthMode: active ? String(mode || '') : '',
tfManualAuthToken: active ? String(token || '') : '',
tfManualAuthStartedAt: active ? now : 0,
tfManualAuthStateAt: now
}, () => { });
}
catch (e) { }
}
function tf_closeAuthTab() {
const id = tf__authTabId;
try {
if (typeof chrome !== 'undefined' && chrome.tabs && id != null) {
chrome.tabs.remove(id, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
try { tf_cleanupTransientLoginTabs(id != null ? [id] : []); } catch (e) { }
tf__authTabId = null;
}
function tf_closeLogoutTab() {
try {
if (typeof chrome !== 'undefined' && chrome.tabs && tf__logoutTabId != null) {
chrome.tabs.remove(tf__logoutTabId, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
tf__logoutTabId = null;
}
function tf_openOrFocusChannelsTab() {
try {
const urlPattern = 'https://account.tradersfamily.id/channels*';
const createUrl = 'https://account.tradersfamily.id/channels/';
chrome.tabs.query({ url: urlPattern }, (tabs) => {
try {
if (tabs && tabs.length) {
const t = tabs[0];
try {
chrome.windows.update(t.windowId, { focused: true }, () => { });
}
catch (e) { }
try {
chrome.tabs.update(t.id, { active: true }, () => { });
}
catch (e) { }
return;
}
}
catch (e) { }
try {
chrome.tabs.create({ url: createUrl, active: true }, () => { });
}
catch (e) { }
});
}
catch (e) { }
}
function tf_sendMessageWithRetry(tabId, message, maxTries = 10, delayMs = 700) {
try {
let tries = 0;
const attempt = () => {
tries++;
try {
chrome.tabs.sendMessage(tabId, message, (resp) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (resp && resp.ok) {
return;
}
if (tries < maxTries) {
setTimeout(attempt, delayMs);
}
});
}
catch (e) {
if (tries < maxTries)
setTimeout(attempt, delayMs);
}
};
setTimeout(attempt, 250);
}
catch (e) { }
}
function tf_clearGoogleTimer() {
try {
if (tf__googleTimeoutT)
clearTimeout(tf__googleTimeoutT);
}
catch (e) { }
tf__googleTimeoutT = null;
}
function tf_clearStandardRetryTimer() {
try {
if (tf__standardRetryTimer)
clearTimeout(tf__standardRetryTimer);
}
catch (e) { }
tf__standardRetryTimer = null;
}
function tf_resetStandardRetryState() {
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = 0;
tf__standardLoginIdentity = '';
tf__standardLoginPassword = '';
tf__standardRememberEnabled = false;
}
function tf_openStandardLoginAttempt(attemptNumber) {
if (tf__loginFlow !== 'standard')
return;
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = Math.max(1, Math.min(2, Number(attemptNumber) || 1));
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
const idVal = String(tf__standardLoginIdentity || '').trim();
const passVal = String(tf__standardLoginPassword || '').trim();
const rememberEnabled = !!tf__standardRememberEnabled;
if (!idVal || !passVal) {
tf_resetStandardRetryState();
tf__loginFlow = null;
if (loginStatus)
loginStatus.textContent = 'Email/Username dan Password tidak tersedia.';
return;
}
if (hasChromeStorage()) {
const toStore = {
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true,
tfEnterMainAfterLogin: true,
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfPendingLogin: { mode: 'standard', identity: idVal, password: passVal },
tfPendingGoogleLogin: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfRememberLogin: rememberEnabled ? { enabled: true, email: idVal } : { enabled: false, email: '' },
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
};
chrome.storage.local.set(toStore, () => { });
}
const attemptLabel = tf__standardLoginAttempt === 1 ? 'Percobaan 1 dari 2' : 'Percobaan 2 dari 2';
tf_showLoginOverlay('Membuka halaman login...', attemptLabel + ' • menunggu maksimal 1 menit', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '') + '#';
tf_setManualAuthState(true, 'standard', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined') {
tf__authTabId = tab.id;
try {
tf_sendMessageWithRetry(tf__authTabId, { type: 'tfDoStandardLogin', identity: idVal, password: passVal, token: (tf__loginFlowToken || '') }, 12, 650);
}
catch (e) { }
}
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
const watchedToken = tf__loginFlowToken;
const watchedAttempt = tf__standardLoginAttempt;
tf__standardRetryTimer = setTimeout(() => {
try {
if (tf__loginFlow !== 'standard' || tf__loginFlowToken !== watchedToken || tf__standardLoginAttempt !== watchedAttempt)
return;
const continueAfterCheck = (confirmed) => {
if (confirmed || tf__loginFlow !== 'standard' || tf__loginFlowToken !== watchedToken)
return;
tf_closeAuthTab();
if (watchedAttempt < 2) {
tf_showLoginOverlay('Halaman login terlalu lama', 'Tab ditutup. Mengulang otomatis • percobaan 2 dari 2', { showCancel: true, showRetry: false });
setTimeout(() => {
try {
if (tf__loginFlow === 'standard')
tf_openStandardLoginAttempt(2);
}
catch (e) { }
}, 350);
return;
}
tf_clearStandardRetryTimer();
tf_setManualAuthState(false, '', '');
if (hasChromeStorage()) {
try {
chrome.storage.local.remove(['tfPendingLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved', 'tfLoginError'], () => { });
}
catch (e) { }
}
tf_showLoginOverlay('Login belum berhasil', 'Sudah mencoba 2 kali. Silakan klik Masuk untuk mencoba kembali.', { showCancel: false, showRetry: false, hideSpinner: true });
setTimeout(() => {
try {
tf_hideLoginOverlay();
}
catch (e) { }
if (loginStatus)
loginStatus.textContent = 'Login belum berhasil setelah 2 percobaan.';
tf__loginFlow = null;
tf__loginFlowToken = null;
tf_resetStandardRetryState();
showLoginView();
}, 1800);
};
if (hasChromeStorage()) {
chrome.storage.local.get(['tfLoginConfirmed', 'tfAccountLoginState'], (data) => {
const confirmed = !!(data && data.tfLoginConfirmed === true) || /logged[_ -]?in|online/i.test(String(data && data.tfAccountLoginState || ''));
continueAfterCheck(confirmed);
});
}
else {
continueAfterCheck(false);
}
}
catch (e) { }
}, 60000);
showLoginView();
}
if (tfLoginOvCancel) {
tfLoginOvCancel.addEventListener('click', () => {
tf_clearGoogleTimer();
tf_resetStandardRetryState();
tf_setManualAuthState(false, '', '');
tf_closeAuthTab();
tf_hideLoginOverlay();
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
if (hasChromeStorage()) {
chrome.storage.local.remove(['tfPendingLogin', 'tfPendingGoogleLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved', 'tfLoginError'], () => { });
}
}
catch (e) { }
showLoginView();
});
}
if (tfLoginOvRetry) {
tfLoginOvRetry.addEventListener('click', () => {
tf_clearGoogleTimer();
tf_resetStandardRetryState();
tf_setManualAuthState(false, '', '');
tf_closeAuthTab();
tf_hideLoginOverlay();
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
if (hasChromeStorage()) {
chrome.storage.local.remove(['tfPendingGoogleLogin', 'tfLoginError'], () => { });
}
}
catch (e) { }
showLoginView();
try {
setTimeout(() => {
try {
tf_startGoogleLoginFlow(loginGoogleBtn);
}
catch (e) { }
}, 80);
}
catch (e) { }
});
}
function handleLoginEnter(event) {
if (!event)
return;
const key = event.key || event.code || event.keyCode;
const isEnter = key === 'Enter' ||
key === 'NumpadEnter' ||
key === 13;
if (!isEnter) {
return;
}
event.preventDefault();
event.stopPropagation();
if (loginBtn) {
loginBtn.click();
}
}
if (loginEmail) {
loginEmail.addEventListener('keydown', handleLoginEnter);
}
if (loginPassword) {
loginPassword.addEventListener('keydown', handleLoginEnter);
}
function tf_guardBtnBusy(btn) {
try {
if (!btn || !btn.dataset)
return false;
if (btn.dataset.busy === '1')
return true;
btn.dataset.busy = '1';
setTimeout(() => { try {
btn.dataset.busy = '0';
}
catch (e) { } }, 1500);
}
catch (e) { }
return false;
}
function tf_startStandardLoginFlow(btnRef) {
if (tf_guardBtnBusy(btnRef || loginBtn))
return;
const idVal = (loginEmail && loginEmail.value ? loginEmail.value : '').trim();
const passVal = (loginPassword && loginPassword.value ? loginPassword.value : '').trim();
if (!idVal || !passVal) {
if (loginStatus)
loginStatus.textContent = 'Isi Email/Username/MT4 Id dan Password terlebih dahulu.';
return;
}
tf_resetStandardRetryState();
try {
if (hasChromeStorage()) {
chrome.storage.local.set({
tfExplicitLogoutAt: 0,
tfScanInProgress: false,
tfForceLoginForm: true,
tfLoginError: ''
}, () => { });
}
}
catch (e) { }
tf__standardLoginIdentity = idVal;
tf__standardLoginPassword = passVal;
tf__standardRememberEnabled = !!(rememberCheckbox && rememberCheckbox.checked);
tf__loginFlow = 'standard';
if (loginStatus)
loginStatus.textContent = '';
tf_openStandardLoginAttempt(1);
}
function tf_startMt4LoginFlow(btnRef) {
if (tf_guardBtnBusy(btnRef || loginBtn))
return;
const idVal = (loginEmail && loginEmail.value ? loginEmail.value : '').trim();
const passVal = (loginPassword && loginPassword.value ? loginPassword.value : '').trim();
if (!idVal || !passVal) {
if (loginStatus)
loginStatus.textContent = 'Isi Email/Username/MT4 Id dan Password terlebih dahulu.';
return;
}
const rememberEnabled = !!(rememberCheckbox && rememberCheckbox.checked);
tf__loginFlow = 'mt4';
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
if (hasChromeStorage()) {
const toStore = {
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true,
tfEnterMainAfterLogin: true,
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfPendingLogin: { mode: 'mt4', identity: idVal, password: passVal },
tfPendingGoogleLogin: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfRememberLogin: rememberEnabled ? { enabled: true, email: idVal } : { enabled: false, email: '' },
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
};
chrome.storage.local.set(toStore, () => { });
}
if (loginStatus)
loginStatus.textContent = '';
tf_showLoginOverlay('Membuka halaman login MT4...', 'Menunggu halaman login...', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/loginmt/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '');
tf_setManualAuthState(true, 'mt4', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined')
tf__authTabId = tab.id;
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
showLoginView();
}
function tf_startGoogleLoginFlow() {
if (tf_guardBtnBusy(loginGoogleBtn))
return;
tf__loginFlow = 'google';
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
tf_clearGoogleTimer();
if (hasChromeStorage()) {
chrome.storage.local.set({
tfPendingGoogleLogin: { token: tf__loginFlowToken || '' },
tfPendingLogin: null,
tfEnterMainAfterLogin: true,
tfForceLoginForm: true,
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
}, () => { });
}
tf_showLoginOverlay('Login by Google...', 'Buka tab login. Plugin akan coba klik tombol Google otomatis. Menunggu proses login (maks 1 menit)', { showCancel: true, showRetry: false });
const targetUrl = 'https://account.tradersfamily.id/?tfAuth=1&tfManualAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '') + '#';
tf_setManualAuthState(true, 'google', tf__loginFlowToken || '');
try { tf_cleanupTransientLoginTabs([]); } catch (e) { }
if (typeof chrome !== 'undefined' && chrome.tabs) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined')
tf__authTabId = tab.id;
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
tf__googleTimeoutT = setTimeout(() => {
try {
if (tf__loginFlow !== 'google')
return;
tf_setManualAuthState(false, '', '');
tf_showLoginOverlay('Session time out..!', 'Silahkan coba login kembali.', { showCancel: false, showRetry: true, hideSpinner: true });
}
catch (e) { }
}, 1 * 60 * 1000);
showLoginView();
}
async function tf_openLoginUpgradePlan() {
try {
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
let email = String((loginEmail && loginEmail.value) || '').trim().toLowerCase();
if (!email && hasChromeStorage()) {
try {
const stored = await new Promise((resolve) => {
chrome.storage.local.get(['tfLicenseCredentials'], (result) => resolve(result || {}));
});
const credentials = stored.tfLicenseCredentials || {};
email = String(credentials.email || '').trim().toLowerCase();
}
catch (e) { }
}
if (email)
subscribeUrl.searchParams.set('email', email);
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url: subscribeUrl.toString(), active: true });
}
else {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
}
catch (error) {
try {
window.open(chrome.runtime.getURL('subscribe_plan.html'), '_blank', 'noopener,noreferrer');
}
catch (e) { }
}
}
if (loginBtn) {
loginBtn.addEventListener('click', () => tf_startStandardLoginFlow(loginBtn));
try {
window.__tfLoginUiReady = true;
if (window.__tfEarlyLoginClickPending) {
window.__tfEarlyLoginClickPending = false;
setTimeout(() => { try { loginBtn.click(); } catch (e) { } }, 0);
}
}
catch (e) { }
}
if (loginMt4Btn)
loginMt4Btn.addEventListener('click', () => tf_startMt4LoginFlow(loginMt4Btn));
if (loginGoogleBtn)
loginGoogleBtn.addEventListener('click', tf_startGoogleLoginFlow);
if (loginUpgradePlanBtn)
loginUpgradePlanBtn.addEventListener('click', () => { void tf_openLoginUpgradePlan(); });
if (hasChromeStorage() && chrome.storage.onChanged) {
chrome.storage.onChanged.addListener((changes, areaName) => {
if (areaName !== 'local')
return;
if (tf__bootLoadingActive)
return;
if (changes.tfUserProfile && changes.tfUserProfile.newValue) {
applyProfileToPopup(changes.tfUserProfile.newValue);
}
if (changes.tfRootLoginState || changes.tfAccountLoginState || changes.tfLoginConfirmed || changes.tfEnteredMain || changes.tfLoginError || changes.tfForceLoginForm || changes.tfExplicitLogoutAt || changes.tfPeriodicLogoutAt) {
try {
loadPopupStateFromStorage();
}
catch (e) { }
}
try {
if (changes.tfCaptchaNeeded || changes.tfCaptchaSolved) {
const need = changes.tfCaptchaNeeded ? !!changes.tfCaptchaNeeded.newValue : null;
const solved = changes.tfCaptchaSolved ? !!changes.tfCaptchaSolved.newValue : null;
if (need === null || solved === null) {
chrome.storage.local.get(['tfCaptchaNeeded', 'tfCaptchaSolved'], (d) => {
const n2 = !!(d && d.tfCaptchaNeeded);
const s2 = !!(d && d.tfCaptchaSolved);
if (tf__loginFlow === 'mt4' || tf__loginFlow === 'standard') {
if (n2 && !s2) {
}
else if (s2) {
tf_showLoginOverlay('Captcha terdeteksi ✅', 'Sedang auto login...', { showCancel: true, showRetry: false });
}
}
});
}
else {
if (tf__loginFlow === 'mt4' || tf__loginFlow === 'standard') {
if (need && !solved) {
}
else if (solved) {
tf_showLoginOverlay('Captcha terdeteksi ✅', 'Sedang auto login...', { showCancel: true, showRetry: false });
}
}
}
}
if (changes.tfLoginConfirmed && changes.tfLoginConfirmed.newValue === true) {
const finalizeLogin = () => {
tf_clearGoogleTimer();
tf_setManualAuthState(false, '', '');
tf_resetStandardRetryState();
try {
tf_closeAuthTab();
}
catch (e) { }
try {
if (!tf__openedChannelsThisPopup) {
tf__openedChannelsThisPopup = true;
tf_openOrFocusChannelsTab();
}
}
catch (e) { }
tf_hideLoginOverlay();
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
chrome.storage.local.remove(['tfCaptchaNeeded', 'tfCaptchaSolved', 'tfPendingGoogleLogin'], () => { });
}
catch (e) { }
try { loadPopupStateFromStorage(); } catch (e) { }
try {
setTimeout(() => {
try {
if (typeof window.__tfResumePendingActionAfterLogin === 'function') window.__tfResumePendingActionAfterLogin();
}
catch (e) { }
}, 700);
}
catch (e) { }
};
const confirmRootThenFinalize = () => {
// REV203: account login alone no longer waits for the user to manually open
// tradersfamily.id. Probe a fresh root tab automatically and only finish when
// the navbar exposes User Profile, matching the requested login authority rule.
try {
tf_showLoginOverlay('Login berhasil ✅', 'Sinkronisasi User Profile di TradersFamily...', { showCancel: false, showRetry: false });
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'confirm_tf_root_after_login', source: 'side_panel_login' }, (res) => {
let portError = false;
try { portError = !!(chrome.runtime && chrome.runtime.lastError); } catch (e) { portError = true; }
if (!portError && res && res.ok === true && String(res.state || '') === 'logged_in') {
finalizeLogin();
return;
}
try { tf_hideLoginOverlay(); } catch (e) { }
try {
const st = document.getElementById('login-status');
if (st)
st.textContent = 'Login akun berhasil, tetapi User Profile di tradersfamily.id belum terdeteksi. Silakan klik Masuk untuk mencoba sinkronisasi lagi.';
}
catch (e) { }
try { showLoginView(); } catch (e) { }
});
}
catch (e) {
try { tf_hideLoginOverlay(); } catch (err) { }
try { showLoginView(); } catch (err) { }
}
};
if (tf__loginFlowToken) {
chrome.storage.local.get(['tfAuthTokenSeen'], (d) => {
const seen = (d && d.tfAuthTokenSeen) ? String(d.tfAuthTokenSeen) : '';
if (seen && seen !== tf__loginFlowToken)
return;
confirmRootThenFinalize();
});
}
else {
confirmRootThenFinalize();
}
}
if (changes.tfLogoutSuccess && changes.tfLogoutSuccess.newValue === true) {
const run = () => {
tf_clearGoogleTimer();
tf_resetStandardRetryState();
try {
tf_closeAuthTab();
}
catch (e) { }
try {
tf_closeLogoutTab();
}
catch (e) { }
try {
tf_hideLoginOverlay();
}
catch (e) { }
tf__loginFlow = null;
tf__loginFlowToken = null;
try { tf_setManualAuthState(false, '', ''); } catch (e) { }
try {
if (hasChromeStorage()) {
const logoutAt = Date.now();
chrome.storage.local.set({
tfExplicitLogoutAt: logoutAt,
tfLoginConfirmed: false,
tfLoginConfirmedAt: logoutAt,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: logoutAt,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: logoutAt,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true
}, () => { });
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl', 'tfPendingLogin'], () => { });
}
}
catch (e) { }
try {
showLoginView();
}
catch (e) { }
try {
const statusEl = document.getElementById('status');
if (statusEl)
statusEl.textContent = 'Berhasil logout. Silakan login kembali.';
}
catch (e) { }
};
if (tf__loginFlowToken) {
chrome.storage.local.get(['tfAuthTokenSeen'], (d) => {
const seen = (d && d.tfAuthTokenSeen) ? String(d.tfAuthTokenSeen) : '';
if (seen && seen !== tf__loginFlowToken)
return;
run();
});
}
else {
run();
}
}
if (changes.tfLoginError && changes.tfLoginError.newValue) {
const run = () => {
tf_clearGoogleTimer();
tf_clearStandardRetryTimer();
const msg = String(changes.tfLoginError.newValue || '').trim();
const ageMs = tf__loginFlowStartedAt ? (Date.now() - tf__loginFlowStartedAt) : 999999;
if (ageMs < 2500) {
return;
}
const isPopupBlocked = /popup-blocked|auth\/popup-blocked/i.test(msg);
const isEmailNotRegistered = /email\s+belum\s+terdaftar/i.test(msg);
if (tf__loginFlow === 'google' && isPopupBlocked) {
tf_showLoginOverlay('Popup diblokir', 'Browser memblokir pop-up Google. Izinkan pop-up untuk account.tradersfamily.id lalu klik Login by Google lagi.', { showCancel: true, showRetry: true, hideSpinner: true });
return;
}
try { tf_setManualAuthState(false, '', ''); } catch (e) { }
try {
tf_closeAuthTab();
}
catch (e) { }
if (tf__loginFlow) {
tf_showLoginOverlay('Login gagal', (msg || 'Coba lagi'), { showCancel: false, showRetry: false });
setTimeout(() => {
try {
tf_hideLoginOverlay();
}
catch (e) { }
if (isEmailNotRegistered) {
try {
const emailEl = document.getElementById('login-email');
const passEl = document.getElementById('login-password');
if (emailEl)
emailEl.value = '';
if (passEl)
passEl.value = '';
const st = document.getElementById('login-status');
if (st)
st.textContent = 'Email belum terdaftar. Silakan gunakan email lain atau daftar terlebih dahulu.';
}
catch (e2) { }
}
}, 1500);
tf__loginFlow = null;
tf__loginFlowToken = null;
}
};
if (tf__loginFlowToken) {
chrome.storage.local.get(['tfAuthTokenSeen'], (d) => {
const seen = (d && d.tfAuthTokenSeen) ? String(d.tfAuthTokenSeen) : '';
if (seen && seen !== tf__loginFlowToken)
return;
run();
});
}
else {
run();
}
}
}
catch (e) { }
if (changes.tfScanInProgress || changes.tfScanOrigin) {
try {
const inProg = changes.tfScanInProgress ? !!changes.tfScanInProgress.newValue : null;
const origin = changes.tfScanOrigin ? changes.tfScanOrigin.newValue : null;
if (inProg === null || origin === null) {
chrome.storage.local.get(['tfScanInProgress', 'tfScanOrigin'], (d) => {
try {
tf_applyStopModeFromScanState(!!(d && d.tfScanInProgress), (d && d.tfScanOrigin) ? d.tfScanOrigin : null);
}
catch (e) { }
});
}
else {
tf_applyStopModeFromScanState(!!inProg, origin);
}
}
catch (e) { }
}
if (changes.tfScanInProgress && changes.tfScanInProgress.newValue === false) {
try {
tf_reloadAnalystNamesInSidebarUI();
}
catch (e) { }
}
if (changes.tfHasImportedBundle || changes.tfImportLockEngaged) {
try {
tf_syncUpdateButtonsEnabledFromStorage();
}
catch (e) { }
}
if (changes.tfAllAnalystPairsMain || changes.tfAllAnalystPairsIsignal || changes.tfAllAnalystPairs) {
try {
tf_refreshAllAnalystPairsUIFromStorage();
}
catch (e) { }
}
if (changes.tfSelectedTimeRange) {
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
}
if (changes.tfHistoryBatchProgressMap) {
try {
const progressMap = changes.tfHistoryBatchProgressMap.newValue;
const hasEntries = !!(progressMap && typeof progressMap === 'object' && Object.keys(progressMap).length);
if (!hasEntries) {
// Reset map dari background menandai batch scan baru. Hapus hanya baris
// Overall/Batch lama; jangan menghapus session UI Scan Channel tunggal.
hbui_clearRowsDom();
scui_getListEls();
}
else if (Date.now() >= (__tfProgressUiMutedUntil || 0)) {
hbui_restoreFromProgressMap(progressMap);
}
}
catch (e) { }
}
if (changes.tfAnalystSources || changes.tfRememberedAnalystLinks || changes[TF_ANALYST_NAME_CACHE_KEY]) {
try {
tf_scheduleSavedChannelsRefresh({ reloadNames: !!changes.tfAnalystSources });
}
catch (e) { }
}
if (changes.tfMonthlyStats || changes.tfHistorySignals || changes.tfScoreHistory || changes.tfNoDataPairs || changes.tfAvgSlPips || changes.tfLastScanMeta || changes.tfLastImportMeta || changes.tfAnalystSources || changes.tfRememberedAnalystLinks || changes.tfAllAnalystPairsMain || changes.tfAllAnalystPairsIsignal || changes.tfAllAnalystPairs) {
try {
tf_updateExportButtonsEnabledFromStorage();
}
catch (e) { }
}
});
}
try {
tf_setBootLoading(true, 'Memeriksa status login...', 'Menunggu tab probe ditutup');
}
catch (e) { }
try {
setTimeout(() => { if (!tf__bootFinished)
tf_bootFinish(); }, 30000);
}
catch (e) { }
try {
ensureTradersFamilyHomeTab(tf_bootFinishMaybeWaitProfile);
}
catch (e) {
try {
tf_bootFinish();
}
catch (err) { }
}
const scanBtn = document.getElementById('scan-btn');
const scanPairSelect = document.getElementById('scan-pair-select');
const batchBtn = document.getElementById('batch-scan-btn');
const scanFromIsignalBtn = document.getElementById('scan-from-isignal-btn');
const isignalBackLink = document.getElementById('isignal-back-link');
const isignalLinksContainer = document.getElementById('isignal-links-container');
const batchIsignalBtn = document.getElementById('batch-scan-isignal-btn');
const openDashboardBtn = document.getElementById('open-dashboard-btn');
const clearDataBtn = document.getElementById('clear-data-btn');
const logoutBtn = document.getElementById('logout-btn');
const analystLinksContainer = document.getElementById('analyst-links-container');
const addAnalystBtn = document.getElementById('add-analyst-btn');
const addAnalystIsignalBtn = document.getElementById('add-analyst-isignal-btn');
const scanStatusClearBtn = document.getElementById('scan-channel-status-clear');
const scanStatusClearBtnIsignal = document.getElementById('scan-channel-status-clear-isignal');
const tf_onClearProgressClick = (event) => {
try {
if (event) {
event.preventDefault();
event.stopPropagation();
}
}
catch (e) { }
try {
tf_clearProgressUiAndStorage();
setStatus('Status progress dibersihkan.');
}
catch (e) { }
};
if (scanStatusClearBtn)
scanStatusClearBtn.addEventListener('click', tf_onClearProgressClick);
if (scanStatusClearBtnIsignal)
scanStatusClearBtnIsignal.addEventListener('click', tf_onClearProgressClick);
try {
scui_getListEls();
hbui_restoreStoredProgress();
}
catch (e) { }
try {
showDashboardSubview();
}
catch (e) { }
try {
initScanPairMultiSelect();
}
catch (e) { }
try {
initAllAnalystPairsMultiSelect();
}
catch (e) { }
const tfImportFileInput = document.getElementById('tf-import-file');
const btnImportMain = document.getElementById('tf-btn-import-main');
const btnExportMain = document.getElementById('tf-btn-export-main');
const btnUpdateMain = document.getElementById('tf-btn-update-main');
const btnImportMasuk = document.getElementById('tf-btn-import-masuk');
const btnExportMasuk = document.getElementById('tf-btn-export-masuk');
const btnUpdateMasuk = document.getElementById('tf-btn-update-masuk');
const btnImportIsignal = document.getElementById('tf-btn-import-isignal');
const btnExportIsignal = document.getElementById('tf-btn-export-isignal');
const btnUpdateIsignal = document.getElementById('tf-btn-update-isignal');
const btnSubmitMain = document.getElementById('tf-btn-submit-main');
const btnSubmitMasuk = document.getElementById('tf-btn-submit-masuk');
const btnSubmitIsignal = document.getElementById('tf-btn-submit-isignal');
const btnAddAnalystMainLink = document.getElementById('tf-btn-add-analyst-main');
const btnAddAnalystMasukLink = document.getElementById('tf-btn-add-analyst-masuk');
const btnAddAnalystIsignalLink = document.getElementById('tf-btn-add-analyst-isignal');
const tf_pickImportFile = () => {
if (!tfImportFileInput) {
alert('File input tidak ditemukan.');
return;
}
try {
tfImportFileInput.value = '';
}
catch (e) { }
try {
tfImportFileInput.click();
}
catch (e) { }
};
const bindAll = (btn, fn) => {
if (!btn)
return;
btn.addEventListener('click', fn);
};
const tf_onExportClick = (btn) => {
try {
if (!btn || btn.disabled) {
setStatus('Export hanya aktif jika sudah ada data hasil Scan atau Import.');
return;
}
}
catch (e) { }
tf_exportScanDataNow();
};
bindAll(btnExportMain, () => tf_onExportClick(btnExportMain));
bindAll(btnExportMasuk, () => tf_onExportClick(btnExportMasuk));
bindAll(btnExportIsignal, () => tf_onExportClick(btnExportIsignal));
bindAll(btnImportMain, () => {
setStatus('Pilih file export (.json) untuk Import...');
tf_pickImportFile();
});
bindAll(btnImportMasuk, () => {
setStatus('Pilih file export (.json) untuk Import...');
tf_pickImportFile();
});
bindAll(btnImportIsignal, () => {
setStatus('Pilih file export (.json) untuk Import...');
tf_pickImportFile();
});
// REV368 — Update must prove the CURRENT TradersFamily server session before
// starting. Never trust an already-open account tab as positive login evidence because
// its rendered DOM can remain cached after the server session has expired.
let __tfUpdateLoginPreflightBusy = false;
const tf_setUpdateLoginPreflightBusy = (busy) => {
__tfUpdateLoginPreflightBusy = !!busy;
try {
[btnUpdateMain, btnUpdateMasuk, btnUpdateIsignal].forEach((updateBtn) => {
if (!updateBtn) return;
if (busy) {
updateBtn.dataset.tfLoginPreflight = '1';
updateBtn.setAttribute('aria-busy', 'true');
updateBtn.disabled = true;
updateBtn.setAttribute('aria-disabled', 'true');
} else {
if (updateBtn.dataset) delete updateBtn.dataset.tfLoginPreflight;
updateBtn.removeAttribute('aria-busy');
}
});
if (!busy) tf_syncUpdateButtonsEnabledFromStorage();
}
catch (e) { }
};
const tf_verifyFreshLoginBeforeUpdate = () => new Promise((resolve) => {
let settled = false;
let timeout = null;
const done = (value) => {
if (settled) return;
settled = true;
try { if (timeout) clearTimeout(timeout); } catch (e) { }
resolve(value);
};
timeout = setTimeout(() => {
done({ ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_TIMEOUT', error: 'Pemeriksaan login tidak memberi respons dalam batas waktu.' });
}, 50000);
try {
if (!hasChromeStorage() || !chrome.runtime || !chrome.runtime.sendMessage) {
done({ ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNAVAILABLE' });
return;
}
chrome.runtime.sendMessage({ type: 'tf_verify_login_before_update_strict', at: Date.now() }, (response) => {
try {
const err = chrome.runtime.lastError;
if (err) {
done({ ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_RUNTIME_ERROR', error: String(err.message || err) });
return;
}
done(response || { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_EMPTY' });
}
catch (e) {
done({ ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_CALLBACK_ERROR', error: String(e && e.message ? e.message : e) });
}
});
}
catch (e) {
done({ ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e) });
}
});
const TF_RESUME_AFTER_LOGIN_KEY = 'tfResumeAfterLoginV1';
let __tfResumeAfterLoginBusy = false;
const tf_queueResumeAfterLogin = (action, extra) => {
try {
if (!hasChromeStorage()) return;
const payload = {
action: String(action || ''),
createdAt: Date.now(),
extra: (extra && typeof extra === 'object') ? extra : {}
};
chrome.storage.local.set({ [TF_RESUME_AFTER_LOGIN_KEY]: payload }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
catch (e) { }
};
const tf_forceLoginViewForResume = (action, reason, extra) => {
const msg = String(reason || 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.');
try { tf_queueResumeAfterLogin(action, extra); } catch (e) { }
try {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) loginStatusEl.textContent = msg;
setStatus(msg);
}
catch (e) { }
try {
if (hasChromeStorage()) {
const now = Date.now();
chrome.storage.local.set({
tfLoginConfirmed: false,
tfEnteredMain: false,
tfForceLoginForm: true,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfLoginError: msg
}, () => { });
}
}
catch (e) { }
try { showLoginView(); } catch (e) { }
};
const onUpdateClick = async (btn) => {
if (!btn)
return;
if (btn.dataset && btn.dataset.tfStopPending === '1')
return;
// STOP must remain immediately available even if the TradersFamily session expires
// while an Update is already running.
if (tf_isStopMode(btn)) {
setStatus('Stopping progress...');
try {
__tfUpdateStopOptimisticUnlock = true;
[btnUpdateMain, btnUpdateMasuk, btnUpdateIsignal].forEach((updateBtn) => {
if (!updateBtn) return;
if (updateBtn.dataset) updateBtn.dataset.tfStopPending = '1';
updateBtn.setAttribute('aria-busy', 'true');
updateBtn.disabled = true;
updateBtn.setAttribute('aria-disabled', 'true');
if (tf_isStopMode(updateBtn)) updateBtn.textContent = 'Stopping...';
});
tf_setUpdateActivityLock(false);
}
catch (e) { }
tf_sendStopProgress(() => {
try {
[btnUpdateMain, btnUpdateMasuk, btnUpdateIsignal].forEach((updateBtn) => {
if (!updateBtn) return;
tf_setStopMode(updateBtn, false);
if (updateBtn.dataset) delete updateBtn.dataset.tfStopPending;
updateBtn.removeAttribute('aria-busy');
});
tf_syncUpdateButtonsEnabledFromStorage();
}
catch (e) { }
setStatus('Stopped.');
});
return;
}
if (btn.disabled || __tfUpdateLoginPreflightBusy || __tfUpdatePickerBusy)
return;
let selectedUpdateUrls;
__tfUpdatePickerBusy=true;
try{selectedUpdateUrls=await tf_chooseUpdateAnalysts();}catch(error){setStatus('Pilihan Update gagal: '+(error.message||error));return;}finally{__tfUpdatePickerBusy=false;}
if(!selectedUpdateUrls?.length)return;
if(btn.disabled||__tfUpdateActivityLocked){setStatus('Update dibatalkan: proses lain sedang berjalan.');return;}
setStatus('Update: memeriksa session login TradersFamily terbaru...');
tf_setUpdateLoginPreflightBusy(true);
let loginCheck = null;
try {
loginCheck = await tf_verifyFreshLoginBeforeUpdate();
}
catch (e) {
loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e) };
}
finally {
tf_setUpdateLoginPreflightBusy(false);
}
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('update', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Update akan dilanjutkan otomatis.', { source: 'update_preflight' });
try { loadPopupStateFromStorage(); } catch (e) { }
} else {
setStatus('Update dibatalkan: status login terbaru tidak dapat diverifikasi. Periksa koneksi lalu coba lagi.');
}
return;
}
setStatus('Update: login valid ✓ — reload nama analis...');
tf_reloadAnalystNamesInSidebarUI(() => {
try {
loadPopupStateFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
setStatus('Update: memulai satu kali scan tanpa memilih Time Range dan tanpa mundur kalender...');
tf_startBatchScanFromStoredConfig('updateButton',selectedUpdateUrls);
});
};
bindAll(btnUpdateMain, () => onUpdateClick(btnUpdateMain));
bindAll(btnUpdateMasuk, () => onUpdateClick(btnUpdateMasuk));
bindAll(btnUpdateIsignal, () => onUpdateClick(btnUpdateIsignal));
const onAddAnalystLinkClick = () => {
try {
tf_addModeScanLinksManuallyHidden = false;
}
catch (e) { }
try {
setStatus('Mode Tambahkan Analis aktif: Update dikunci. Tambahkan link baru lalu scan untuk combine.');
}
catch (e) { }
const baselineCounts = (() => {
try {
const cMain = document.getElementById('analyst-links-container');
const cIsig = document.getElementById('isignal-links-container');
const mainCount = cMain ? (cMain.querySelectorAll('.analyst-row').length || 0) : 0;
const isignalCount = cIsig ? (cIsig.querySelectorAll('.analyst-row').length || 0) : 0;
return { main: mainCount, isignal: isignalCount };
}
catch (e) {
return { main: 0, isignal: 0 };
}
})();
tf_engageAddAnalystMode(() => {
try {
showMainView();
showDashboardSubview();
}
catch (e) { }
try {
if (addAnalystBtn) {
const wasDisabled = !!addAnalystBtn.disabled;
const previousBypass = addAnalystBtn.dataset ? addAnalystBtn.dataset.tfHyperlinkBypass : undefined;
if (addAnalystBtn.dataset)
addAnalystBtn.dataset.tfHyperlinkBypass = '1';
addAnalystBtn.disabled = false;
addAnalystBtn.click();
if (addAnalystBtn.dataset) {
if (typeof previousBypass === 'undefined')
delete addAnalystBtn.dataset.tfHyperlinkBypass;
else
addAnalystBtn.dataset.tfHyperlinkBypass = previousBypass;
}
if (wasDisabled || (addAnalystBtn.dataset && addAnalystBtn.dataset.tfImportBlocked === '1')) {
addAnalystBtn.disabled = true;
}
}
}
catch (e) { }
}, baselineCounts);
};
bindAll(btnAddAnalystMainLink, () => onAddAnalystLinkClick());
bindAll(btnAddAnalystMasukLink, () => onAddAnalystLinkClick());
bindAll(btnAddAnalystIsignalLink, () => onAddAnalystLinkClick());
const btnAddModeCloseMain = document.getElementById('tf-btn-addmode-close-main');
const btnAddModeCloseMasuk = document.getElementById('tf-btn-addmode-close-masuk');
const btnAddModeCloseIsignal = document.getElementById('tf-btn-addmode-close-isignal');
const onAddModeCloseClick = () => {
try {
tf_addModeScanLinksManuallyHidden = true;
}
catch (e) { }
try {
tf_closeAddModePairPopover();
}
catch (e) { }
try {
tf_setAddModeSecondaryActionsVisible(true);
}
catch (e) { }
};
bindAll(btnAddModeCloseMain, () => onAddModeCloseClick());
bindAll(btnAddModeCloseMasuk, () => onAddModeCloseClick());
bindAll(btnAddModeCloseIsignal, () => onAddModeCloseClick());
const btnScanLinkMain = document.getElementById('tf-btn-scanlink-main');
const btnScanPairMain = document.getElementById('tf-btn-scanpair-main');
const btnScanLinkMasuk = document.getElementById('tf-btn-scanlink-masuk');
const btnScanPairMasuk = document.getElementById('tf-btn-scanpair-masuk');
const btnScanLinkIsignal = document.getElementById('tf-btn-scanlink-isignal');
const btnScanPairIsignal = document.getElementById('tf-btn-scanpair-isignal');
const btnRefreshMain = document.getElementById('tf-btn-refresh-main');
const btnRefreshMasuk = document.getElementById('tf-btn-refresh-masuk');
const btnRefreshIsignal = document.getElementById('tf-btn-refresh-isignal');
let __tf_addModePairPopover = null;
let __tf_addModePairPopoverOpen = false;
const tf_getScanPairSelectEl = () => {
try {
return document.getElementById('scan-pair-select');
}
catch (e) {
return null;
}
};
const tf_getSelectablePairs = (selectEl) => {
try {
if (!selectEl)
return [];
const out = [];
Array.from(selectEl.options || []).forEach((o) => {
const v = o && o.value != null ? String(o.value) : '';
if (!v)
return;
if (v === '__ALL__')
return;
out.push(v);
});
return out;
}
catch (e) {
return [];
}
};
const tf_getSelectedPairs = (selectEl) => {
try {
if (!selectEl)
return { isAll: true, values: [] };
const selected = Array.from(selectEl.selectedOptions || []).map((o) => String(o.value));
const isAll = selected.includes('__ALL__') || selected.length === 0;
return { isAll, values: selected.filter((v) => v && v !== '__ALL__') };
}
catch (e) {
return { isAll: true, values: [] };
}
};
const tf_applySelectionToSelect = (selectEl, isAll, values) => {
try {
if (!selectEl)
return;
const set = new Set((values || []).map((v) => String(v)));
Array.from(selectEl.options || []).forEach((o) => {
const v = o && o.value != null ? String(o.value) : '';
if (!v)
return;
if (v === '__ALL__') {
o.selected = !!isAll;
}
else {
o.selected = !isAll && set.has(v);
}
});
if (!isAll) {
const sel = Array.from(selectEl.selectedOptions || []).map((o) => String(o.value));
if (!sel.some((v) => v && v !== '__ALL__')) {
Array.from(selectEl.options || []).forEach((o) => {
if (String(o.value) === '__ALL__')
o.selected = true;
else
o.selected = false;
});
}
}
}
catch (e) { }
};
const tf_saveScanPairSelectionToStorage = (selectEl) => {
try {
if (!hasChromeStorage())
return;
const sel = tf_getSelectedPairs(selectEl);
if (sel.isAll) {
chrome.storage.local.set({ [TF_SCAN_CHANNEL_PAIR_KEY]: '__ALL__', [TF_SCAN_CHANNEL_PAIRS_KEY]: [] }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
else {
const pairs = (sel.values || []).slice(0);
const first = pairs[0] || '__ALL__';
chrome.storage.local.set({ [TF_SCAN_CHANNEL_PAIR_KEY]: first, [TF_SCAN_CHANNEL_PAIRS_KEY]: pairs }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
};
const tf_syncMainScanPairWidgetFromSelect = () => {
try {
const widget = document.getElementById('scan-pair-multiselect');
if (widget && typeof widget.__tf_syncFromSelect === 'function')
widget.__tf_syncFromSelect();
}
catch (e) { }
};
const tf_closeAddModePairPopover = () => {
try {
if (__tf_addModePairPopover) {
try {
const restoreDisabled = __tf_addModePairPopover.dataset && __tf_addModePairPopover.dataset.tfRestoreSelectDisabled === '1';
const selectEl = tf_getScanPairSelectEl();
if (selectEl && restoreDisabled)
selectEl.disabled = true;
}
catch (e) { }
__tf_addModePairPopover.remove();
}
}
catch (e) { }
__tf_addModePairPopover = null;
__tf_addModePairPopoverOpen = false;
};
const tf_openAddModePairPopover = (anchorEl) => {
try {
const selectEl = tf_getScanPairSelectEl();
if (!selectEl)
return;
const restoreSelectDisabled = !!selectEl.disabled;
try {
selectEl.disabled = false;
}
catch (e) { }
if (__tf_addModePairPopoverOpen) {
tf_closeAddModePairPopover();
return;
}
const pairs = tf_getSelectablePairs(selectEl);
const sel = tf_getSelectedPairs(selectEl);
const pop = document.createElement('div');
pop.id = 'tf-addmode-scanpair-popover';
pop.className = 'tf-scanpair-popover';
try {
if (pop.dataset)
pop.dataset.tfRestoreSelectDisabled = restoreSelectDisabled ? '1' : '0';
pop.style.pointerEvents = 'auto';
pop.style.zIndex = '2147483647';
}
catch (e) { }
const title = document.createElement('div');
title.className = 'tf-scanpair-title';
title.textContent = 'Pilih Pair';
pop.appendChild(title);
const mkRow = (value, label, checked) => {
const lab = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.value = value;
cb.checked = !!checked;
lab.appendChild(cb);
const sp = document.createElement('span');
sp.textContent = label;
lab.appendChild(sp);
pop.appendChild(lab);
return cb;
};
const cbAll = mkRow('__ALL__', 'ALL', !!sel.isAll);
const cbMap = new Map();
pairs.forEach((p) => {
const isChecked = !sel.isAll && (sel.values || []).includes(p);
cbMap.set(p, mkRow(p, p, isChecked));
});
const note = document.createElement('div');
note.className = 'tf-scanpair-note';
note.textContent = 'Pair yang dipilih akan dipakai untuk Scan Channel ini.';
pop.appendChild(note);
const applyFromCheckboxes = () => {
const allOn = !!cbAll.checked;
if (allOn) {
cbMap.forEach((cb) => (cb.checked = false));
tf_applySelectionToSelect(selectEl, true, []);
}
else {
const vals = [];
cbMap.forEach((cb, v) => {
if (cb.checked)
vals.push(v);
});
if (!vals.length) {
cbAll.checked = true;
tf_applySelectionToSelect(selectEl, true, []);
}
else {
tf_applySelectionToSelect(selectEl, false, vals);
}
}
tf_saveScanPairSelectionToStorage(selectEl);
try {
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
try {
tf_syncMainScanPairWidgetFromSelect();
}
catch (e) { }
};
pop.addEventListener('change', (ev) => {
const t = ev && ev.target ? ev.target : null;
if (!t || t.tagName !== 'INPUT')
return;
const v = String(t.value || '');
if (v === '__ALL__') {
if (t.checked) {
cbMap.forEach((cb) => (cb.checked = false));
}
}
else {
if (t.checked)
cbAll.checked = false;
}
applyFromCheckboxes();
});
document.body.appendChild(pop);
__tf_addModePairPopover = pop;
__tf_addModePairPopoverOpen = true;
try {
const r = anchorEl && anchorEl.getBoundingClientRect ? anchorEl.getBoundingClientRect() : null;
if (r) {
const top = Math.min(window.innerHeight - 12, r.bottom + 6);
const left = Math.min(window.innerWidth - 12, r.left);
pop.style.top = top + 'px';
pop.style.left = left + 'px';
}
else {
pop.style.top = '80px';
pop.style.left = '12px';
}
}
catch (e) { }
}
catch (e) { }
};
try {
document.addEventListener('click', (ev) => {
if (!__tf_addModePairPopoverOpen)
return;
const t = ev && ev.target ? ev.target : null;
if (!t)
return;
if (t.closest && t.closest('.tf-pairlink'))
return;
if (__tf_addModePairPopover && (__tf_addModePairPopover.contains(t) || (t.closest && t.closest('#tf-addmode-scanpair-popover'))))
return;
tf_closeAddModePairPopover();
}, true);
document.addEventListener('keydown', (ev) => {
if (!__tf_addModePairPopoverOpen)
return;
if (ev && ev.key === 'Escape') {
tf_closeAddModePairPopover();
}
}, true);
}
catch (e) { }
const tf_triggerScanChannel = () => {
try {
try {
tf_setAddModeSecondaryActionsVisible(true);
}
catch (e) { }
try {
const selectEl = tf_getScanPairSelectEl();
if (selectEl)
tf_saveScanPairSelectionToStorage(selectEl);
}
catch (e) { }
try {
tf_saveTimeRange(tf_getCurrentTimeRangeForScan());
}
catch (e) { }
const btn = document.getElementById('scan-btn');
if (btn) {
const wasDisabled = !!btn.disabled;
const previousBypass = btn.dataset ? btn.dataset.tfHyperlinkBypass : undefined;
const previousImportBlocked = btn.dataset ? btn.dataset.tfImportBlocked : undefined;
const previousPointerEvents = btn.style ? btn.style.pointerEvents : '';
if (btn.dataset) {
btn.dataset.tfHyperlinkBypass = '1';
btn.dataset.tfImportBlocked = '0';
}
btn.disabled = false;
try {
btn.removeAttribute('disabled');
btn.style.pointerEvents = 'auto';
}
catch (e) { }
const ev = (typeof MouseEvent === 'function')
? new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
: null;
if (ev)
btn.dispatchEvent(ev);
else
btn.click();
setTimeout(() => {
try {
if (btn.dataset) {
if (typeof previousBypass === 'undefined')
delete btn.dataset.tfHyperlinkBypass;
else
btn.dataset.tfHyperlinkBypass = previousBypass;
if (typeof previousImportBlocked === 'undefined')
delete btn.dataset.tfImportBlocked;
else
btn.dataset.tfImportBlocked = previousImportBlocked;
}
if (btn.style)
btn.style.pointerEvents = previousPointerEvents;
if (wasDisabled || previousImportBlocked === '1')
btn.disabled = true;
}
catch (e) { }
}, 0);
return;
}
const fallback = document.getElementById('batch-scan-isignal-btn') || document.getElementById('batch-scan-btn');
if (fallback) {
const wasDisabled = !!fallback.disabled;
fallback.disabled = false;
fallback.click();
if (wasDisabled)
fallback.disabled = true;
}
}
catch (e) {
try {
tf_setScanHyperlinkStopMode(false, false);
}
catch (err) { }
try {
setStatus('Gagal menjalankan hyperlink Scan Channel ini: ' + (e && e.message ? e.message : String(e)));
}
catch (err) { }
}
};
const tf_reloadDashboardTabs = () => {
try {
const dashUrl = chrome.runtime.getURL('dashboard.html');
const reportUrl = chrome.runtime.getURL('export_table3_pdf.html');
chrome.tabs.query({}, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
(tabs || []).forEach((t) => {
try {
if (!t || !t.id || !t.url)
return;
const u = String(t.url);
if (u === dashUrl || u.startsWith(dashUrl + '?') || u.startsWith(dashUrl + '#')) {
chrome.tabs.reload(t.id);
}
else if (u === reportUrl || u.startsWith(reportUrl + '?') || u.startsWith(reportUrl + '#')) {
chrome.tabs.reload(t.id);
}
}
catch (e) { }
});
});
}
catch (e) { }
};
const tf_softRefresh = () => {
try {
setStatus('Refresh: sinkronisasi data & tampilan...');
}
catch (e) { }
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
// REV206: never inspect an existing TradersFamily tab for login status.
// Always use a fresh disposable root probe, then close it after detection.
chrome.runtime.sendMessage({ type: 'ensure_tf_root' }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
}
catch (e) { }
try {
tf_reloadDashboardTabs();
}
catch (e) { }
try {
setTimeout(() => {
try {
loadPopupStateFromStorage();
}
catch (e) { }
}, 450);
}
catch (e) { }
};
const tf_hardRefreshReset = (finalMessage) => {
const tf_afterStopAndClear = () => {
try {
setStatus('Refresh: menghapus data & reset tampilan...');
}
catch (e) { }
const tf_softResetUiNow = () => {
try {
scui_clearAll();
}
catch (e) { }
try {
tf_addModeEngaged = false;
}
catch (e) { }
try {
tf_addModeSigSet = new Set();
}
catch (e) { }
try {
tf_setAddModeSecondaryActionsVisible(false);
}
catch (e) { }
try {
tf_setTimeRangeLocked(false);
}
catch (e) { }
try {
tf_setStopModeAll(false);
}
catch (e) { }
try {
const b = document.getElementById('scan-from-isignal-btn');
if (b) {
b.disabled = false;
if (b.dataset) {
b.dataset.busy = '0';
b.dataset.tfImportBlocked = '0';
}
if (b.title && /data Import sudah terisi/i.test(b.title))
b.title = '';
}
}
catch (e) { }
try {
tf_applyTimeRangeToUI('all_time');
}
catch (e) { }
try {
tf_refreshAllAnalystPairsUIFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_setUpdateButtonsEnabled(false, false);
}
catch (e) { }
try {
['main', 'masuk', 'isignal'].forEach((k) => {
const bAdd = document.getElementById('tf-btn-add-analyst-' + k);
if (bAdd)
bAdd.disabled = true;
});
}
catch (e) { }
const resetContainer = (id, useGlobalPairs) => {
try {
const c = document.getElementById(id);
if (!c)
return;
const rows = Array.from(c.querySelectorAll('.analyst-row'));
if (rows.length === 0)
return;
rows.slice(1).forEach((r) => { try {
r.remove();
}
catch (e) { } });
const first = rows[0];
try {
tf_forcePasteButtonInRow(first);
}
catch (e) { }
const input = first.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
}
const sel = first.querySelector('.analyst-pair-select');
if (sel) {
const opts = Array.from(sel.options || []);
opts.forEach((o) => { try {
o.selected = false;
}
catch (e) { } });
const allOpt = opts.find((o) => String(o.value) === ALL_PAIR_OPTION_VALUE);
if (allOpt)
allOpt.selected = true;
sel.disabled = false;
}
const rm = first.querySelector('.analyst-remove-btn');
if (rm)
rm.disabled = false;
try {
tf_applyImportLockToContainer(c, 0);
}
catch (e) { }
}
catch (e) { }
};
resetContainer('analyst-links-container', true);
resetContainer('isignal-links-container', true);
try {
const cb = document.getElementById('remember-all-links-checkbox');
if (cb)
cb.checked = true;
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
try {
// Jangan menghapus container Progress Scan. Container ini menyimpan scaffold
// Overall dan Batch; mengosongkan outer container membuat event progress
// berikutnya tidak mempunyai target render.
hbui_clearAll();
scui_clearAll();
scui_getListEls();
[
  'scan-channel-saved-list',
  'scan-channel-saved-list-isignal'
].forEach((id) => {
const savedList = document.getElementById(id);
if (savedList)
savedList.innerHTML = '';
});
}
catch (e) { }
try {
setStatus(finalMessage || 'Refresh selesai. Silakan Import file lagi atau Scan baru.');
}
catch (e) { }
try {
tf_setRefreshButtonsLoading(false);
}
catch (e) { }
try {
tf_updateExportButtonsEnabledFromStorage();
}
catch (e) { }
};
try {
const fi = document.getElementById('tf-import-file');
if (fi)
fi.value = '';
}
catch (e) { }
;
try {
if (typeof localStorage !== 'undefined') {
try {
localStorage.clear();
}
catch (e) {
try {
Object.keys(localStorage).forEach((k) => {
if ((k || '').toString().startsWith('tf')) {
try {
localStorage.removeItem(k);
}
catch (err) { }
}
});
}
catch (err2) { }
}
}
}
catch (e) { }
if (!hasChromeStorage()) {
tf_softResetUiNow();
tf_reloadDashboardTabs();
return;
}
try {
const preserveKeys = [
  'tfUserProfile',
  'tfStableProfileEmail',
  'tfRememberLogin',
  'tfAuth',
  'tfAuthToken',
  'tfAuthFlowToken',
  'tfAuthTokenSeen',
  'tfRootLoginState',
  'tfRootLoginStateAt',
  'tfAccountLoginState',
  'tfAccountLoginStateAt',
  'tfLoginConfirmed',
  'tfLoginConfirmedAt',
  'tfPendingLogin',
  'tfPendingGoogleLogin',
  'tfCaptchaNeeded',
  'tfCaptchaSolved',
  'tfLoggedOut',
  'tfLoginError',
  'tfLogoutSuccess',
  'tfDoStandardLogin',
  'tfForceLoginForm',
  'tfEnterMainAfterLogin',
  'tfEnteredMain',
  'tfShownMainOnceThisLogin',
  'tfCurrentProfileUrl',
  'tfGoogleClickedAt',
  'tfLicenseCredentials',
  'tfLicenseDeviceId',
  'tfLicenseState',
  'tfLicenseServerHealth',
  'tfDeviceLockStateV1',
  'tfDeviceSessionTokenV1',
  'tfDevicePendingClientV1',
  'tfDevicePendingApprovalV1',
  'tfDeviceActivationTraceV1',
  'tfDeviceApprovedTransferV1',
  'tfDeviceApprovalPopupShownV1',
  // REV369: Refresh / Reset is a data reset, not a license reset.
  // Preserve the per-build activation receipt so dashboard reloads do not
  // incorrectly ask for Email + Token again on the same installed build.
  'tfManualBuildActivationV1',
  'tfRemoteAlwaysOnlineV276'
  ];
chrome.storage.local.get(null, (allStored) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const all = allStored && typeof allStored === 'object' ? allStored : {};
const preserveSet = new Set(preserveKeys);
const removeKeys = Object.keys(all).filter((key) => !preserveSet.has(key));
const finishReset = () => {
try {
tf_softResetUiNow();
}
catch (e) { }
try {
tf_reloadDashboardTabs();
}
catch (e) { }
};
if (!removeKeys.length) {
finishReset();
return;
}
chrome.storage.local.remove(removeKeys, () => {
try {
if (chrome.runtime.lastError) {
setStatus('Gagal menghapus sebagian data: ' + chrome.runtime.lastError.message);
return;
}
}
catch (e) { }
finishReset();
});
});
}
catch (e) {
tf_softResetUiNow();
tf_reloadDashboardTabs();
}
};
try {
let done = false;
const go = () => {
if (done)
return;
done = true;
try {
tf_afterStopAndClear();
}
catch (e) {
try {
tf_afterStopAndClear();
}
catch (err) { }
}
};
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({ type: 'stopBatchScan', reason: 'refresh' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
go();
});
setTimeout(() => { go(); }, 900);
return;
}
}
catch (e) { }
go();
}
catch (e) {
try {
tf_afterStopAndClear();
}
catch (err) { }
}
};
const tf_onScanChannelHyperlinkClick = (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
try {
const sourceBtn = e && e.currentTarget ? e.currentTarget : null;
if (sourceBtn && sourceBtn.disabled && !tf_isScanHyperlinkStopMode()) {
setStatus('Scan Channel ini hanya aktif setelah Import file.');
return;
}
}
catch (err) { }
try {
tf_setAddModeSecondaryActionsVisible(true);
}
catch (err) { }
try {
if (tf_isScanHyperlinkStopMode()) {
const sourceBtn = e && e.currentTarget ? e.currentTarget : null;
if (sourceBtn && sourceBtn.dataset && sourceBtn.dataset.tfScanStopping === '1')
return;
tf_setScanHyperlinkStopMode(true, true);
setStatus('Stopping... hasil scan sementara sedang dibuang.');
tf_sendStopProgress((r) => {
try {
if (!r || r.ok === false) {
tf_setScanHyperlinkStopMode(false, false);
setStatus('Gagal menghentikan scan: ' + ((r && r.error) ? r.error : 'unknown'));
}
}
catch (err2) { }
});
return;
}
}
catch (err) { }
try {
tf_setScanHyperlinkStopMode(true, false);
}
catch (err) { }
tf_triggerScanChannel();
};
bindAll(btnScanLinkMain, tf_onScanChannelHyperlinkClick);
bindAll(btnScanLinkMasuk, tf_onScanChannelHyperlinkClick);
bindAll(btnScanLinkIsignal, tf_onScanChannelHyperlinkClick);
const tf_refreshDataAndUiOnly = () => {
try {
tf_setRefreshButtonsLoading(true);
}
catch (e) { }
try {
setStatus('Refresh: reset data dan tampilan tanpa pengecekan aktivasi...');
}
catch (e) { }
tf_hardRefreshReset('Refresh selesai. Status aktivasi tidak diperiksa ulang.');
};
bindAll(btnRefreshMain, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
tf_refreshDataAndUiOnly();
});
bindAll(btnRefreshMasuk, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
tf_refreshDataAndUiOnly();
});
bindAll(btnRefreshIsignal, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
tf_refreshDataAndUiOnly();
});
bindAll(btnScanPairMain, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
try {
if (!btnScanPairMain || btnScanPairMain.disabled) {
setStatus('Pair hanya aktif setelah Import file.');
return;
}
tf_setAddModeSecondaryActionsVisible(true);
tf_openAddModePairPopover(btnScanPairMain);
}
catch (err) { }
});
bindAll(btnScanPairMasuk, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
try {
if (!btnScanPairMasuk || btnScanPairMasuk.disabled) {
setStatus('Pair hanya aktif setelah Import file.');
return;
}
tf_setAddModeSecondaryActionsVisible(true);
tf_openAddModePairPopover(btnScanPairMasuk);
}
catch (err) { }
});
bindAll(btnScanPairIsignal, (e) => {
try {
if (e) {
e.preventDefault();
e.stopPropagation();
}
}
catch (err) { }
try {
if (!btnScanPairIsignal || btnScanPairIsignal.disabled) {
setStatus('Pair hanya aktif setelah Import file.');
return;
}
tf_setAddModeSecondaryActionsVisible(true);
tf_openAddModePairPopover(btnScanPairIsignal);
}
catch (err) { }
});
const onSubmitClick = async (btn) => {
if (!btn || btn.disabled) return;
setStatus('Submit: memeriksa session login TradersFamily terbaru...');
let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('submit_shortcut', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { buttonId: btn.id || 'tf-btn-submit-main' });
} else {
setStatus('Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.');
}
return;
}
setStatus('Submit: login valid ✓ — memuat data dari file Import & membuka dashboard...');
openOrReloadDashboard({ activate: true });
};
bindAll(btnSubmitMain, () => { void onSubmitClick(btnSubmitMain); });
bindAll(btnSubmitMasuk, () => { void onSubmitClick(btnSubmitMasuk); });
bindAll(btnSubmitIsignal, () => { if (!btnSubmitIsignal.disabled) batchIsignalBtn?.click(); });
window.__tfResumePendingActionAfterLogin = () => {
if (__tfResumeAfterLoginBusy || !hasChromeStorage()) return;
__tfResumeAfterLoginBusy = true;
chrome.storage.local.get([TF_RESUME_AFTER_LOGIN_KEY], (d) => {
try {
const pending = d && d[TF_RESUME_AFTER_LOGIN_KEY] ? d[TF_RESUME_AFTER_LOGIN_KEY] : null;
const age = pending && pending.createdAt ? (Date.now() - Number(pending.createdAt || 0)) : Number.MAX_SAFE_INTEGER;
if (!pending || !pending.action || age > 15 * 60 * 1000) {
chrome.storage.local.remove([TF_RESUME_AFTER_LOGIN_KEY], () => { });
__tfResumeAfterLoginBusy = false;
return;
}
chrome.storage.local.remove([TF_RESUME_AFTER_LOGIN_KEY], () => { });
const action = String(pending.action || '');
const extra = pending.extra && typeof pending.extra === 'object' ? pending.extra : {};
setStatus('Login berhasil ✓ — melanjutkan proses ' + (action.indexOf('update') >= 0 ? 'Update' : 'Submit') + ' otomatis...');
setTimeout(() => {
try {
if (action === 'update') {
const b = btnUpdateMain || btnUpdateMasuk || btnUpdateIsignal;
if (b) void onUpdateClick(b);
} else if (action === 'submit_shortcut') {
const b = document.getElementById(String(extra.buttonId || '')) || btnSubmitMain || btnSubmitMasuk || btnSubmitIsignal;
if (b) void onSubmitClick(b);
} else if (action === 'dashboardSubmit') {
if (batchBtn) batchBtn.click();
} else if (action === 'isignalSubmit') {
if (batchIsignalBtn) batchIsignalBtn.click();
}
}
catch (e) { setStatus('Gagal melanjutkan proses otomatis setelah login: ' + String(e && e.message ? e.message : e)); }
finally { __tfResumeAfterLoginBusy = false; }
}, 650);
}
catch (e) { __tfResumeAfterLoginBusy = false; }
});
};
if (tfImportFileInput) {
tfImportFileInput.addEventListener('change', () => {
const files = Array.from(tfImportFileInput.files || []);
if (!files.length)
return;
const originalImportFiles = new Map();
const readOne = (file) => new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => {
const txt = reader.result ? String(reader.result) : '';
const parsed = tf_safeJsonParse(txt);
if (!parsed) {
reject(new Error('JSON tidak valid / rusak: ' + String(file && file.name ? file.name : 'file') + '. Periksa encoding atau export ulang file.'));
return;
}
originalImportFiles.set(file,{name:String(file.name||'file.json'),text:txt});
resolve(parsed);
};
reader.onerror = () => reject(new Error('Gagal membaca: ' + String(file && file.name ? file.name : 'file')));
reader.readAsText(file);
});
(async () => {
try {
setStatus(files.length > 1 ? ('Membaca ' + String(files.length) + ' file JSON untuk digabungkan...') : 'Membaca file Import...');
const payloads = await Promise.all(files.map(readOne));
let parsed = payloads[0];
if (payloads.length > 1) {
const ok = confirm('Gabungkan ' + String(payloads.length) + ' file JSON?\n\nData History, Statistics, Link Analis, dan selector Pair akan digabungkan serta didedup. File pertama menjadi pengaturan utama.');
if (!ok) {
setStatus('Combine JSON dibatalkan.');
return;
}
parsed = tf_combineImportPayloads(payloads, files.map((f) => f.name || 'file.json'));
if (!parsed)
throw new Error('Gagal menggabungkan file JSON.');
}
await new Promise((resolve,reject)=>chrome.storage.local.set({tfImportOriginalFilesV444:{importedAt:new Date().toISOString(),files:files.map(file=>originalImportFiles.get(file))}},()=>{const error=chrome.runtime.lastError;if(error)reject(new Error('Gagal menyimpan arsip JSON asli: '+error.message));else resolve();}));
tf_importPayloadToStorage(parsed, () => {
try {
tf_setUpdateButtonsEnabled(true, false);
}
catch (e) { }
// REV402: saved-channel rendering is already scheduled once by tf_importPayloadToStorage.
try {
const ownerCount = files.length > 1 && parsed && Array.isArray(parsed.exportedByList) ? parsed.exportedByList.length : 0;
setStatus(files.length > 1 ? ('Combine ' + String(files.length) + ' JSON selesai ✅' + (ownerCount ? (' • Scanned by: ' + String(ownerCount) + ' user') : '')) : 'Import selesai ✅');
}
catch (e) { }
// REV292: immediately pre-stage the authoritative PC snapshot to private Drive in background.
// This never blocks Import UI and is used only for future PC->Mobile mirror sync, not explicit Export JSON.
try {
setTimeout(() => {
try { window.dispatchEvent(new CustomEvent('tf-remote-prewarm-drive-v292',{detail:{reason:'import-combine',at:Date.now()}})); } catch (e) { }
}, 1400);
} catch (e) { }
});
}
catch (err) {
alert(err && err.message ? err.message : 'Gagal membaca file JSON.');
setStatus('Import / Combine gagal.');
}
})();
});
}
try {
tf_syncUpdateButtonsEnabledFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
try {
tf_updateExportButtonsEnabledFromStorage();
}
catch (e) { }
if (analystLinksContainer) {
const rows = analystLinksContainer.querySelectorAll('.analyst-row');
rows.forEach((row) => {
const sel = row.querySelector('.analyst-pair-select');
if (sel) {
initAnalystPairSelect(sel);
}
initPairMultiSelectForRow(row);
});
}
if (isignalBackLink) {
isignalBackLink.addEventListener('click', (e) => {
try {
e.preventDefault();
}
catch (err) { }
try {
showDashboardSubview();
}
catch (err) { }
setIsignalStatus('');
try {
tf_populateIsignalRows([]);
}
catch (err) { }
});
}
if (isignalLinksContainer) {
isignalLinksContainer.addEventListener('click', async (event) => {
const removeBtn = event && event.target ? event.target.closest('.analyst-remove-btn') : null;
if (removeBtn) {
try {
event.preventDefault();
event.stopPropagation();
}
catch (e) { }
const row = removeBtn.closest('.analyst-row');
if (!row)
return;
const okDel = await tf_confirmDeleteAnalyst();
if (!okDel)
return;
let deleteInfo = null;
try {
deleteInfo = await tf_deleteStoredDataForAnalystRow(row);
}
catch (e) { }
try {
const deletedKey = deleteInfo && deleteInfo.urlKey ? deleteInfo.urlKey : tf_normUrlKey(row.querySelector('.analyst-link-input') && row.querySelector('.analyst-link-input').value ? row.querySelector('.analyst-link-input').value : '');
tf_removeMatchingAnalystUrlFromOtherUiRows(deletedKey, row);
}
catch (e) { }
const allRows = Array.from(isignalLinksContainer.querySelectorAll('.analyst-row'));
if (allRows.length <= 1) {
const input = row.querySelector('.analyst-link-input');
if (input)
input.value = '';
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn)
nameBtn.textContent = '-';
const sel = row.querySelector('.analyst-pair-select');
try {
if (sel)
tf_applyPairsArrayToSelect(sel, tf_getAllAnalystPairsCachedIsignal());
}
catch (e) { }
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
try {
saveRememberedAnalystLinks();
tf_updateExportButtonsEnabledFromStorage();
tf_maybeExitAddModeAfterRowRemoval();
}
catch (e) { }
return;
}
row.remove();
try {
saveRememberedAnalystLinks();
tf_updateExportButtonsEnabledFromStorage();
tf_maybeExitAddModeAfterRowRemoval();
}
catch (e) { }
return;
}
const nameBtnClick = event && event.target ? event.target.closest('.analyst-name-btn') : null;
if (nameBtnClick) {
const r = nameBtnClick.closest('.analyst-row');
const inp = r ? r.querySelector('.analyst-link-input') : null;
const raw = inp && inp.value ? String(inp.value).trim() : '';
const norm = tf_normalizeTfAccountUrl(raw) || raw;
if (norm) {
try {
if (typeof chrome !== 'undefined' && chrome.tabs)
chrome.tabs.create({ url: norm, active: true });
else
window.open(norm, '_blank');
}
catch (e) {
try {
window.open(norm, '_blank');
}
catch (e2) { }
}
}
else {
try {
setIsignalStatus('Link channel kosong / tidak valid.');
}
catch (e) { }
}
return;
}
const pasteBtn = event && event.target ? event.target.closest('.analyst-paste-btn') : null;
if (!pasteBtn)
return;
const row = pasteBtn.closest('.analyst-row');
if (!row)
return;
const input = row.querySelector('.analyst-link-input');
if (!input)
return;
try {
input.focus();
}
catch (e) { }
if (!navigator.clipboard || !navigator.clipboard.readText) {
setIsignalStatus('Clipboard tidak bisa diakses otomatis. Tekan Ctrl+V di kolom ini jika perlu.');
return;
}
navigator.clipboard.readText()
.then((text) => {
if (!text) {
setIsignalStatus('Clipboard kosong. Copy dulu link analisnya, lalu klik Paste.');
return;
}
const norm = tf_normalizeTfAccountUrl(text);
if (!norm) {
setIsignalStatus('Link tidak valid. Pastikan link mengandung https://account.tradersfamily.id/ dan path /channels/.');
return;
}
input.value = norm;
})
.catch((err) => {
setIsignalStatus('Gagal baca clipboard. Coba Ctrl+V manual.');
try {
console.warn('Clipboard readText error', err);
}
catch (e) { }
});
});
}
if (scanFromIsignalBtn) {
scanFromIsignalBtn.addEventListener('click', async () => {
try {
if (scanFromIsignalBtn.dataset && scanFromIsignalBtn.dataset.tfImportBlocked === '1') {
setStatus('Scan From iSignal dikunci. Klik hyperlink Refresh terlebih dahulu.');
return;
}
if (scanFromIsignalBtn.dataset && scanFromIsignalBtn.dataset.busy === '1')
return;
if (scanFromIsignalBtn.dataset)
scanFromIsignalBtn.dataset.busy = '1';
}
catch (e) { }
try {
showIsignalSubview();
setIsignalStatus('Membuka halaman iSignal...');
setStatus('Membuka halaman iSignal...');
const url = 'https://account.tradersfamily.id/channels/isignal/';
let tabId = null;
let res = null;
try {
const opened = await tf_openTabWaitComplete(url, true, 25000);
tabId = opened && opened.tabId ? opened.tabId : null;
await tf_waitContentReady(tabId, 15000);
for (let i = 0; i < 4; i++) {
const { response, error } = await tf_sendMessageToTab(tabId, { type: 'scanIsignalActiveChannels' });
if (!error && response) {
res = response;
break;
}
if (error && /Receiving end does not exist|Could not establish connection/i.test(error)) {
await tf_delayMs(550);
continue;
}
if (error)
throw new Error(error);
await tf_delayMs(550);
}
}
finally {
if (tabId) {
try {
chrome.tabs.remove(tabId, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
}
if (!res || !res.ok) {
const errMsg = res && res.error ? res.error : 'Gagal scan iSignal (no response)';
setIsignalStatus(errMsg);
setStatus(errMsg);
tf_populateIsignalRows([]);
return;
}
const items = Array.isArray(res.items) ? res.items : [];
tf_populateIsignalRows(items);
const msg = 'Done. Ditemukan ' + items.length + ' channel iSignal yang Aktif.';
setIsignalStatus(msg);
setStatus(msg);
}
catch (err) {
const errMsg = err && err.message ? err.message : String(err);
setIsignalStatus('Error: ' + errMsg);
setStatus('Error: ' + errMsg);
try {
tf_populateIsignalRows([]);
}
catch (e) { }
}
finally {
try {
if (scanFromIsignalBtn.dataset)
scanFromIsignalBtn.dataset.busy = '0';
}
catch (e) { }
}
});
}
if (scanBtn) {
scanBtn.addEventListener('click', () => {
const hyperlinkBypass = !!(scanBtn.dataset && scanBtn.dataset.tfHyperlinkBypass === '1');
const resetHyperlinkUi = () => {
try {
if (hyperlinkBypass)
tf_setScanHyperlinkStopMode(false, false);
}
catch (e) { }
};
const cleanupPendingRowOnAbort = (sessionId) => {
try {
if (!hyperlinkBypass)
return false;
const removed = tf_removePendingAddAnalystRowForScan(__tfLastScanChannelMeta, sessionId || '');
__tfLastScanChannelMeta = null;
return !!removed;
}
catch (e) {
return false;
}
};
if (scanBtn.dataset && scanBtn.dataset.tfImportBlocked === '1' && !hyperlinkBypass) {
setStatus('Scan Channel ini dikunci. Gunakan hyperlink Scan Channel ini di atas atau klik Refresh.');
return;
}
if (tf_isStopMode(scanBtn)) {
setStatus('Stopping progress...');
tf_sendStopProgress(() => { });
try {
if (tf_activeSingleScanUiSessionId) {
scui_update(tf_activeSingleScanUiSessionId, { stateText: 'Stopped', total: 1, current: 0 });
}
}
catch (e) { }
tf_activeSingleScanTabId = null;
tf_activeSingleScanUiSessionId = null;
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
setStatus('Stopped.');
return;
}
const pairs = getSelectedPairsFromSelect(scanPairSelect);
const pairLabelForRow = tf_getPairLabelForScan(scanPairSelect, pairs);
const uiSessionId = scui_createSession({ pairLabel: pairLabelForRow });
tf_activeSingleScanUiSessionId = uiSessionId;
const initialTotal = (pairs && pairs.length) ? pairs.length : 1;
scui_update(uiSessionId, { total: initialTotal, current: 0 });
if (!pairs || !pairs.length) {
setStatus('Scanning channel ini (tanpa filter pair)...');
}
else if (pairs.length === 1) {
setStatus('Scanning channel ini... Pair: ' + pairs[0]);
}
else {
setStatus('Scanning channel ini... Multi Pair: ' + pairs.length + ' (buka banyak tab)');
}
const pickChannelTab = (cb) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const t = tabs && tabs[0] ? tabs[0] : null;
if (t && t.id) {
cb({ tabId: t.id, url: (t.url ? String(t.url) : '') });
return;
}
cb(null);
});
}
catch (e) {
cb(null);
}
};
pickChannelTab((picked) => {
if (!picked || !picked.tabId) {
try {
scui_update(uiSessionId, { stateText: 'Invalid' });
}
catch (e) { }
setStatus('INVALID: Tidak ada tab aktif yang bisa di-scan.');
resetHyperlinkUi();
tf_activeSingleScanUiSessionId = null;
return;
}
const rawUrl = picked.url ? String(picked.url) : '';
if (!rawUrl) {
try {
scui_update(uiSessionId, { stateText: 'Invalid' });
}
catch (e) { }
setStatus('INVALID: Tab aktif tidak memiliki URL yang bisa di-scan.');
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
resetHyperlinkUi();
tf_activeSingleScanUiSessionId = null;
return;
}
let url = rawUrl;
const strictUrl = tf_strictActiveTabChannelUrl(url);
if (!strictUrl) {
try {
scui_update(uiSessionId, { stateText: 'Invalid' });
}
catch (e) { }
setStatus('INVALID: Tab aktif harus berada di halaman channel TradersFamily yang valid, contoh: https://account.tradersfamily.id/channels/<id>.');
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
resetHyperlinkUi();
tf_activeSingleScanUiSessionId = null;
return;
}
url = strictUrl;
let pendingRowToken = '';
try {
if (hyperlinkBypass)
pendingRowToken = tf_bindLatestPendingAddAnalystRowToScan(uiSessionId);
}
catch (e) {
pendingRowToken = '';
}
try {
__tfLastScanChannelMeta = {
url,
pairs: Array.isArray(pairs) ? pairs.slice() : [ALL_PAIR_OPTION_VALUE],
at: Date.now(),
uiSessionId,
pendingRowToken
};
}
catch (e) { }
try {
if (picked.tabId) {
chrome.tabs.sendMessage(picked.tabId, { type: 'getAnalystName' }, (r) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (r && r.ok && r.analystName) {
scui_update(uiSessionId, { analystName: r.analystName });
}
});
}
}
catch (e) { }
tf_activeSingleScanTabId = null;
try {
tf_setStopMode(scanBtn, true);
}
catch (e) { }
try {
tf_keepaliveOpen();
}
catch (e) { }
const filteredChannels = tf_filterChannelsByAddMode([{ name: 'Channel ini', url, pairs }]);
const effectiveTotal = (() => {
try {
const ch0 = filteredChannels && filteredChannels[0] ? filteredChannels[0] : null;
const pr = ch0 && Array.isArray(ch0.pairs) ? ch0.pairs : [];
if (!pr.length)
return 1;
if (pr.includes('__ALL__'))
return 1;
return pr.length;
}
catch (e) {
return 1;
}
})();
try {
scui_update(uiSessionId, { total: effectiveTotal, current: 0 });
}
catch (e) { }
if (!filteredChannels || !filteredChannels.length) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
try {
scui_update(uiSessionId, { stateText: 'Skipped', total: 1, current: 1 });
}
catch (e) { }
const removedPendingRow = cleanupPendingRowOnAbort(uiSessionId);
setStatus('Skip: analis-pair sudah ada / duplikat (tidak perlu scan ulang).' + (removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : ''));
resetHyperlinkUi();
tf_activeSingleScanUiSessionId = null;
return;
}
tf_sendStartBatchScanWithSelectedTimeRange({
type: 'startBatchScan',
origin: hyperlinkBypass ? 'scanChannelHyperlink' : 'scanChannelButton',
uiSessionId,
channels: filteredChannels
}, (res) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (chrome.runtime.lastError) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
tf_activeSingleScanUiSessionId = null;
try {
scui_markError(uiSessionId, chrome.runtime.lastError.message);
}
catch (e) { }
const removedPendingRow = cleanupPendingRowOnAbort(uiSessionId);
setStatus('Gagal start scan: ' + chrome.runtime.lastError.message + (removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : ''));
resetHyperlinkUi();
return;
}
if (!res || !res.ok) {
const em = (res && res.error) ? res.error : 'unknown';
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(scanBtn, false);
}
catch (e) { }
tf_activeSingleScanUiSessionId = null;
try {
scui_markError(uiSessionId, em);
}
catch (e) { }
const removedPendingRow = cleanupPendingRowOnAbort(uiSessionId);
setStatus('Gagal start scan: ' + em + (removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : ''));
resetHyperlinkUi();
return;
}
setStatus('Scan dimulai...');
});
});
});
}
if (batchBtn) {
batchBtn.addEventListener('click', async () => {
if (tf_isStopMode(batchBtn)) {
setStatus('Stopping progress...');
tf_sendStopProgress(() => {
try {
tf_setStopMode(batchBtn, false);
}
catch (e) { }
setStatus('Stopped.');
});
return;
}
let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('dashboardSubmit', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { source: 'dashboard_submit_preflight' });
} else {
setStatus('Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.');
}
return;
}
if (!analystLinksContainer) {
setStatus('Container Link Analis tidak ditemukan.');
return;
}
const rows = Array.from(analystLinksContainer.querySelectorAll('.analyst-row'));
const channels = [];
let invalidCount = 0;
rows.forEach((row) => {
if (!row)
return;
try {
if (row.dataset && row.dataset.tfLocked === '1')
return;
}
catch (e) { }
const input = row.querySelector('.analyst-link-input');
const select = row.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl) {
invalidCount += 1;
return;
}
try {
if (input)
input.value = normUrl;
}
catch (e) { }
const pairs = getSelectedPairsFromSelect(select);
channels.push({ url: normUrl, pairs });
});
if (!channels.length) {
if (invalidCount > 0) {
setStatus('Tidak ada Link Analis yang valid. Harus mulai dengan https://account.tradersfamily.id/channels/ ... (invalid: ' + invalidCount + ')');
}
else {
setStatus('Isi minimal satu Link Analis sebelum menekan Submit.');
}
return;
}
saveRememberedAnalystLinks();
const filteredChannels = tf_filterChannelsByAddMode(channels);
if (!filteredChannels || !filteredChannels.length) {
setStatus('Skip: semua analis-pair yang dipilih sudah ada / duplikat (tidak perlu scan ulang).');
return;
}
setStatus('Memulai scan berdasarkan Link Analis yang kamu input (' + filteredChannels.length + ' analis valid' + (invalidCount ? (', skip invalid: ' + invalidCount) : '') + ')...');
if (!chrome || !chrome.runtime) {
setStatus('chrome.runtime tidak tersedia.');
return;
}
try {
tf_setStopMode(batchBtn, true);
}
catch (e) { }
try {
tf_keepaliveOpen();
}
catch (e) { }
tf_sendStartBatchScanWithSelectedTimeRange({ type: 'startBatchScan', origin: 'dashboardSubmit', channels: filteredChannels }, (response) => {
if (chrome.runtime.lastError) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchBtn, false);
}
catch (e) { }
setStatus('Batch scan error: ' + chrome.runtime.lastError.message);
return;
}
if (!response) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchBtn, false);
}
catch (e) { }
setStatus('Batch scan error: no response.');
return;
}
if (!response.ok) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchBtn, false);
}
catch (e) { }
setStatus('Batch scan error: ' + (response.error || 'unknown'));
return;
}
setStatus('Batch scan dimulai... (status akan update otomatis)');
});
});
}
if (batchIsignalBtn) {
batchIsignalBtn.addEventListener('click', async () => {
if (tf_isStopMode(batchIsignalBtn)) {
const msg = 'Stopping progress...';
setIsignalStatus(msg);
setStatus(msg);
tf_sendStopProgress(() => {
try {
tf_setStopMode(batchIsignalBtn, false);
}
catch (e) { }
const doneMsg = 'Stopped.';
setIsignalStatus(doneMsg);
setStatus(doneMsg);
});
return;
}
let loginCheck = null;
try { loginCheck = await tf_verifyFreshLoginBeforeUpdate(); }
catch (e) { loginCheck = { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR' }; }
if (!loginCheck || loginCheck.loggedIn !== true || loginCheck.ok !== true) {
const definitelyLoggedOut = !!(loginCheck && (loginCheck.loggedOut === true || loginCheck.state === 'logged_out' || loginCheck.code === 'TF_SESSION_EXPIRED'));
if (definitelyLoggedOut) {
tf_forceLoginViewForResume('isignalSubmit', 'Session TradersFamily sudah berakhir. Silakan login kembali. Setelah login berhasil Submit akan dilanjutkan otomatis.', { source: 'isignal_submit_preflight' });
} else {
const msg = 'Submit ditunda: status login terbaru belum dapat diverifikasi. Periksa koneksi lalu coba lagi.';
setIsignalStatus(msg); setStatus(msg);
}
return;
}
const channels = tf_collectChannelsFromContainer(isignalLinksContainer);
if (!channels.length) {
const msg = 'Tidak ada Link Analis hasil iSignal. Klik "Scan From iSignal" dulu.';
setIsignalStatus(msg);
setStatus(msg);
return;
}
const filteredChannels = tf_filterChannelsByAddMode(channels);
if (!filteredChannels || !filteredChannels.length) {
const msg = 'Skip: semua analis-pair hasil iSignal sudah ada / duplikat.';
setIsignalStatus(msg);
setStatus(msg);
return;
}
setIsignalStatus('Memulai scan berdasarkan hasil iSignal (' + filteredChannels.length + ' analis)...');
setStatus('Memulai scan berdasarkan hasil iSignal (' + filteredChannels.length + ' analis)...');
if (!chrome || !chrome.runtime) {
const msg = 'chrome.runtime tidak tersedia.';
setIsignalStatus(msg);
setStatus(msg);
return;
}
try {
tf_setStopMode(batchIsignalBtn, true);
}
catch (e) { }
try {
tf_keepaliveOpen();
}
catch (e) { }
tf_sendStartBatchScanWithSelectedTimeRange({ type: 'startBatchScan', origin: 'isignalSubmit', channels: filteredChannels }, (response) => {
if (chrome.runtime.lastError) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchIsignalBtn, false);
}
catch (e) { }
const msg2 = 'Batch scan error: ' + chrome.runtime.lastError.message;
setIsignalStatus(msg2);
setStatus(msg2);
return;
}
if (!response) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchIsignalBtn, false);
}
catch (e) { }
const msg2 = 'Batch scan error: no response.';
setIsignalStatus(msg2);
setStatus(msg2);
return;
}
if (!response.ok) {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_setStopMode(batchIsignalBtn, false);
}
catch (e) { }
const msg2 = 'Batch scan error: ' + (response.error || 'unknown');
setIsignalStatus(msg2);
setStatus(msg2);
return;
}
const msg2 = 'Batch scan dimulai... (status akan update otomatis)';
setIsignalStatus(msg2);
setStatus(msg2);
});
});
}
if (openDashboardBtn) {
openDashboardBtn.addEventListener('click', () => {
openOrReloadDashboard();
});
}
if (clearDataBtn) {
clearDataBtn.addEventListener('click', () => {
if (!hasChromeStorage()) {
setStatus('chrome.storage.local tidak tersedia.');
return;
}
let confirmBar = document.getElementById('clear-data-confirm-bar');
if (!confirmBar) {
confirmBar = document.createElement('div');
confirmBar.id = 'clear-data-confirm-bar';
confirmBar.style.marginTop = '8px';
confirmBar.style.display = 'flex';
confirmBar.style.flexDirection = 'column';
confirmBar.style.alignItems = 'flex-start';
confirmBar.style.gap = '3.6px';
const label = document.createElement('span');
label.textContent = 'Hapus semua data tersimpan?';
label.style.fontSize = '9.9px';
const buttonsRow = document.createElement('div');
buttonsRow.style.display = 'flex';
buttonsRow.style.gap = '5.4px';
const btnNo = document.createElement('button');
btnNo.type = 'button';
btnNo.textContent = 'No';
btnNo.className = 'btn secondary';
btnNo.style.padding = '2px 8px';
btnNo.style.fontSize = '9.9px';
btnNo.onclick = () => {
confirmBar.remove();
};
const btnYes = document.createElement('button');
btnYes.type = 'button';
btnYes.textContent = 'Confirm';
btnYes.className = 'btn danger';
btnYes.style.padding = '2px 8px';
btnYes.style.fontSize = '9.9px';
btnYes.onclick = () => {
try {
btnYes.disabled = true;
btnNo.disabled = true;
}
catch (e) { }
try {
confirmBar.remove();
}
catch (e) { }
setStatus('Menghentikan proses aktif dan menghapus seluruh data scan...');
tf_hardRefreshReset('Semua data scan tersimpan sudah dihapus. Aktivasi dan login tetap tersimpan.');
};
buttonsRow.appendChild(btnNo);
buttonsRow.appendChild(btnYes);
confirmBar.appendChild(label);
confirmBar.appendChild(buttonsRow);
if (clearDataBtn.parentNode) {
clearDataBtn.parentNode.insertBefore(confirmBar, clearDataBtn.nextSibling);
}
}
});
}
if (logoutBtn) {
logoutBtn.addEventListener('click', () => {
let confirmBar = document.getElementById('logout-confirm-bar');
if (!confirmBar) {
confirmBar = document.createElement('div');
confirmBar.id = 'logout-confirm-bar';
confirmBar.style.marginTop = '8px';
confirmBar.style.display = 'flex';
confirmBar.style.flexDirection = 'column';
confirmBar.style.alignItems = 'flex-start';
confirmBar.style.gap = '3.6px';
const label = document.createElement('span');
label.textContent = 'Logout (Keluar akun TF)?';
label.style.fontSize = '9.9px';
const buttonsRow = document.createElement('div');
buttonsRow.style.display = 'flex';
buttonsRow.style.gap = '5.4px';
const btnNo = document.createElement('button');
btnNo.type = 'button';
btnNo.textContent = 'No';
btnNo.className = 'btn secondary';
btnNo.style.padding = '2px 8px';
btnNo.style.fontSize = '9.9px';
btnNo.onclick = () => {
confirmBar.remove();
};
const btnYes = document.createElement('button');
btnYes.type = 'button';
btnYes.textContent = 'Logout';
btnYes.className = 'btn danger';
btnYes.style.padding = '2px 8px';
btnYes.style.fontSize = '9.9px';
btnYes.onclick = () => {
tf__loginFlow = 'logout';
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'logout_' + Math.random().toString(36).slice(2) + '_' + Date.now();
try {
if (hasChromeStorage()) {
const logoutAt = Date.now();
chrome.storage.local.set({
tfLogoutSuccess: false,
tfLogoutSuccessAt: 0,
tfExplicitLogoutAt: logoutAt,
tfAuthFlowToken: tf__loginFlowToken,
tfLoginError: '',
tfLoginConfirmed: false,
tfLoginConfirmedAt: logoutAt,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: logoutAt,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: logoutAt,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true
}, () => { });
try { chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], () => { }); } catch (e) { }
}
}
catch (e) { }
try {
tf_showLoginOverlay('Logout...', 'Menunggu konfirmasi logout...', { showCancel: true, showRetry: false });
}
catch (e) { }
const targetUrl = 'https://account.tradersfamily.id/logout/?tfAuth=1&tfAuthToken=' + encodeURIComponent(tf__loginFlowToken || '');
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
try {
chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
try {
if (tab && typeof tab.id !== 'undefined') {
tf__authTabId = tab.id;
tf__logoutTabId = tab.id;
}
}
catch (e) { }
});
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
showLoginView();
confirmBar.remove();
};
buttonsRow.appendChild(btnNo);
buttonsRow.appendChild(btnYes);
confirmBar.appendChild(label);
confirmBar.appendChild(buttonsRow);
if (logoutBtn.parentNode) {
logoutBtn.parentNode.insertBefore(confirmBar, logoutBtn.nextSibling);
}
}
});
}
if (analystLinksContainer && addAnalystBtn) {
addAnalystBtn.addEventListener('click', () => {
const hyperlinkBypass = !!(addAnalystBtn.dataset && addAnalystBtn.dataset.tfHyperlinkBypass === '1');
if (!hyperlinkBypass && addAnalystBtn.dataset && addAnalystBtn.dataset.tfImportBlocked === '1') {
setStatus('Tambahkan Analis dikunci. Klik hyperlink Refresh terlebih dahulu.');
return;
}
const doAddRow = () => {
const clone = tf_cloneBaseAnalystRowTemplate(false) || (analystLinksContainer.querySelector('.analyst-row') ? analystLinksContainer.querySelector('.analyst-row').cloneNode(true) : null);
if (!clone)
return;
try {
tf_forcePasteButtonInRow(clone);
}
catch (e) { }
const input = clone.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
}
const select = clone.querySelector('.analyst-pair-select');
if (select) {
select.disabled = false;
try {
tf_applyPairsArrayToSelect(select, tf_getAllAnalystPairsCached());
}
catch (e) { }
try {
initAnalystPairSelect(select);
}
catch (e) { }
}
const widget = clone.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
initPairMultiSelectForRow(clone);
try {
if (clone.dataset)
clone.dataset.tfLocked = '0';
}
catch (e) { }
try {
tf_markPendingAddAnalystRow(clone);
}
catch (e) { }
clone.classList.remove('tf-row-locked');
const rememberRow = analystLinksContainer.querySelector('.remember-links-row');
if (rememberRow && rememberRow.parentNode === analystLinksContainer) {
analystLinksContainer.insertBefore(clone, rememberRow);
}
else {
analystLinksContainer.appendChild(clone);
}
try {
saveRememberedAnalystLinks();
}
catch (e) {
console.warn('Gagal menyimpan remembered links setelah tambah analis', e);
}
};
try {
if (!hasChromeStorage()) {
doAddRow();
return;
}
const baseMain = analystLinksContainer ? analystLinksContainer.querySelectorAll('.analyst-row').length : 0;
const baseIsignal = isignalLinksContainer ? isignalLinksContainer.querySelectorAll('.analyst-row').length : 0;
chrome.storage.local.get([TF_HAS_IMPORTED_BUNDLE_KEY, TF_IMPORT_LOCK_ENGAGED_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (hasImp && !lockEngaged) {
tf_engageAddAnalystMode(() => {
doAddRow();
}, { main: baseMain, isignal: baseIsignal });
}
else {
doAddRow();
}
});
}
catch (e) {
doAddRow();
}
});
}
if (addAnalystIsignalBtn && isignalLinksContainer) {
addAnalystIsignalBtn.addEventListener('click', () => {
if (addAnalystIsignalBtn.dataset && addAnalystIsignalBtn.dataset.tfImportBlocked === '1') {
setIsignalStatus('Tambahkan Analis dikunci. Klik hyperlink Refresh terlebih dahulu.');
return;
}
const doAddRow = () => {
const clone = tf_cloneBaseAnalystRowTemplate(true) || (isignalLinksContainer.querySelector('.analyst-row') ? isignalLinksContainer.querySelector('.analyst-row').cloneNode(true) : null);
if (!clone)
return;
try {
if (clone.dataset)
clone.dataset.tfIsignalManual = '1';
}
catch (e) { }
try {
clone.classList.add('tf-isignal-manual-row');
}
catch (e) { }
try {
tf_forcePasteButtonInRow(clone);
}
catch (e) { }
const input = clone.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
try {
input.readOnly = false;
}
catch (e) { }
try {
input.removeAttribute('readonly');
}
catch (e) { }
try {
if (!input.placeholder)
input.placeholder = 'Kolom untuk isi Link Analis';
}
catch (e) { }
}
const select = clone.querySelector('.analyst-pair-select');
if (select) {
select.disabled = false;
try {
tf_applyPairsArrayToSelect(select, tf_getAllAnalystPairsCachedIsignal());
}
catch (e) { }
try {
initAnalystPairSelect(select);
}
catch (e) { }
}
const widget = clone.querySelector('.pair-multiselect');
if (widget && widget.dataset) {
delete widget.dataset.inited;
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
initPairMultiSelectForRow(clone);
try {
if (clone.dataset)
clone.dataset.tfLocked = '0';
}
catch (e) { }
clone.classList.remove('tf-row-locked');
isignalLinksContainer.appendChild(clone);
};
try {
if (!hasChromeStorage()) {
doAddRow();
return;
}
const baseMain = analystLinksContainer ? analystLinksContainer.querySelectorAll('.analyst-row').length : 0;
const baseIsignal = isignalLinksContainer ? isignalLinksContainer.querySelectorAll('.analyst-row').length : 0;
chrome.storage.local.get([TF_HAS_IMPORTED_BUNDLE_KEY, TF_IMPORT_LOCK_ENGAGED_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (hasImp && !lockEngaged) {
tf_engageAddAnalystMode(() => {
doAddRow();
}, { main: baseMain, isignal: baseIsignal });
}
else {
doAddRow();
}
});
}
catch (e) {
doAddRow();
}
});
}
const masukBtn = document.getElementById('masuk-btn');
if (masukBtn) {
masukBtn.addEventListener('click', () => {
const targetUrl = 'https://account.tradersfamily.id/channels/';
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime) {
try {
chrome.tabs.create({ url: targetUrl, active: true });
}
catch (e) {
window.open(targetUrl, '_blank');
}
}
else {
window.open(targetUrl, '_blank');
}
if (hasChromeStorage()) {
chrome.storage.local.set({ tfEnteredMain: true }, () => { });
}
showMainView();
});
}
if (analystLinksContainer) {
analystLinksContainer.addEventListener('click', async (event) => {
const removeBtn = event.target.closest('.analyst-remove-btn');
if (removeBtn) {
try {
event.preventDefault();
event.stopPropagation();
}
catch (e) { }
const row = removeBtn.closest('.analyst-row');
if (row) {
const okDel = await tf_confirmDeleteAnalyst();
if (!okDel)
return;
let deleteInfo = null;
try {
deleteInfo = await tf_deleteStoredDataForAnalystRow(row);
}
catch (e) { }
try {
const deletedKey = deleteInfo && deleteInfo.urlKey ? deleteInfo.urlKey : tf_normUrlKey(row.querySelector('.analyst-link-input') && row.querySelector('.analyst-link-input').value ? row.querySelector('.analyst-link-input').value : '');
tf_removeMatchingAnalystUrlFromOtherUiRows(deletedKey, row);
}
catch (e) { }
const rows = analystLinksContainer.querySelectorAll('.analyst-row');
if (rows.length <= 1) {
const input = row.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
try {
input.readOnly = false;
}
catch (e) { }
try {
input.removeAttribute('readonly');
}
catch (e) { }
}
try {
tf_forcePasteButtonInRow(row);
}
catch (e) { }
const select = row.querySelector('.analyst-pair-select');
if (select) {
select.disabled = false;
try {
tf_applyPairsArrayToSelect(select, tf_getAllAnalystPairsCached());
}
catch (e) { }
}
try {
const widgetUnlock = row.querySelector('.pair-multiselect');
if (widgetUnlock) {
widgetUnlock.style.pointerEvents = '';
widgetUnlock.style.opacity = '';
}
const cbsUnlock = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbsUnlock.forEach((cb) => { cb.disabled = false; });
}
catch (e) { }
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.classList.remove('open');
}
initPairMultiSelectForRow(row);
}
else {
row.remove();
}
try {
saveRememberedAnalystLinks();
}
catch (e) {
console.warn('Gagal menyimpan ulang remembered links setelah delete', e);
}
try {
tf_updateExportButtonsEnabledFromStorage();
tf_maybeExitAddModeAfterRowRemoval();
}
catch (e) { }
}
return;
}
const pillBtn = event.target.closest('button.tf-analyst-name-pill');
if (pillBtn) {
const rowP = pillBtn.closest('.analyst-row');
const inpP = rowP ? rowP.querySelector('.analyst-link-input') : null;
const raw = inpP && inpP.value ? String(inpP.value).trim() : '';
const norm = tf_normalizeTfAccountUrl(raw) || raw;
if (norm) {
try {
if (typeof chrome !== 'undefined' && chrome.tabs)
chrome.tabs.create({ url: norm, active: true });
else
window.open(norm, '_blank');
}
catch (e) {
try {
window.open(norm, '_blank');
}
catch (e2) { }
}
}
else {
try {
setStatus('Link channel kosong / tidak valid.');
}
catch (e) { }
}
return;
}
const nameBtn = event.target.closest('.analyst-name-btn');
if (nameBtn) {
const rowN = nameBtn.closest('.analyst-row');
const inpN = rowN ? rowN.querySelector('.analyst-link-input') : null;
const raw = inpN && inpN.value ? String(inpN.value).trim() : '';
const norm = tf_normalizeTfAccountUrl(raw) || raw;
if (norm) {
try {
if (typeof chrome !== 'undefined' && chrome.tabs)
chrome.tabs.create({ url: norm, active: true });
else
window.open(norm, '_blank');
}
catch (e) {
try {
window.open(norm, '_blank');
}
catch (e2) { }
}
}
else {
try {
setStatus('Link channel kosong / tidak valid.');
}
catch (e) { }
}
return;
}
const btn = event.target.closest('.analyst-paste-btn');
if (!btn)
return;
const row = btn.closest('.analyst-row');
if (!row)
return;
const input = row.querySelector('.analyst-link-input');
if (!input)
return;
input.focus();
if (!navigator.clipboard || !navigator.clipboard.readText) {
setStatus('Clipboard tidak bisa diakses otomatis. Tekan Ctrl+V di kolom ini jika perlu.');
return;
}
navigator.clipboard.readText()
.then((text) => {
if (!text) {
setStatus('Clipboard kosong. Copy dulu link analisnya, lalu klik Paste Link lagi.');
return;
}
const norm = tf_normalizeTfAccountUrl(text);
if (!norm) {
setStatus('Link tidak valid. Pastikan link mengandung domain https://account.tradersfamily.id/ dan path /channels/.');
return;
}
input.value = norm;
setStatus('Link berhasil di-paste & dinormalisasi.');
})
.catch((err) => {
console.error('Gagal membaca clipboard:', err);
setStatus('Tidak bisa membaca clipboard. Silakan Ctrl+V manual di kolom.');
});
});
}
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
if (!msg)
return;
if (msg.type === 'historyBatchProgress') {
if (Date.now() < (__tfProgressUiMutedUntil || 0))
return;
try {
hbui_upsert({
analystName: msg.analystName || '',
pair: msg.pair || '',
batchIndex: (typeof msg.batchIndex === 'number') ? msg.batchIndex : (msg.batchIndex ? parseInt(msg.batchIndex, 10) : null),
stateText: msg.stateText || 'Progress...'
});
}
catch (e) { }
return;
}
if (msg.type === 'tfAnalystNameResolved') {
try {
const rawUrl = msg.url || msg.link || '';
const nm = msg.analystName || msg.name || '';
const applied = tf_applyAnalystNameToSidebarByUrl(rawUrl, nm);
try {
tf_rememberStableAnalystName(rawUrl, nm, true);
}
catch (e) { }
if (applied) {
tf_scheduleSaveRememberedLinks();
}
try {
tf_scheduleSavedChannelsRefresh({ reloadNames: false });
}
catch (e) { }
}
catch (e) { }
return;
}
if (msg.type === 'tfAuthUserClose') {
try {
tf_clearGoogleTimer();
}
catch (e) { }
try {
if (sender && sender.tab && sender.tab.id != null) {
chrome.tabs.remove(sender.tab.id, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
try {
tf_closeAuthTab();
}
catch (e) { }
try {
tf_hideLoginOverlay();
}
catch (e) { }
tf__loginFlow = null;
tf__loginFlowToken = null;
try {
if (hasChromeStorage()) {
chrome.storage.local.remove(['tfPendingLogin', 'tfPendingGoogleLogin', 'tfCaptchaNeeded', 'tfCaptchaSolved', 'tfLoginError'], () => { });
chrome.storage.local.set({ tfForceLoginForm: true, tfLoginConfirmed: false, tfEnteredMain: false }, () => { });
}
}
catch (e) { }
showLoginView();
return;
}
if (msg.type === 'tfForceSidebarLoginView' && String(msg.reason || '') === 'SESSION_EXPIRED') {
const forcedMessage = String(msg.message || 'Session TradersFamily berakhir. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.');
const forcedAction = String(msg.action || '');
const forcedOrigin = String(msg.origin || tf_scanUiOrigin || '');
try {
if (forcedAction) tf_queueResumeAfterLogin(forcedAction, { source: 'background_force_sidebar_login', origin: forcedOrigin });
} catch (e) { }
try { tf_applyStopModeFromScanState(false, forcedOrigin); } catch (e) { }
try {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) loginStatusEl.textContent = forcedMessage;
setStatus(forcedMessage);
} catch (e) { }
try { showLoginView(); } catch (e) { }
return;
}
if (msg.type === 'tfLoggedOut') {
const raw = (msg && (msg.message || msg.error || msg.reason))
? (msg.message || msg.error || msg.reason)
: 'Logout terdeteksi';
const logoutReason = String(msg && msg.reason || '');
const activeOrigin = String(tf_scanUiOrigin || '');
const resumeAction = activeOrigin === 'updateButton' ? 'update' : (activeOrigin === 'dashboardSubmit' ? 'dashboardSubmit' : (activeOrigin === 'isignalSubmit' ? 'isignalSubmit' : ''));
if (logoutReason === 'SESSION_EXPIRED' && tf_scanUiInProgress && resumeAction) {
try { tf_queueResumeAfterLogin(resumeAction, { source: 'session_expired_during_scan', origin: activeOrigin }); } catch (e) { }
try {
tf_sendStopProgress(() => {
try { tf_applyStopModeFromScanState(false, activeOrigin); } catch (e) { }
});
}
catch (e) { }
tf_forceLoginViewForResume(resumeAction, 'Session TradersFamily berakhir saat proses berjalan. Silakan login kembali. Setelah login berhasil proses akan dilanjutkan otomatis.', { source: 'session_expired_during_scan', origin: activeOrigin });
return;
}
const deferableDuringScan = logoutReason === 'NAVBAR_LOGGED_OUT' || logoutReason === 'PERIODIC_CHECK';
if (tf_scanUiInProgress && deferableDuringScan) {
try {
if (hasChromeStorage()) {
chrome.storage.local.set({
tfDeferredLogoutDuringScanAt: Date.now(),
tfDeferredLogoutDuringScanReason: logoutReason || 'SESSION_CANDIDATE',
tfDeferredLogoutDuringScanMessage: raw,
tfForceLoginForm: false
}, () => { });
}
}
catch (e) { }
try { setStatus('Batch scanning berjalan • session dijaga otomatis'); } catch (e) { }
try { showMainView(); } catch (e) { }
return;
}
const isPeriodicOnly = !!(msg && msg.reason === 'PERIODIC_CHECK');
if (isPeriodicOnly) {
try {
if (hasChromeStorage()) {
chrome.storage.local.set({
tfRootLoginState: 'unknown',
tfRootLoginStateAt: Date.now(),
tfForceLoginForm: false
}, () => { });
}
}
catch (e) { }
try {
loadPopupStateFromStorage();
}
catch (e) { }
return;
}
const isExpired = !!(msg && msg.reason === 'SESSION_EXPIRED');
const userMsg = isExpired ? 'Session berakhir dan harus login lagi.' : '';
try {
if (hasChromeStorage()) {
const base = { tfLoginConfirmed: false, tfEnteredMain: false, tfForceLoginForm: true, tfRootLoginState: 'logged_out', tfRootLoginStateAt: Date.now() };
if (isExpired)
base.tfLoginError = userMsg;
chrome.storage.local.set(base, () => {
try {
if (!isExpired)
chrome.storage.local.remove(['tfLoginError'], () => { });
}
catch (e) { }
});
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail'], () => { });
}
}
catch (e) { }
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) {
loginStatusEl.textContent = userMsg || 'Offline';
}
if (isExpired && userMsg) {
setStatus(userMsg);
}
showLoginView();
return;
}
if (msg.type === 'batchScanDone') {
try {
tf_applyStopModeFromScanState(false, null);
}
catch (e) { }
try {
tf_keepaliveClose();
}
catch (e) { }
if (!msg || msg.ok === false) {
let removedPendingRow = false;
try {
if (msg && tf_isSingleScanOrigin(msg.origin)) {
removedPendingRow = tf_removePendingAddAnalystRowForScan(__tfLastScanChannelMeta, msg.uiSessionId || '');
__tfLastScanChannelMeta = null;
tf_activeSingleScanUiSessionId = null;
if (msg.uiSessionId)
scui_update(msg.uiSessionId, { stateText: msg.rolledBack ? 'Error • Not saved' : 'Error' });
}
}
catch (e) { }
const suffix = msg && msg.rolledBack ? ' Data scan sementara sudah dikembalikan dan tidak disimpan.' : '';
const rowSuffix = removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : '';
const em = 'Batch scan error: ' + ((msg && msg.error) ? String(msg.error) : 'unknown') + suffix + rowSuffix;
try {
if (msg && msg.origin === 'isignalSubmit')
setIsignalStatus(em);
}
catch (e) { }
setStatus(em);
return;
}
if (msg.stopped) {
let removedPendingRow = false;
try {
if (msg && tf_isSingleScanOrigin(msg.origin)) {
if (msg.uiSessionId)
scui_update(msg.uiSessionId, { stateText: msg.rolledBack ? 'Stopped • Not saved' : 'Stopped' });
removedPendingRow = tf_removePendingAddAnalystRowForScan(__tfLastScanChannelMeta, msg.uiSessionId || '');
__tfLastScanChannelMeta = null;
tf_activeSingleScanUiSessionId = null;
}
}
catch (e) { }
const sm = (msg && msg.rolledBack
? 'Stopped. Hasil Scan Channel sementara dibuang dan tidak disimpan.'
: 'Stopped.') + (removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : '');
try {
if (msg && msg.origin === 'isignalSubmit')
setIsignalStatus(sm);
}
catch (e) { }
setStatus(sm);
return;
}
const results = msg.results || [];
try {
tf_releaseAddAnalystModeAfterSuccessfulSubmit(msg && msg.origin ? msg.origin : '', () => { });
}
catch (e) { }
if (msg && tf_isSingleScanOrigin(msg.origin)) {
try {
if (msg.uiSessionId) {
const t = (Array.isArray(results) && results.length > 0) ? results.length : 1;
scui_update(msg.uiSessionId, { total: t, current: t, stateText: 'Done!' });
}
}
catch (e) { }
try {
if (__tfLastScanChannelMeta && __tfLastScanChannelMeta.url) {
tf_upsertMainAnalystRowByUrl(__tfLastScanChannelMeta.url, __tfLastScanChannelMeta.pairs, {
pendingRowToken: __tfLastScanChannelMeta.pendingRowToken || '',
uiSessionId: __tfLastScanChannelMeta.uiSessionId || msg.uiSessionId || ''
});
}
}
catch (e) { }
try {
__tfLastScanChannelMeta = null;
}
catch (e) { }
}
const lines = results.map((r) => {
const sum = r.summary || {};
const chName = (sum.analystName && sum.analystName.trim()) || r.channel || 'channel';
const ok = r.error ? 'ERROR' : 'OK';
const m = sum.monthCount || 0;
const h = sum.historyCount || 0;
const pairLabel = (r.pair && typeof r.pair === 'string') ? r.pair : null;
const pairText = pairLabel ? ' (' + pairLabel + ')' : ' (Pair)';
return chName + pairText + ' → ' + ok + ' (bulan: ' + m + ', history: ' + h + ')';
});
const msgFinal = 'Batch scan selesai. Dashboard sudah dibuka otomatis.\n\n' + lines.join('\n');
try {
if (msg && msg.origin === 'isignalSubmit')
setIsignalStatus('Batch scan selesai.');
}
catch (e) { }
try {
tf_reloadAnalystNamesInSidebarUI();
}
catch (e) { }
setStatus(msgFinal);
return;
}
if (msg.type === 'batchScanStopped') {
try {
tf_keepaliveClose();
}
catch (e) { }
try {
tf_applyStopModeFromScanState(false, null);
}
catch (e) { }
let removedPendingRow = false;
if (tf_isSingleScanOrigin(msg.origin)) {
try {
if (msg.uiSessionId)
scui_update(msg.uiSessionId, { stateText: 'Stopped' });
}
catch (e) { }
try {
removedPendingRow = tf_removePendingAddAnalystRowForScan(__tfLastScanChannelMeta, msg.uiSessionId || '');
__tfLastScanChannelMeta = null;
tf_activeSingleScanUiSessionId = null;
}
catch (e) { }
}
const stoppedMsg = 'Stopped.' + (removedPendingRow ? ' Kolom Link Analis sementara dihapus.' : '');
try {
setIsignalStatus(stoppedMsg);
}
catch (e) { }
setStatus(stoppedMsg);
return;
}
if (msg.type !== 'batchScanProgress')
return;
if (Date.now() < (__tfProgressUiMutedUntil || 0))
return;
const current = msg.current || 0;
const total = msg.total || 0;
const ch = msg.channel || '';
if (tf_isSingleScanOrigin(msg.origin) && msg.uiSessionId) {
try {
scui_update(msg.uiSessionId, {
analystName: (msg && msg.analystName) ? String(msg.analystName) : '',
pair: (msg && msg.pair) ? String(msg.pair) : '',
current,
total
});
}
catch (e) { }
}
let pct = 0;
if (total > 0) {
pct = Math.round((current * 100) / total);
}
setStatus('Scanning ' + ch + ' (' + current + '/' + total + ', ' + pct + '%)...');
});
}
});

// REV216 — render Power / Sleep Event Log at the bottom of the Side Panel.
(() => {
  'use strict';
  const LOG_KEY = 'tfPowerSleepEventLog';
  const STATE_KEY = 'tfPowerSleepState';
  const MAX_VISIBLE = 8;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function clock(ts) {
    try {
      return new Date(Number(ts || Date.now())).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (e) { return '--:--:--'; }
  }
  function stateStyle(state) {
    if (state === 'on') return { label: 'ON', fg: '#34d399', bd: 'rgba(52,211,153,.45)', bg: 'rgba(16,185,129,.10)' };
    if (state === 'error') return { label: 'ERROR', fg: '#f87171', bd: 'rgba(248,113,113,.45)', bg: 'rgba(239,68,68,.10)' };
    return { label: 'OFF', fg: '#94a3b8', bd: 'rgba(148,163,184,.28)', bg: 'rgba(15,23,42,.70)' };
  }
  function render(data) {
    try {
      const state = data && data[STATE_KEY] && typeof data[STATE_KEY] === 'object' ? data[STATE_KEY] : { state: 'off' };
      const logs = Array.isArray(data && data[LOG_KEY]) ? data[LOG_KEY] : [];
      const st = String(state.state || 'off').toLowerCase();
      const ss = stateStyle(st);
      const badge = document.getElementById('tf-power-sleep-badge');
      const summary = document.getElementById('tf-power-sleep-summary');
      const list = document.getElementById('tf-power-sleep-log');
      if (badge) {
        badge.textContent = ss.label;
        badge.style.color = ss.fg;
        badge.style.borderColor = ss.bd;
        badge.style.background = ss.bg;
      }
      if (summary) {
        if (st === 'on') summary.textContent = 'Stay Awake ON — system sleep dicegah selama scan aktif. Monitor tetap boleh redup/mati.';
        else if (st === 'error') summary.textContent = 'Stay Awake ERROR — Power API tidak dapat diaktifkan. Periksa permission extension.';
        else summary.textContent = 'Stay Awake OFF — pengaturan sleep Windows/macOS kembali normal.';
      }
      if (list) {
        const visible = logs.slice(0, MAX_VISIBLE);
        if (!visible.length) {
          list.innerHTML = '<div style="font-size:9px;color:#64748b;">Belum ada event power.</div>';
        } else {
          list.innerHTML = visible.map((item) => {
            const itemState = String(item && item.state || 'off').toLowerCase();
            const c = itemState === 'on' ? '#34d399' : itemState === 'error' ? '#f87171' : '#94a3b8';
            const msg = item && item.message ? String(item.message) : (itemState === 'on' ? 'Stay Awake ON' : 'Stay Awake OFF');
            return '<div style="display:grid;grid-template-columns:52.2px 1fr;gap:6.3px;padding:4.5px 5.4px;border-radius:6.3px;background:rgba(2,6,23,.28);border:1px solid rgba(148,163,184,.10);">' +
              '<span style="font-size:8.55px;color:#64748b;font-variant-numeric:tabular-nums;">' + esc(clock(item && item.ts)) + '</span>' +
              '<span style="font-size:8.55px;line-height:1.35;color:' + c + ';">' + esc(msg) + '</span>' +
              '</div>';
          }).join('');
        }
      }
    } catch (e) { }
  }
  function load() {
    try {
      chrome.storage.local.get([LOG_KEY, STATE_KEY], (data) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        render(data || {});
      });
    } catch (e) { }
  }
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || (!changes[LOG_KEY] && !changes[STATE_KEY])) return;
      load();
    });
  } catch (e) { }
  try {
    const clear = document.getElementById('tf-power-sleep-clear');
    if (clear) clear.addEventListener('click', () => {
      try {
        chrome.storage.local.set({ [LOG_KEY]: [] }, () => {
          try { void chrome.runtime.lastError; } catch (e) { }
          load();
        });
      } catch (e) { }
    });
  } catch (e) { }
  load();
})();

// REV416: delegated pair deletion survives cloned/imported/rebuilt sidebar rows.
function tf_pairDeletePayload408(data, url, pair) {
  const norm = s => String(s || '').trim().replace(/\/+$/, '');
  const upper = s => String(s || '').trim().toUpperCase();
  const names = new Set(Object.entries(data.tfAnalystSources || {}).filter(([,v]) => norm(v.url) === norm(url)).map(([k]) => k));
  for (const item of data.tfRememberedAnalystLinks || []) if (norm(item.url) === norm(url)) {
    if (item.name) names.add(item.name);
    if (item.analystName) names.add(item.analystName);
  }
  if (!names.size) throw new Error('Nama analis belum dikenali. Data tidak dihapus.');
  const p = upper(pair);
  if (!p || p === '__ALL__') throw new Error('Pilih satu pair.');
  const history = (data.tfHistorySignals || []).filter(r => !(names.has(r.analyst || r.analystName) && upper(r.pair) === p));
  const monthly = {...data.tfMonthlyStats};
  for (const key of Object.keys(monthly)) {
    const m = key.match(/^(.*?)\s+\(([A-Za-z0-9]+)\)$/);
    if (m && names.has(m[1].trim()) && upper(m[2]) === p) delete monthly[key];
    // Rebuild a legacy aggregate from retained trades, never remove other pairs.
    if (names.has(key)) {
      const months = {};
      for (const r of history) if ((r.analyst || r.analystName) === key) {
        const ts = Number(r.sortKey || r.createdSortKey);
        if (!Number.isFinite(ts) || !ts) continue;
        const month = new Date(ts).toISOString().slice(0,7);
        const v = months[month] || (months[month]={pips:0,signals:0});
        v.pips += Number(r.pips) || 0; v.signals++;
      }
      monthly[key]=months;
    }
  }
  const sources = structuredClone(data.tfAnalystSources || {});
  for (const name of names) if (sources[name]) {
    const old = sources[name].pairs || [];
    sources[name].pairs = old.some(v=>upper(v)==='__ALL__')
      ? [...new Set(history.filter(r=>r.analyst===name).map(r=>upper(r.pair)).filter(Boolean))]
      : old.filter(v=>upper(v)!==p);
  }
  const cleanMap = map => {
    const out=structuredClone(map || {});
    for (const name of names) if(out[name] && typeof out[name]==='object') {
      if(Array.isArray(out[name])) out[name]=out[name].filter(v=>upper(v)!==p);
      else for(const key of Object.keys(out[name])) if(upper(key)===p) delete out[name][key];
    }
    return out;
  };
  const remembered = (data.tfRememberedAnalystLinks || []).map(v=> norm(v.url)===norm(url)
    ? {...v,pairs:(v.pairs || []).filter(x=>upper(x)!==p)} : v);
  return {tfHistorySignals:history,tfMonthlyStats:monthly,tfAnalystSources:sources,
    tfAvgSlPips:cleanMap(data.tfAvgSlPips),tfNoDataPairs:cleanMap(data.tfNoDataPairs),
    tfRememberedAnalystLinks:remembered};
}
(function(){
  let snapshot={}, scheduled=false, busy=false;
  const get = () => new Promise((resolve,reject)=>chrome.storage.local.get(null,d=>{
    if(chrome.runtime.lastError)reject(new Error(chrome.runtime.lastError.message));else resolve(d||{});
  }));
  const urlOf = row => tf_normUrlKey(row.querySelector('.analyst-link-input')?.value);
  const namesOf = url => Object.entries(snapshot.tfAnalystSources||{}).filter(([,v])=>tf_normUrlKey(v.url)===url).map(([k])=>k);
  const hasData = (url,pair) => {
    const names=namesOf(url);
    return names.some(n=> (snapshot.tfHistorySignals||[]).some(r=>r.analyst===n&&String(r.pair).toUpperCase()===pair)
      || Object.hasOwn(snapshot.tfMonthlyStats||{},n+' ('+pair+')'));
  };
  const update = () => {
    scheduled=false;
    document.querySelectorAll('.analyst-row .pair-multiselect-dropdown input[data-value]').forEach(cb=>{
      const pair=String(cb.dataset.value||'').toUpperCase(), row=cb.closest('.analyst-row'), label=cb.closest('label');
      if(!label||pair==='__ALL__')return;
      const found=hasData(urlOf(row),pair);
      let btn=label.querySelector('.tf-pair-delete408');
      if(found&&!btn){
        btn=document.createElement('button');btn.type='button';btn.className='tf-pair-delete408';btn.textContent='×';
        btn.setAttribute('aria-label','Hapus data '+pair);btn.title='Hapus data '+pair+' untuk analis ini';
        btn.style.cssText='font:inherit;line-height:1;padding:0 2.7px;margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#ef4444;cursor:pointer;';
        label.appendChild(btn);

      }
      if(btn)btn.hidden=!found;
    });
  };
  // Delegation survives cloneNode/template rebuilds; resolve the live row/pair.
  document.addEventListener('click',async ev=>{
    const btn=ev.target.closest?.('.tf-pair-delete408');
    if(!btn || btn.hidden)return;
    const row=btn.closest('.analyst-row'), label=btn.closest('label');
    const cb=label?.querySelector('input[data-value]');
    const pair=String(cb?.dataset.value||'').toUpperCase();
    if(!row || !pair || pair==='__ALL__')return;
          ev.preventDefault();ev.stopPropagation();if(busy)return;
          busy=true;
          try{
            const url=urlOf(row);
            snapshot=await get();
            const names=namesOf(url);
            if(snapshot.tfScanInProgress)throw new Error('Tunggu scan selesai sebelum menghapus data pair.');
            const title='Hapus data '+pair+' — '+names.join(', ')+'? Pair lain dan row analis tetap tersimpan.';
            if(!await tf_confirmDeleteAnalyst(title))return;
            const fresh=await get();
            if(fresh.tfScanInProgress)throw new Error('Scan sedang berjalan. Data tidak dihapus.');
            const payload=tf_pairDeletePayload408(fresh,url,pair);
            await new Promise((resolve,reject)=>chrome.storage.local.set(payload,()=>chrome.runtime.lastError?reject(new Error(chrome.runtime.lastError.message)):resolve()));
            snapshot={...fresh,...payload};
            document.querySelectorAll('.analyst-row').forEach(other=>{
              if(urlOf(other)!==url)return;
              const select=other.querySelector('.analyst-pair-select');
              if(select){for(const opt of select.options)if(String(opt.value).toUpperCase()===pair)opt.selected=false;}
              other.querySelectorAll('.pair-multiselect-dropdown input[data-value]').forEach(c=>{if(String(c.dataset.value).toUpperCase()===pair){c.checked=false;c.disabled=false;}});
              const widget=other.querySelector('.pair-multiselect');
              if(widget&&typeof widget.__tf_syncFromSelect==='function')widget.__tf_syncFromSelect();
            });
            update();
          }catch(e){alert(e.message||'Gagal menghapus data pair.');}
          finally{busy=false;}
  },true);
  const schedule=()=>{if(!scheduled){scheduled=true;setTimeout(update,30);}};
  get().then(d=>{snapshot=d;update();}).catch(()=>{});
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    for(const [key,v] of Object.entries(changes))snapshot[key]=v.newValue;
    schedule();
  });
  new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'||Array.from(r.addedNodes||[]).some(n=>n.nodeType===1&&!n.classList.contains('tf-pair-delete408'))))schedule();}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled']});
})();

/* TF compact dimensions REV453 */
