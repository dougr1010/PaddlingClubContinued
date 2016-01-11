/**
 * Created by dougritzinger on 10/21/15.
 */
app.controller('LogInController', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    console.log('reached the Log In controller');


    $scope.logIn = function() {
        console.log('LoginController: saw Login click');

        var jstring = {
            username : $scope.username,
            password : $scope.password
        };

        $http({
            method: "POST",
            url: "users/login",
            data: jstring
        }).then(function (resp) {
            //if the login attempt succeeded
            if (resp.data=="OK") {
                $rootScope.loggedInAs=$scope.username;

                // get user data
                var loggedInUser = $scope.username;

                // get logged in user data to determine access permissions
                $http.get('users/getUser/'+loggedInUser).then(function(response){
                    $rootScope.isTripLeader = response.data.isTripLeader;
                    $rootScope.isPresident = response.data.isPresident;
                    $rootScope.isWebMaster = response.data.isWebMaster;

                    //ng-show the Bulletin Board and myTrips pages only if logged in
                    $rootScope.LoggedIn = (($rootScope.loggedInAs != 'undefined') && (typeof $rootScope.loggedInAs == 'string'));

                    //ng-show trip leader page nav only if a trip leader
                    $rootScope.TripLeader = (($rootScope.LoggedIn == true) && ($rootScope.isTripLeader == true));

                    //ng-show the admin page nav only if WebMaster
                    $rootScope.WebMaster = (($rootScope.LoggedIn) && ($rootScope.isWebMaster == true));

                    alert("Thank you for logging in!");
                    $location.path('/home');
                });
            }
            //Otherwise, if the attempt failed
            else {
                console.log('LoginController: client/else:');
                console.log(resp);
                alert("Login attempt failed, please try again");
            }
        })
    };

}]);
