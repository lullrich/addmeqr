angular.module('addme.services', ['ngCordova', 'ngCordovaOauth', 'pouchdb'])
.constant('db', new PouchDB('DB', {adapter: 'websql'}))
.constant('contacts', new PouchDB('contacts', {adapter: 'websql'}))
.service('User', function (db) {
  this.init = function (scope) {
    db.get('user').then(function(res) {
      scope.user = res;
      console.log(res);
    }, function(err) {
      console.error(err);
      scope.user = {
        name: {
            include: true,
            value: {
              fname: 'First Name',
              lname: 'Last Name',
            }
        },
        address: {
          include: true,
          value: {
            street: 'Street',
            no: 'Number',
            zip: 'Zip Code',
            city: 'City',
            country: 'Country'
          }
        },
        tel: {
          include: true,
          value: '555 555 555'
        },
        mobile: {
          include:true,
          value:'999 999 999'
        },
        email: {
          include:true,
          value:'email@example.com'
        },
        twitter: {
          include: true,
          value:'screen_name'
        },
        github: {
          include: true,
          value:'username'
        },
        reddit: {
          include: true,
          value:'username'
        }
      };
    });
  };
})
.service('Contacts', function(contacts){
  this.getAll = function() {
    var options = {
      include_docs: true
    };
    return contacts.allDocs(options);
  };
  this.getOne = function(id) {
    return contacts.get(id);
  };
})
.service('Twitter', function($log, $ionicPlatform, $cordovaOauth) {
  var twitter = this;
  var consumerKey = '9yRqmPAhPCC0AoXAv4Ix3Momn';
  var consumerSecret = 'JseSSViyxfsR5IXEDfOL3W89L3wfFbI0kciPcR9pK9mRKKeauB';
  $ionicPlatform.ready(function() {
    twitter.auth = function () {
        return $cordovaOauth.twitter(consumerKey, consumerSecret);
    };
  });
})
.service('Github', function($log, $ionicPlatform, $cordovaOauth){
  var github = this;
  var clientID = 'd13a00e0a4ebd7049104';
  var clientSecret = '4be0bd0e1bbdc8570cb880dd2becbe6cccbe6543';
  var scopes = ['user'];
  $ionicPlatform.ready(function() {
    github.auth = function () {
      return $cordovaOauth.github(clientID, clientSecret, scopes);
    };
  });
});
