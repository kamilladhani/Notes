var notesApp = angular.module("notesApp", ['ngRoute']);

notesApp.controller('noteList', function ($scope, $timeout, $location) {

	console.log("controller Called");

	// Delay "No results" message while things load
	$scope.delay = true;
    $timeout(function(){
        $scope.delay = false;
    }, 600);

	$scope.notes = [];
	var notesRef = firebase.database().ref().child('Notes');

	notesRef.on("child_added", snap => {
		$timeout(function() {
			console.log("listener");
			var title = snap.child("title").val();
			var value = snap.child("value").val();
			var id = snap.child("id").val();
			$scope.notes.push({title: title, value: value, id:id});
		});
	});

	notesRef.on("child_removed", snap => {
		$timeout(function() {
			console.log("listener");
			var id = snap.child("id").val();
			for (var i=0; i<$scope.notes.length; i++) {
				if (id==$scope.notes[i].id) {
					$scope.notes.splice(i,1);
					break;
				}
			}
		});
	});


	$scope.newNote = function() {
		var fbRef = firebase.database().ref().child("Notes");

		var id = 0;
		var keys = [];

		// Get a list of the keys
		fbRef.on('value', function(snapshot) {
	    	keys = Object.keys(snapshot.val());
		});

		// Find an available key
		for (var i = 1; i <= 100000; i++) {
			if (!(keys.indexOf(i.toString()) >= 0)) {
				id = i;
				break;
			}
		}

		$location.path('/note/' + id);
	};

	$scope.showList = function() {
		$location.path('#/');
	};

	$scope.showNote = function(noteid) {
		$location.path('/note/' + noteid);
	};


	$scope.deleteNote = function(noteid) {
		swal({
			title: "Are you sure you want to delete this note?",
			text: "You will not be able to recover it!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		},
		function(){
			var noteRef = firebase.database().ref('Notes/' + noteid);
		    noteRef.remove();
			console.log("confirmed");
		    swal({
		    	title: "Deleted!", 
		    	text: "Your note has been deleted", 
		    	type: "success", 
		    	timer: 2000
		    });
		});

		$location.path('/');
	};



});



notesApp.controller('noteDetails', function ($scope, $route, $timeout, $location, $routeParams) {
	var noteRef = firebase.database().ref('Notes/' + $routeParams['id']);
	noteRef.on('value', function(snapshot) {
    	$scope.note = snapshot.val();
		console.log(snapshot.val());
		// If snapshot.val() is undefined, then we are adding a new note.
		if (! $scope.note) {
			$scope.note = {title: "", value: "", id: $routeParams['id'], add:"true"}
		}
	});

	// $scope.clearSearch = function() {
	// 	angular.element('#clearSearch').triggerHandler('click');
	// }

	$scope.updateNote = function($state) {
		var fbRef = firebase.database().ref('Notes/' + $scope.note.id);
		var id = $scope.note.id;
		var title = $scope.note.title;
		var value = $scope.note.value;
		var note = {'title':title, 'value':value, 'id':id};
		fbRef.set(note);
		$timeout(function() {
			$("#clearSearch").click();
		});
		$location.path('/');
	};


});
