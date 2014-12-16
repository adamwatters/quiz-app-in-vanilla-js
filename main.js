;(function(){

	var Session = function () {
		var self = this;

		var backButton = document.getElementById('back-button');
			backButton.addEventListener('click', function() {
			self.handleBackClick();
		});
		var nextButton = document.getElementById('next-button');
		nextButton.addEventListener('click', function() {
			self.handleNextClick();
		});

		this.questionHolder = document.getElementById('question-holder');
		
		this.radios = [];
		this.choices = [];

		this.quiz = new Quiz();
		$(this.questionHolder).fadeIn(300);
		this.renderQuestionPage();
	};

	Session.prototype = {
		handleBackClick: function() {
			event.preventDefault();
			if (this.choicePicked()) {
				this.quiz.saveChoice(this.quiz.activeQ, this.getChoice())
			}
			console.log(this.quiz.answerLog);
			if (this.quiz.hasPreviousQ()) {
				this.quiz.previousQ();
				this.updateViewQuestion();
			}

		},
		handleNextClick: function() {
			event.preventDefault();
			if (this.choicePicked()) {
				this.quiz.saveChoice(this.quiz.activeQ, this.getChoice());
				console.log(this.quiz.answerLog);
				if (this.quiz.hasNextQ()) {
					this.quiz.nextQ();
					this.updateViewQuestion();
				} else {
					this.updateViewScore();
				}
			}
		},
		choicePicked: function() {
			return this.radios.some(function(element){
				return element.checked;
			})
		},
		getChoice: function() { 
			for (var i = 0; i < this.radios.length; i++) {
				if(this.radios[i].checked){
					return this.radios[i].value;
				}
			}
		},
		updateViewQuestion: function() {
			var self = this;
			$(this.questionHolder).fadeOut(300, function(){
				self.clearQuestion();
				self.renderQuestionPage();
				$(self.questionHolder).fadeIn(300)
			});
		},
		updateViewScore: function() {
			var self = this;
				$(this.questionHolder).fadeOut(300, function(){
					self.clearQuestion();
					self.clearNextButton();
					self.renderScorePage();
					$(self.questionHolder).fadeIn(500);
			});
		},
		clearQuestion: function() {
			var question = document.getElementsByClassName('question');
			var radios = document.getElementsByClassName('radio');
			var choices = document.getElementsByClassName('choice');
			this.questionHolder.removeChild(question[0]);

			var length = radios.length;
			for (var i = 0; i < length; i++) {
				this.questionHolder.removeChild(choices[0]);
				this.questionHolder.removeChild(radios[0]);
			}
			this.radios = [];
			this.choices = [];
		},
		clearNextButton: function() {
			var nextButton = document.getElementById('next-button');
			var backButton = document.getElementById('back-button');
			this.questionHolder.removeChild(nextButton);
			this.questionHolder.removeChild(backButton);
		},
		renderQuestion: function() {
			var problem = this.quiz.questions[this.quiz.activeQ];
			var question = document.createElement('h2');
			question.setAttribute('class', 'question');
			var questionText = document.createTextNode("Question " + (this.quiz.activeQ + 1) + " of " + this.quiz.questions.length + ": " + problem.question);
			question.appendChild(questionText);
			this.questionHolder.appendChild(question);
		},
		renderRadio: function(i) {
			this.radios.push(document.createElement('input'));
			this.radios[i].setAttribute('type', 'radio');
			this.radios[i].setAttribute('class', 'radio');
			this.radios[i].setAttribute('name', 'choice');
			this.radios[i].setAttribute('value', i);
			if (i === +this.quiz.answerLog[this.quiz.activeQ]) {
				this.radios[i].setAttribute('checked', true);
			}
			this.questionHolder.appendChild(this.radios[i]);
		},
		renderChoice: function(i) {
			var problem = this.quiz.questions[this.quiz.activeQ];
			this.choices.push(document.createElement('p'));
			this.choices[i].setAttribute('class', 'choice');
			this.choices[i].appendChild(document.createTextNode(problem.choices[i]));
			this.questionHolder.appendChild(this.choices[i]);
		},
		renderQuestionPage: function() {
			var problem = this.quiz.questions[this.quiz.activeQ];
			this.renderQuestion();
			for(var i = 0; i < problem.choices.length; i++){
				this.renderRadio(i);
				this.renderChoice(i);
			}
		},
		renderScorePage: function() {
			var scoreHolder = document.createElement('h2');
			var scoreText = document.createTextNode("your score: " + this.quiz.calculateScore() + " / " + this.quiz.questions.length);
			scoreHolder.appendChild(scoreText);
			this.questionHolder.appendChild(scoreHolder);
		}
	};

	var Quiz = function(){
		this.questions = [];
		this.populate(tableSawQuiz);
		this.answerLog = [];
		this.activeQ = 0;
	};

	Quiz.prototype = {
		addQ: function(question) {
			this.questions.push(question);
		},
		populate: function(quizJSON) {
			for (var i = 0; i < quizJSON.length; i++) {
				this.addQ(new Problem(quizJSON[i]));
			};
		},
		saveChoice: function(questionNumber, choice) {
			this.answerLog[questionNumber] = choice;
		},
		previousQ: function() {
			this.activeQ -= 1;
		},
		hasPreviousQ: function() {
			return this.activeQ > 0;
		},
		nextQ: function() {
			this.activeQ += 1;
		},
		hasNextQ: function() {
			return this.activeQ < this.questions.length - 1;
		},
		calculateScore: function() {
			var score = 0;
			for (var i = 0; i < this.questions.length; i++) {
				if (this.questions[i].correctAnswer === +this.answerLog[i]) {
					score ++;
				}
			}
			return score;
		}
	};

	var Problem = function(problemJSON){
		this.question = problemJSON['question'];
		this.choices = problemJSON['choices'];
		this.correctAnswer = problemJSON['correctAnswer'];
	};

	var session = new Session();

})();

