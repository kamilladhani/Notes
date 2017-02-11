var notesApp = angular.module("notesApp", ['ngRoute']);

notesApp.controller('noteList', function ($scope, $timeout) {

	console.log("controller Called");

	$scope.notes = [];
	var notesRef = firebase.database().ref().child('Notes');
	notesRef.on("child_added", snap => {
		$timeout(function() {
			console.log("listener");
			var title = snap.child("title").val();
			var value = snap.child("value").val();
			$scope.notes.push({title: title, value: value});
		});
	});


	$scope.addNote = function () {

		var fbRef = firebase.database().ref().child("Notes");
		var title = $scope.newNote.title;
		var value = $scope.newNote.value;

		var note = {'title':title, 'value':value};

		fbRef.push().set(note);

	};
});

