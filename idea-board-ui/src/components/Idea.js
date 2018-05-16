import React, { Component } from 'react'

class Idea extends Component {

    render() {
        return (
            <div>
                <div>
                    <input
                        name="title"
                        value={this.props.title} 
                        onChange={(event) => this.props.handleIdeaChange(event, this.props.index)}
                        onBlur={() => this.props.updateIdea(this.props.index)}/>
                </div>

                <div>
                    <textarea
                        name="description"                        
						value={this.props.description} 
                        onChange={(event) => this.props.handleIdeaChange(event, this.props.index)}
                        onBlur={() => this.props.updateIdea(this.props.index)}/>
                </div>

                <div>
                    <button
                        onClick={() => this.props.deleteIdea(this.props.id, this.props.index)}>
                        Delete
                    </button>
                </div>
                <hr />
            </div>
        )
    }

}

export default Idea