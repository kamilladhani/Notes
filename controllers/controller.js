
var notesApp = angular.module("notesApp", ['ngRoute']);

notesApp.controller('noteList', function ($scope) {
	$scope.notes = [
		{title:'Kamil', value: 'Vancouver'}, 
		{title:'John', value: 'Whistler'},
		{title:'Trisha', value: 'Toronto'},
		{title:'Colleen', value: 'Waterloo'}
	];

	$scope.addNote = function () {

		var fbRef = firebase.database().ref();

		var title = $scope.newNote.title;
		var value = $scope.newNote.value;

		var note = {'title':title, 'value':value};

		fbRef.push().set(note);

	};
});