import React, {Component} from "react"; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  
import $ from "jquery";
import Filter from './Filter';

class Quiz extends Component { 

    constructor() { 
        super(); 
        this.state = { 
          questionBank: [], 
          alreadyAnswered: [], 
          score: 0, 
          responses: 0,
          slicedItem: [],
          pages: [],
          pager: {}
        }; 
        this.answerOptions = []
    };

    onChangePage(slicedItem) {
        // update state with new page of items
        this.setState({ slicedItem: slicedItem });
        console.log(this.state.slicedItem);
    };

    getQuestions = (fValue) => {
        axios.get("https://opentdb.com/api.php?amount="+fValue)
        .then(question => { 
            this.setState({questionBank: question.data.results}); 
        })
        .then(() => { 
            this.setPage(1);
        }); 
    };

    answerClicked(id, answer, correct_answer) {
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
    
    getPager = (totalItems, ItemPerpage, currentPage) => {

        var totalPages = Math.ceil(totalItems / ItemPerpage);
        var startPage = 1;
        var endPage = totalPages;
        var startIndex = (currentPage - 1) * ItemPerpage;
        var endIndex = ((currentPage - 1) * ItemPerpage) + (ItemPerpage-1);

        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
        
        console.log(pages)

        this.setState({ pages: pages });

        return {
            totalItems: totalItems,
            ItemPerpage: ItemPerpage,
            currentPage: currentPage,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        }

    }

    setPage(currentPage) {
        var items = this.state.questionBank;
        var pager = this.state.pager;

        if (currentPage < 1 || currentPage > pager.totalPages) {
            return;
        }

        pager = this.getPager(items.length, 2, currentPage);
        console.log(pager)

        var slicedItem = items.slice(pager.startIndex, pager.endIndex + 1);

        this.setState({ pager: pager });

        console.log(slicedItem);
        this.onChangePage(slicedItem);
    }


    render() { 
        var pager = this.state.pager;

        return (
            <div className="row">
                <div className="container-md">                      
                    Your Score = {this.state.score}

                    <Filter clickMe={this.handleClick} ></Filter>


                    {this.state.questionBank.length > 0 &&
                        this.state.slicedItem.map( ({question, incorrect_answers, correct_answer}, Qindex) =>
                            <div key={Qindex}>
                                <h2>{question}</h2>
                                {this.createAnswerOptionArray(incorrect_answers, correct_answer)}
                                {this.answerOptions.map( (answer, index) =>
                                    <button key={index} onClick={()=>this.answerClicked(Qindex, answer, correct_answer)}>{answer}</button>
                                )}
                            </div>
                        )
                    }

                    {this.state.pages.map((page,Pindex) => (
                        <a href="!#" onClick={() => this.setPage(page)}>{page}</a>
                    ))}
                </div>
            </div>    
        );
    }
}    
export default Quiz; 
