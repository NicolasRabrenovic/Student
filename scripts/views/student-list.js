var StudentListView = Backbone.View.extend({

	el: '#app',

	events: {
		'submit form': 'addStudent',
		'change input': 'seeStudent',
	},

	initialize : function () {

		// On lie la collection à la vue en instanciant new StudentCollection.
		this.StudentCollection = new StudentCollection();

		this.render();
	},

	addStudent: function (e) {
		e.preventDefault();

		var $form = $(e.currentTarget);

		var nom = $form.find('.student-nom').val();
		var prenom =$form.find('.student-prenom').val();
	

		// Avec ces données, on créé une nouvel instance du modèle
		var movie = new Movie({
			nom: nom,
			prenom: prenom,
			
		});

		// On ajoute ce modèle à la collection
		this.StudentCollection.add(movie);

		this.render();
	},

	seeStudent: function (e) {
		// e.preventDefault();
		var $input     = $(e.currentTarget);
		var inputValue = $input.val();
		var nom      = $input.parents('div.movie').attr('data-title');
		var movie      = this.StudentCollection.findWhere({
			nom: nom,
		});

		if (movie) {
			movie.set({
				present: inputValue == 'present' ? true : false,
			});
		}

		this.updateCounters();

	},

	getMovieTemplate : function(movie) {

		var nom = '<h5>'+movie.nom+'</h5>';
		var prenom = '<h5>'+movie.prenom+'</h5>';
	
		var present = '';
		var notpresent = 'checked';

		if (movie.present) {
			present = 'checked';
			notpresent = '';
		}

		var movieTemplate = '\
			<div class="panel panel-default medium-6 columns movie" data-title="'+movie.nom+'">\
				<div class="panel-header">'+nom+'</div>\
					<div class="panel-header">'+prenom+'</div>\
				<div class="panel-body">\
					\
					<form>\
						<label>Present</label>\
						<input '+present+' type="radio" class="movie-present" name="movie" value="present" /><br>\
						<label>Absent</label>\
						<input '+notpresent+' type="radio" class="movie-not-present" name="movie" value="not-present" />\
					</form>\
				</div>\
			</div>\
		';

		// On retourne la string convertie en html grâce à jQuery
		return $(movieTemplate);
		
	},

	updateCounters: function () {

		var myMovies = this.StudentCollection.toJSON();
		var not_present_movies = this.StudentCollection.where({
			present: false,
		});

		$('.student-count').empty();
		$('.student-count').append(myMovies.length);

		$('.student-notpresent-count').empty();
		$('.student-notpresent-count').append(not_present_movies.length);

		$('.student-present-count').empty();
		$('.student-present-count').append(myMovies.length - not_present_movies.length);

	},

	render: function () {
		
		var $studentList = this.$('.student-list');
		
		var myStudents = this.StudentCollection.toJSON();

		$studentList.empty();

		for (var i = 0; i < myStudents.length; i++) {
			var movie = myStudents[i];

			var movieTemplate = this.getMovieTemplate(movie);

			$studentList.append(movieTemplate);
		}

		this.updateCounters();
	},
});
