(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ui.router', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.treeView',
        /*
         * Our reusable cross app code modules
         */
        'blocks.exception', 'blocks.logger', 'blocks.router'

    ]);
})();
