var React = require('react');
var _ = require('lodash').noConflict();
var KeyCodez = require('keycodez');

var Validation = require('./lib/validation');
var ErrorMessages = require('./lib/errors');

var Button = require('./button');
var QuestionSet = require('./questionSet');

class QuestionPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validationErrors: this.props.validationErrors
    };
  }

  handleAnswerValidate(questionId, questionAnswer, validations) {
    if (typeof validations === 'undefined'
      || validations.length === 0) {
      return;
    }

    /*
     * Run the question through its validations and
     * show any error messages if invalid.
     */
    var questionValidationErrors = [];
    validations
      .forEach(validation => {
        if (Validation.validateAnswer(
            questionAnswer,
            validation,
            this.props.questionAnswers
          )) {
          return;
        }

        questionValidationErrors.push({
          type: validation.type,
          message: ErrorMessages.getErrorMessage(validation)
        });
      });

    var validationErrors = _.chain(this.state.validationErrors)
      .set(questionId, questionValidationErrors)
      .value();

    this.setState({
      validationErrors: validationErrors
    });
  }

  handleMainButtonClick() {
    var action = this.props.action.default;
    var conditions = this.props.action.conditions || [];

    /*
     * We need to get all the question sets for this panel.
     * Collate a list of the question set IDs required
     * and run through the schema to grab the question sets.
     */
    var questionSetIds = this.props.questionSets.map(qS => qS.questionSetId);
    var questionSets = _.chain(this.props.schema.questionSets)
      .filter(qS => questionSetIds.indexOf(qS.questionSetId) > -1)
      .value();

    /*
     * Get any incorrect fields that need error messages.
     */
    var invalidQuestions = Validation.getQuestionPanelInvalidQuestions(
      questionSets, this.props.questionAnswers
    );

    /*
     * If the panel isn't valid...
     */
    if (Object.keys(invalidQuestions).length > 0) {
      var validationErrors = _.mapValues(invalidQuestions, validations => {
        return validations.map(validation => {
          return {
            type: validation.type,
            message: ErrorMessages.getErrorMessage(validation)
          };
        })
      });

      this.setState({
        validationErrors: validationErrors
      });
      return;
    }

    /*
     * Panel is valid. So what do we do next?
     * Check our conditions and act upon them, or the default.
     */
    conditions
      .forEach(condition => {
        var answer = this.props.questionAnswers[condition.questionId];

        action = answer == condition.value
          ? {
            action: condition.action,
            target: condition.target
          }
          : action;
      });

    /*
     * Decide which action to take depending on
     * the action decided upon.
     */
    switch (action.action) {

    case 'GOTO':
      this.props.onSwitchPanel(action.target);
      break;

    case 'SUBMIT':
      this.props.onSubmit(action.target);
      break;
    }
  }

  handleBackButtonClick() {
    this.props.onPanelBack();
  }

  handleAnswerChange(questionId, questionAnswer, validations, validateOn) {
    this.props.onAnswerChange(questionId, questionAnswer);

    this.setState({
      validationErrors: _.chain(this.state.validationErrors)
        .set(questionId, [])
        .value()
    });

    if (validateOn === 'change') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleQuestionBlur(questionId, questionAnswer, validations, validateOn) {
    if (validateOn === 'blur') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleInputKeyDown(e) {
    if (KeyCodez[e.keyCode] === 'enter') {
      e.preventDefault();
      this.handleMainButtonClick.call(this);
    }
  }

  render() {
    var questionSets = this.props.questionSets.map(questionSetMeta => {
      var questionSet = _.find(this.props.schema.questionSets, {
        questionSetId: questionSetMeta.questionSetId
      });

      if (!questionSet) {
        return undefined;
      }

      return (
        <QuestionSet key={questionSet.questionSetId}
          id={questionSet.questionSetId}
          name={questionSet.name}
          questionSetHeader={questionSet.questionSetHeader}
          questionSetText={questionSet.questionSetText}
          questions={questionSet.questions}
          classes={this.props.classes}
          questionAnswers={this.props.questionAnswers}
          renderError={this.props.renderError}
          renderRequiredAsterisk={this.props.renderRequiredAsterisk}
          validationErrors={this.state.validationErrors}
          onAnswerChange={this.handleAnswerChange.bind(this)}
          onQuestionBlur={this.handleQuestionBlur.bind(this)}
          onFocus={this.props.onFocus}
          onKeyDown={this.handleInputKeyDown.bind(this)}
        />
      );
    });

    var completionPercent = 0;

    if (typeof this.props.progress !== 'undefined') {
      if (!this.props.progress.variation || this.props.progress.variation === 'classic') {
        completionPercent = Math.floor(100 / this.props.numPanels * this.props.currentPanelIndex);
      } else if (this.props.progress.variation === 'only-completed' && this.props.questionAnswers) {
        const questionSetsCompleted = this.props.schema.questionSets.reduce((acc, qs) =>
          acc.concat(qs.questions.map(q => ({
            questionId: q.questionId,
            answered: !!this.props.questionAnswers[q.questionId]
          }))), []);
        let nQuestionsCompleted = questionSetsCompleted.filter(e => e.answered).length;
        let nQuestionsTotal = questionSetsCompleted.length;
        completionPercent = Math.floor(100 / nQuestionsTotal * nQuestionsCompleted);
      }
    }
    var progressBar = undefined;
    if (typeof this.props.progress !== 'undefined' && this.props.progress.showBar) {
      progressBar = (
        <div className={this.props.classes.progressBar}>
          <div className={this.props.classes.progressBarTitle}>
            {this.props.progress.text}
            {this.props.progress.legendPosition === 'inline' ? `${completionPercent}%` : ''}
          </div >
          {this.props.progress.legendPosition === 'top' ? (<div className={this.props.classes.progressBarLegend}>
            {this.props.progress.showPercent ? `${completionPercent}%` : ''}
          </div >) : null}
          <div className={this.props.classes.progressBarIncomplete}>
            <div className={this.props.classes.progressBarComplete}
              style={{width: `${completionPercent}%`}}
            ></div >
            {this.props.progress.legendPosition === 'bar' ? (
              <div className={this.props.classes.progressBarLegend}>
                {this.props.progress.showPercent ? `${completionPercent}%` : ''}
              </div >) : null}
          </div >
        </div >);
    }

    return (
      <div className={this.props.classes.questionPanel}>
        {this.props.progress && this.props.progress.position === 'top' ? progressBar : undefined}
        {typeof this.props.panelHeader !== 'undefined'
        || typeof this.props.panelText !== 'undefined'
          ? (
            <div className={this.props.classes.questionPanelHeaderContainer}>
              {typeof this.props.panelHeader !== 'undefined'
                ? (
                  <h3 className={this.props.classes.questionPanelHeaderText}>
                    {this.props.panelHeader}
                  </h3 >
                )
                : undefined}
              {typeof this.props.panelText !== 'undefined'
                ? (
                  <p className={this.props.classes.questionPanelText}>
                    {this.props.panelText}
                  </p >
                )
                : undefined}
            </div >
          )
          : undefined}
        <div className={this.props.classes.questionSets}>
          {questionSets}
        </div >
        {this.props.progress && this.props.progress.position === 'middle' ? progressBar : undefined}
        <div className={`${this.props.classes.buttonBar} ${this.props.extraClasses.buttonBar || ''}`}>
          {this.props.currentPanelIndex > 0
          && !this.props.backButton.disabled
            ? (
              <Button text={this.props.backButton.text || 'Back'}
                onClick={this.handleBackButtonClick.bind(this)}
                className={`${this.props.classes.backButton} ${this.props.extraClasses.backButton || ''}`}
              />
            )
            : undefined}
          {!this.props.button.disabled
            ? (
              <Button text={this.props.button.text}
                onClick={this.handleMainButtonClick.bind(this)}
                className={`${this.props.classes.controlButton} ${this.props.extraClasses.button || ''}`}
              />
            )
            : undefined}
        </div >
        {this.props.progress && this.props.progress.position === 'bottom' ? progressBar : undefined}
      </div >
    );
  }

};

QuestionPanel.defaultProps = {
  validationErrors: {},
  schema: {},
  classes: {},
  extraClasses: {},
  panelId: undefined,
  panelIndex: undefined,
  panelHeader: undefined,
  panelText: undefined,
  progress: undefined,
  numPanels: undefined,
  currentPanelIndex: undefined,
  action: {
    default: {},
    conditions: []
  },
  button: {
    text: 'Submit'
  },
  backButton: {
    text: 'Back'
  },
  questionSets: [],
  questionAnswers: {},
  renderError: undefined,
  renderRequiredAsterisk: undefined,
  onAnswerChange: () => {
  },
  onSwitchPanel: () => {
  },
  onPanelBack: () => {
  },
  onFocus: () => {
  },
};

module.exports = QuestionPanel;
