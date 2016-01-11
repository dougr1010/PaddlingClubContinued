/**
 * Created by dougritzinger on 10/20/15.
 */
app.controller('BulletinController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

    console.log('reached the Bulletin Board controller');
    $scope.message = "Welcome to the Bulletin Board.";


    //Display messages in db then wait for new messages
    getMessages();


    function getMessages() {
        $http.get('db/getMessage').then(function (response) {
            $scope.messages=response.data;
        });
    }


    //handle new message posting
    $scope.SubmitMessage = function(){
        console.log('saw Submit Message click');
        var dateNow = new Date();
        var messageData = {};
            messageData.dateMS = dateNow.getDate();
            messageData.date = dateNow.toDateString();
            messageData.username = $rootScope.loggedInAs;
            messageData.content = $scope.messageContent;

        $http({
            method: "POST",
            url: "db/addMessage",
            data: messageData
        }).then(function (response) {
            console.log('client reg response ', response);
            if(response.status == "200") {
                console.log("client: message added successfully");
                getMessages();
            } else {
                console.log('There was an error saving this message')
            }
            $scope.messageContent = "";
        });
    }

}]);