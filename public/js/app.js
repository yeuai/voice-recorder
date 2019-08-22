angular.module('voiceRecorder', [
  'ngAnimate',
  'ngResource',
  'toastr',
  'ui.bootstrap'
])
  .controller('RecordController', function ($http, $timeout, $log, $document, $uibModal, toastr, svText) {
    var vm = this;

    vm.isRecording = undefined;
    vm.isRecordingOrNotStarted = function () {
      return (typeof vm.isRecording === 'undefined' || vm.isRecording);
    }

    document.addEventListener('keyup', e => {
      if (e.which === 38 || e.which === 39) {
        $timeout(vm.select.bind(vm, vm.current + 1));
      } else if (e.which === 37 || e.which === 40) {
        $timeout(vm.select.bind(vm, vm.current - 1));
      } else if (e.which === 32) {
        $timeout(vm.toggleRecording.bind(vm));
      }
    });

    vm.saveAudio = function () {
      if (vm.isRecording) {
        return;
      }
      // audioRecorder.exportWAV( doneEncoding );
      // could get mono instead by saying
      audioRecorder.exportMonoWAV((blob) => {
        var fd = new FormData();
        var file = new File([blob], vm.current + '.wav');
        fd.append('audio_file', file);
        fd.append('speaker', vm.speaker);

        $http.post('/upload/' + vm.speaker, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined },
          responseType: 'json'
        })
          .then(function ({ data }) {
            toastr.success('File: ' + data.filename, 'Lưu thành công!');
          }, function (err) {
            console.error(err);
            alert('Lỗi: ' + err);
          });

      });
    }

    function gotBuffers(buffers) {
      var canvas = document.getElementById("wavedisplay");

      drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);

      // the ONLY time gotBuffers is called is right after a new recording is completed -
      // so here's where we should set up the download.
      // audioRecorder.exportMonoWAV(doneEncoding);
    }

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

    vm.toggleRecording = function () {
      if (vm.isRecording) {
        vm.isRecording = false;

        // stop recording
        audioRecorder.stop();
        audioRecorder.getBuffers(gotBuffers);
      } else {
        if (!audioRecorder)
          return alert('Không thể start: Recorder!');

        // start recording
        vm.isRecording = true;
        audioRecorder.clear();
        audioRecorder.record();
      }
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
