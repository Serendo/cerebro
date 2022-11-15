angular.module('cerebro').controller('CatController', ['$scope',
  'CatDataService', 'AlertService',
  function($scope, CatDataService, AlertService) {
    $scope.api = undefined;

    $scope.apis = [
      'aliases',
      'allocation',
      'count',
      'fielddata',
      'health',
      'indices',
      'master',
      'nodeattrs',
      'nodes',
      'pending tasks',
      'plugins',
      'recovery',
      'repositories',
      'thread pool',
      'shards',
      'segments',
    ];

    $scope.headers = undefined;
    $scope.data = undefined;
    $scope.sortCol = undefined;
    $scope.sortAsc = true;

    $scope.get = function(api) {
      CatDataService.get(
          api.replace(/ /g, '_'), // transforms thread pool into thread_pool, for example
          function(data) {
            if (data.length) {
              $scope.headers = Object.keys(data[0]);
              $scope.sort($scope.headers[0]);
              $scope.data = data;
            } else {
              $scope.headers = [];
              $scope.data = [];
            }
          },
          function(error) {
            AlertService.error('Error executing request', error);
          }
      );
    };
    $scope.escompare = function(line) {
      var sortdata = line[$scope.sortCol];
      var part1 = sortdata.substring(0, sortdata.length-2);
      var part2 = sortdata.substring(sortdata.length-2);
      if (isNaN(part1)) {
        return sortdata;
      } else {
        if (part2 == 'kb') {
          return +part1 * 1024;
        } else if (part2 == 'mb') {
          return +part1 * 1024 * 1024;
        } else if (part2 == 'gb') {
          return +part1 * 1024 * 1024 * 1024;
        } else if (part2 == 'tb') {
          return +part1 * 1024 * 1024 * 1024 * 1024;
        } else {
          return sortdata;
        }
      }
      return sortdata;
    };
    $scope.sort = function(col) {
      if ($scope.sortCol === col) {
        $scope.sortAsc = !$scope.sortAsc;
      } else {
        $scope.sortAsc = true;
      }
      $scope.sortCol = col;
    };
  }]
);
