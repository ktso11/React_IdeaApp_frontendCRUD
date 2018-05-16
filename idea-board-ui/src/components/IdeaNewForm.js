import React, { Component } from 'react'

class IdeaNewForm extends Component {

    state = {
        newIdea: {}
    }

    handleChange = (event) => {
        const attributeToChange = event.target.name
        const newValue = event.target.value

        const updatedNewIdea = { ...this.state.newIdea }
        updatedNewIdea[attributeToChange] = newValue
        this.setState({ newIdea: updatedNewIdea })
    }
    handleSubmit = (event) => {
        event.preventDefault()
    
        this.props.createIdea(this.state.newIdea)
    }

    render() {
        return (
            <div>
                <h2>Create New Idea</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            type="text"
                            onChange={this.handleChange} />
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <input
                            name="description"
                            type="text"
                            onChange={this.handleChange} />
                    </div>
                    
                    <div>
                        <input type="submit" value="Create Idea"/>
                    </div>
                </form>

                <hr />
                <hr />
            </div>
        )

    }

}

export default IdeaNewForm