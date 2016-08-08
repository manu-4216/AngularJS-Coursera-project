'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            $scope.dishes = [];

            menuFactory.getDishes().query(
              function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
              },
              function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
              }
            );


            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory',  function($scope, feedbackFactory) {

            $scope.sendFeedback = function() {

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                }
                else {
                    $scope.invalidChannelSelection = false;
                    // Send the feedback:
                    feedbackFactory.getFeedback().save($scope.feedback);
                    
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

          $scope.dish = {};
          $scope.showDish = false;
          $scope.message ="Loading ...";

          var _id = parseInt($stateParams.id, 10);
          menuFactory.getDishes().get({id:_id})
          .$promise.then(
              function(response){
                $scope.dish = response;
                $scope.showDish = true;
              },
              function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
              }
          );

        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            //Step 1: Create a JavaScript object to hold the comment from the form
            $scope.tempCommentObject = {
              rating:5,
              comment:"",
              author:"",
              date:"just now"
            };

            $scope.ratingChoices = [1,2,3,4,5];

            $scope.submitComment = function () {

                //Step 2: This is how you record the date
                $scope.tempCommentObject.date = new Date().toISOString();

                // Step 3: Push your comment into the dish's comment array
                $scope.dish.comments.push($scope.tempCommentObject);

                // Extra step - week 4: update the dish with the new added comment to the server:
                menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);

                //Step 4: reset your form to pristine
                $scope.commentForm.$setPristine();

                //Step 5: reset your JavaScript object that holds your comment
                $scope.tempCommentObject = {
                  rating:5,
                  comment:"",
                  author:"",
                  date:""
                };

            };
        }])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
          /* The instructions weren't clear about which dish to consider featured.
           * Since in the video the 1st dish was being displayed, I took this one:
           */
          $scope.featured = {};
          $scope.showFeatured = false;
          $scope.messageFeatured = "Loading ...";
          menuFactory.getDishes().get({id:0})
            .$promise.then(
               function(response){
                    $scope.featured = response;
                    $scope.showFeatured = true;
                },
                function(response) {
                    $scope.messageFeatured = "Error: "+response.status + " " + response.statusText;
                }
            );


            $scope.promotion = {};
            $scope.showPromotion = false;
            $scope.messagePromotion = "Loading...";
            menuFactory.getPromotion().get({id:0})
            .$promise.then(
              function(response) {
                $scope.promotion = response;
                $scope.showPromotion = true;
              },
              function(response) {
                $scope.messagePromotion = "Error: " + response.status + " " + response.statusText;
              }
            )


          /*   Get the "executive chef". Steps:
          * 1 - get the list of leaders with .query()
          * 2 - filter the previous list with .filter()
          *     PS: The result of Array.filter() is an Array. Adding [0] at the
          *         end transforms it into an object (or undefined if no match).
          * 3 - check if there was an Executive Chef in the list
          */

          // Declare the leaders list that will be requested:
          var leaderArray = [];
          $scope.leaderEC = {};

          $scope.showLeaderEC = false;
          $scope.messageLeaderEC = "Loading...";

          corporateFactory.getLeaders().query(
            function(response) {
              leaderArray = response;
              // Find the EC (Exec. Chef) using the Array.filter() JS function:
              $scope.leaderEC = leaderArray.filter(function(item) {
                return (item.designation === "Executive Chef");
              })[0];
              // Check if there was an EC in the list:
              if (typeof $scope.leaderEC === "undefined") {
                $scope.messageLeaderEC = "Error: no executive chief was found";
              } else {
                $scope.showLeaderEC = true;
              }
            },
            function(response) {
              $scope.messageLeaderEC = "Error: " + response.status + " " + response.statusText;
            }
          );

        }])


        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
          $scope.leaders = {};
          $scope.showLeaders = false;
          $scope.messageLeaders = "Loading...";

          corporateFactory.getLeaders().query(
            function(response) {
              $scope.leaders = response;
              $scope.showLeaders = true;
            },
            function(response) {
              console.log(response);
              $scope.messageLeaders = "Error: " + response.status + " " + response.statusText;
              console.log($scope.showLeaders);
            }
          );

        }])

;
