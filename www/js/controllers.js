angular.module('addme.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicPopup, $timeout, $log, db, User) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
    // um den nutzer aus der Datenbank zu löschen:
    // db.destroy('user');
    User.init($scope);
    $scope.doLogin = function() {
      $scope.user._id = 'user';
      console.log($scope.user);
      console.log(db);
      db.put($scope.user)
        .then(function(res) {
          $log.debug(res);
          $ionicPopup.alert({
            title: 'Information saved',
            template: 'Successfully saved your contact Information. You can choose what information to include in the generated barcode by toggling the different sections.'
          });
        }, function(err) {
          $log.error(err);
        });
      $state.go('app.user');
    };

  })
  .controller('ScanCtrl', function($scope, $log, $ionicPlatform, $state, $ionicPopup, $cordovaBarcodeScanner, User, contacts) {
    $scope.scanQR = scanQR;
    $scope.saveContact = saveContact;
    $scope.generatedQR = '';
    console.log($scope.user);
    $log.info('ScanPage');

    function saveContact() {
      $scope.newContact._id = $scope.newContact.name.lname + $scope.newContact.name.fname;
      contacts.post($scope.newContact).then(function(res) {
        console.log(res);
        $ionicPopup.alert({
          title: 'Contact saved',
          template: 'Successfully saved the new contact.'
        });
        $state.go('app.contacts');
      }, function(err) {
        console.error(err);
        if (err.status === 409) {
          $ionicPopup.alert({
            title: 'Conflict',
            template: 'The Contact already exists.'
          });
        }
      });
    }

    function scanQR() {
      $log.info('Scan button clicked!');
      $ionicPlatform.ready(function() {
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            $scope.qrdata = barcodeData;
            $scope.newContact = JSON.parse(barcodeData.text);
            $log.debug($scope.newContact);
          }, function(error) {
            $log.error(error);
          });
      });
    }

  })
  .controller('UserCtrl', function($scope, $log, $ionicPlatform, $ionicPopup, $cordovaBarcodeScanner, User, Twitter, Github, db) {

    $scope.createQR = createQR;
    $scope.twitterOAuth = twitterOAuth;
    $scope.githubOAuth = githubOAuth;
    $scope.generatedQR = '';
    $scope.qrsize = 300;
    $log.info('UserPage');

    function createQR() {
      var userinfo = _.pickBy($scope.user, 'include'); // filtert die Infos mit include=true
      userinfo = _.mapValues(userinfo, 'value'); // nur die Werte sollen im Objekt enthalten sein, nicht aber die include-Flags
      console.log(userinfo);
      var info = JSON.stringify(userinfo);
      $log.info('createQR clicked!');
      if ($scope.generatedQR === '') {
        $scope.generatedQR = info;
      } else {
        $scope.generatedQR = '';
      }
    }

    function twitterOAuth() {
      Twitter.auth()
        .then(function(data) {
          $scope.user.twitter.value = data.screen_name;
          $log.debug(data);
          $ionicPopup.alert({
            title: 'Success',
            template: 'The screen_name '+data.screen_name+' has been added to your profile.'
          });
          db.get('user').then(function(res) {
            var user = res;
            user.twitter.value = data.screen_name;
            db.put(user);
          },function(err) {
            console.error(err);
          });
        }, function(err) {
          $log.error(err);
        });
    }

    function githubOAuth() {
      Github.auth()
        .then(function(data) {
          $log.debug(data);
        }, function(err) {
          $log.error(err);
        });
    }

  })
  .controller('ContactsCtrl', function($scope, $log, Contacts) {
    $log.debug($scope.$parent.user);
    $scope.$on('$ionicView.enter', function(e) {
      Contacts.getAll().then(function(res) {
        $scope.contacts = _.map(res.rows, 'doc');
        console.log($scope.contacts);
      }, function(err) {
        console.error(err);
      });
    });
  })

.controller('ContactCtrl', function($scope, $ionicPopup, $ionicPlatform, $stateParams, Contacts, $cordovaEmailComposer) {

  console.log($stateParams.contactId);
  $scope.$on('$ionicView.enter', function(e) {
    Contacts.getOne($stateParams.contactId).then(function(res) {
      $scope.contact = res;
      $scope.$apply();
      console.log(res);
      console.log($scope.contact);
    }, function(err) {
      console.error(err);
    });
  });
});
