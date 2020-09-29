import React, {Component} from "react"; 
import axios from 'axios';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';  


class Filter extends Component { 

    constructor(props) { 
        super(props);
        this.state = { 
          questionBank: [], 
          alreadyAnswered: [], 
          score: 0, 
          responses: 0 
        }; 
        this.answerOptions = [];

    };


    getQuestions = () => {
        axios.get('https://opentdb.com/api.php?amount=4')
        .then(question => { 
          this.setState({questionBank: question.data.results}); 
        }); 
    
    };

    answerClicked(id, answer, correct_answer) {
        // console.log(id, answer, correct_answer);
        this.state.alreadyAnswered.indexOf(id);
        if (this.state.alreadyAnswered.indexOf(id) != -1 ) {
            return false;
        }    

        this.state.alreadyAnswered.push(id);
        if (answer == correct_answer) {
          this.setState({score: this.state.score+1}); 
        }
    }


    componentDidMount() { 
        this.getQuestions();
    } 

    createAnswerOptionArray(incorrect_answers, correct_answer){
        var answerOptionsArray = [];
        answerOptionsArray = [...incorrect_answers, correct_answer];
        this.answerOptions = answerOptionsArray.sort();
        return;
    }
    
clickMe = (event) => {
    this.props.clickMe(event.target.value)
}

    render() { 
        return (
                <div className="Filter" onChange={this.clickMe}>
                    <h5>Number of Questions:</h5>
                    <input type="radio" id="5" name="numberofQuestion" value="5" />
                    <label htmlFor="5">5</label>
                    <input type="radio" id="10" name="numberofQuestion" value="10"/>
                    <label htmlFor="10">10</label>
                    <input type="radio" id="20" name="numberofQuestion" value="20"/>
                    <label htmlFor="20">20</label>
                </div>    
        );
    }
}    
export default Filter; 
