angular.module('voiceRecorder', [
  'ngResource',
  'ui.bootstrap'
])
  .controller('RecordController', function ($timeout, $log, $document, $uibModal, svText) {
    var vm = this;

    document.addEventListener('keyup', e => {
      if (e.which === 38 || e.which === 39) {
        $timeout(vm.select.bind(vm, vm.current + 1));
      } else if (e.which === 37 || e.which === 40) {
        $timeout(vm.select.bind(vm, vm.current - 1));
      } else if (e.which === 32) {
        $timeout(vm.start);
      }
    });

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
        console.log('Speaker: ', speaker);
        // init micro here!
        initAudio();

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.select = function (index) {
      const item = vm.data.find(x => x.number == index);
      if (!item) {
        return alert('Không có số thứ tự này! ' + index);
      }
      vm.text = item.text;
      vm.current = parseInt(item.number);
      localStorage.setItem('current', vm.current);
    }

    vm.start = function () {
      console.log('Start!');
    }

    // open prompt modal
    $timeout(vm.open.bind(this));
    $timeout(async function () {
      const vResult = await svText.all().$promise;
      vm.data = vResult;

      const vCurrent = parseInt(localStorage.getItem('current') || 1);
      vm.select(vCurrent);
    });


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
