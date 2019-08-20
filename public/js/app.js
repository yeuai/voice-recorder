angular.module('voiceRecorder', [
    'ngResource',
    'ui.bootstrap'
  ])
  .controller('RecordController', function ($timeout, $log, $document, $uibModal, svText) {
    var vm = this;

    vm.open = function (size, parentSelector) {
      var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          speaker: function () {
            var speaker_name = localStorage.getItem('speaker') || '';
            return speaker_name;
          }
        }
      });

      modalInstance.result.then(function (speaker) {
        vm.speaker = speaker;
        console.log('Speaker: ', speaker)
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.select = function (index) {
      if (typeof index === 'number') {
        vm.current = index;
      }

      const item = vm.data.find(x => x.number == vm.current);
      if (!item) {
        return alert('Không có số thứ tự này! ' + vm.current);
      }
      vm.text = item.text;
      vm.current = parseInt(item.number);
      localStorage.setItem('current', vm.current);
    }

    // open prompt modal
    $timeout(vm.open.bind(this));
    $timeout(async function () {
      const vResult = await svText.all().$promise;
      vm.data = vResult;

      const vCurrent = parseInt(localStorage.getItem('current') || 1);
      vm.select(vCurrent);
    })
  })
  .controller('ModalInstanceCtrl', function ($uibModalInstance, speaker) {
    var vm = this;
    vm.speaker = speaker;
    vm.data = [];

    vm.ok = function () {
      localStorage.setItem('speaker', vm.speaker);
      $uibModalInstance.close(vm.speaker);
    };
  })
  .directive('myEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.myEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
