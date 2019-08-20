angular.module('voiceRecorder', ['ui.bootstrap'])
  .controller('ModalInstanceCtrl', function ($uibModalInstance, speaker) {
    var $ctrl = this;
    $ctrl.speaker = speaker;

    $ctrl.ok = function () {
      localStorage.setItem('speaker', $ctrl.speaker);
      $uibModalInstance.close($ctrl.speaker);
    };
  })
  .controller('RecordController', function ($timeout, $log, $document, $uibModal) {
    var $ctrl = this;

    $ctrl.open = function (size, parentSelector) {
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
        $ctrl.speaker = speaker;
        console.log('Speaker: ', speaker)
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    // open prompt modal
    $timeout($ctrl.open.bind(this))
  });
