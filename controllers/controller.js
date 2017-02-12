var notesApp = angular.module("notesApp", ['ngRoute']);

notesApp.controller('noteList', function ($scope, $timeout, $location) {

	console.log("controller Called");

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


	$scope.showNote = function(noteid) {
		$location.path('/note/' + noteid);
	};

});


notesApp.controller('noteDetails', function ($scope, $location, $routeParams) {
	var noteRef = firebase.database().ref('Notes/' + $routeParams['id']);
	noteRef.on('value', function(snapshot) {
    	$scope.note = snapshot.val();
		console.log(snapshot.val());
		// If snapshot.val() is undefined, then we are adding a new note.
		if (! $scope.note) {
			$scope.note = {title: "", value: "", id: $routeParams['id'], add:"true"}
		}
	});

	

	$scope.updateNote = function() {
		var fbRef = firebase.database().ref('Notes/' + $scope.note.id);
		var id = $scope.note.id;
		var title = $scope.note.title;
		var value = $scope.note.value;
		var note = {'title':title, 'value':value, 'id':id};
		fbRef.set(note);
		$location.path('/');
	};
});
