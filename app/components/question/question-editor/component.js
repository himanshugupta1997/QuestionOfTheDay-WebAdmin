import Ember from 'ember';
import Question from 'cbqotd/question/model';


export default Ember.Component.extend({
  elementId: 'question-editor',
  routing: Ember.inject.service(),
  init () {
    "use strict";
    this._super(...arguments);
    this.addObserver("q", this, function(controller,key) {
      $('#question-editor').show();
      this.set('question',this.q.question);
      this.set('option1', this.q.options[0].option);
      this.set('option2', this.q.options[1].option);
      this.set('option3', this.q.options[2].option);
      this.set('option4', this.q.options[3].option);
      this.set('opt1', this.q.options[0].correct);
      this.set('opt2', this.q.options[1].correct);
      this.set('opt3', this.q.options[2].correct);
      this.set('opt4', this.q.options[3].correct);
      this.set('qTags', this.q.tags ? this.q.tags.join(', ') : "");
    });
  },
  didRender: function() {
    if (this.get('questionId')) {
      if (!this.get('q')) {
        $('#question-editor').hide();
        Question.findById(this.get('questionId')).then(function (q) {
          "use strict";
          this.set('q', q.toJSON());
        }.bind(this));
      }
    }

  },

  actions : {
    submitQuestion () {
      "use strict";
      Question.upsert(this.get('questionId'),
        this.get('question'), [
          {option: this.get('option1'), correct: this.get('opt1')},
          {option: this.get('option2'), correct: this.get('opt2')},
          {option: this.get('option3'), correct: this.get('opt3')},
          {option: this.get('option4'), correct: this.get('opt4')},
        ],
        Parse.User.current(),
        this.get('qTags').split(/\s*,\s*/)
      ).then(function (q) {
        this.get('routing').transitionTo('question');
      }.bind(this));
    }
  }
});
