;(function(){

	var Session = function () {
		var self = this;
		var button = document.getElementById('nextButton');
		button.addEventListener('click', function() {
			self.handleNextClick(self);
		});
		this.questionHolder = document.getElementById('question-holder');
		this.quiz = new Quiz();
		for (var i = 0; i < 10; i++) {
			this.quiz.addQ(new Problem());
		};
		this.activeQ = 0;
		this.answerLog = [];
		this.render(this);
	};

	Session.prototype = {
		nextQ: function() {
			this.activeQ += 1;
		},
		handleNextClick: function(self) {
			event.preventDefault();
			self.nextQ();
			self.updateView(self);
		},
		updateView: function(self) {
			self.clear(self);
			self.render(self);
		},
		clear: function(self) {
			var question = document.getElementsByClassName('question');
			var radios = document.getElementsByClassName('radio');
			var choices = document.getElementsByClassName('choice');
			self.questionHolder.removeChild(question[0]);

			var length = radios.length;
			for (var i = 0; i < length; i++) {
				self.questionHolder.removeChild(choices[0]);
				self.questionHolder.removeChild(radios[0]);
			}	
		},
		render: function(self) {
			var problem = self.quiz.questions[self.activeQ];
			var question = document.createElement('h2');
			question.setAttribute('class', 'question');
			var questionText = document.createTextNode(problem.question);
			question.appendChild(questionText);
			self.questionHolder.appendChild(question);

			var radios = [];
			var choices = [];
			for(var i = 0; i < problem.choices.length; i++){
				radios.push(document.createElement('input'));
				radios[i].setAttribute('type', 'radio');
				radios[i].setAttribute('class', 'radio');
				self.questionHolder.appendChild(radios[i])

				choices.push(document.createElement('p'));
				choices[i].setAttribute('class', 'choice');
				choices[i].appendChild(document.createTextNode(problem.choices[i]));
				self.questionHolder.appendChild(choices[i]);
			}
		}
	};

	var Quiz = function(){
		this.questions = [];
	};

	Quiz.prototype = {
		addQ: function(question) {
			this.questions.push(question);
		}
	};

	var Problem = function(){
		this.question = Math.random().toString();
		this.choices = [Math.random().toString(),"Kevin","Mike","Veronica"];
		this.correctAnswer = 1;
	};

	var session = new Session();

})();

