;(function(){

	var Session = function () {
		var self = this;
		var button = document.getElementById('nextButton');
		button.addEventListener('click', function() {
			self.handleNextClick();
		});
		this.questionHolder = document.getElementById('question-holder');
		
		this.radios = [];
		this.choices = [];

		this.quiz = new Quiz();
		this.renderQuestionPage();
	};

	Session.prototype = {
		handleNextClick: function() {
			event.preventDefault();
			if (this.choicePicked()) {
				this.quiz.saveChoice(this.getChoice());
				if (this.quiz.hasNextQ()) {
					this.quiz.nextQ();
					this.updateViewQ();
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
		updateViewQ: function() {
			this.clearQ();
			this.renderQuestionPage();
		},
		updateViewScore: function() {
			this.clearNextButton();
			this.renderScorePage();
		},
		clearQ: function() {
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
			var form = document.getElementById('question-holder');
			document.body.removeChild(form);
		},
		renderQuestion: function() {
			var problem = this.quiz.questions[this.quiz.activeQ];
			var question = document.createElement('h2');
			question.setAttribute('class', 'question');
			var questionText = document.createTextNode(problem.question);
			question.appendChild(questionText);
			this.questionHolder.appendChild(question);
		},
		renderChoice: function(i) {
			this.radios.push(document.createElement('input'));
			this.radios[i].setAttribute('type', 'radio');
			this.radios[i].setAttribute('class', 'radio');
			this.radios[i].setAttribute('name', 'choice');
			this.radios[i].setAttribute('value', i);
			this.questionHolder.appendChild(this.radios[i])
		},
		renderRadio: function(i) {
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
				this.renderChoice(i);
				this.renderRadio(i);
			}
		},
		renderScorePage: function() {
			var scoreHolder = document.createElement('h2');
			var scoreText = document.createTextNode("your score: " + this.quiz.calculateScore());
			scoreHolder.appendChild(scoreText);
			document.body.appendChild(scoreHolder);
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
		saveChoice: function(choice) {
			this.answerLog.push(choice);
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

