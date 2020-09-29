import React, {Component} from "react"; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  
import $ from "jquery";
import Filter from './Filter';
import Pagination from './Pagination';

class Quiz extends Component { 

    constructor() { 
        super(); 
        this.state = { 
          questionBank: [], 
          alreadyAnswered: [], 
          score: 0, 
          responses: 0,
          pageOfItems: []
        }; 
        this.answerOptions = [];
        this.onChangePage = this.onChangePage.bind(this);

    };

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
        console.log(this.state.pageOfItems);
    }

    getQuestions = (fValue) => {
        axios.get("https://opentdb.com/api.php?amount="+fValue)
        .then(question => { 
          this.setState({questionBank: question.data.results}); 
        }); 
    
    };

    answerClicked(id, answer, correct_answer) {
        console.log(id, answer, correct_answer);
        this.state.alreadyAnswered.indexOf(id);
        if (this.state.alreadyAnswered.indexOf(id) != -1 ) {
            return false;
        }    

        this.state.alreadyAnswered.push(id);
        if (answer == correct_answer) {
          this.setState({score: this.state.score+1}); 
        }
    }

    handleClick = (fValue) => {
        this.getQuestions(fValue);

    }


    componentDidMount() { 
        this.getQuestions(5);
    } 

    createAnswerOptionArray(incorrect_answers, correct_answer){
        var answerOptionsArray = [];
        answerOptionsArray = [...incorrect_answers, correct_answer];
        this.answerOptions = answerOptionsArray.sort();
        return;
    }
    
    render() { 
        var finalAnswers = ''
        return (
            <div className="row">
                <div className="container-md">                      
                    Your Score = {this.state.score}

                    <Filter clickMe={this.handleClick} ></Filter>

                    {this.state.questionBank.length > 0 &&
                        this.state.questionBank.map( ({question, incorrect_answers, correct_answer}, Qindex) =>
                            <div key={Qindex}>
                                <h2>{question}</h2>
                                {finalAnswers = this.createAnswerOptionArray(incorrect_answers, correct_answer)}
                                {this.answerOptions.map( (answer, index) =>
                                    <button key={index} onClick={()=>this.answerClicked(Qindex, answer, correct_answer)}>{answer}</button>
                                )}
                            </div>
                        )
                    }

                    <Pagination items={this.state.questionBank} onChangePage={this.onChangePage} />
                </div>
            </div>    
        );
    }
}    
export default Quiz; 
