import React, {Component} from 'react'
import axios from 'axios';
import Idea from './Idea';
import IdeaNewForm from './IdeaNewForm'

class IdeaList extends Component {
	state = {
		ideas: []
    }
    
    // componentWillMount(){
    //     axios.get('/ideas')
    //     .then((response) => {
    //         this.setState({ideas: response.data}) //replace this empty idea arr with the response
    //     })
    //     .catch((error) => {
    //         console.log('Error retrieving ideas!')
    //         console.log(error)
    //     })
    // }

    //this async method does the same thing
    async componentWillMount() {
        try {
            // setTimeout(async()=>{
            const response = await axios.get('/ideas') //"wait for this, then... "
            this.setState({ ideas: response.data })
        // }, 2000)
        } catch (error) {
            console.log('Error retrieving ideas!')
            console.log(error)
        }
    }

    deleteIdea = async (ideaId, index) => {
        try {
            await axios.delete(`/ideas/${ideaId}`)
            const updatedIdeasList = [...this.state.ideas] //why a copy?...
            updatedIdeasList.splice(index, 1)
            this.setState({ideas: updatedIdeasList})
        } catch (error) {
            console.log(`Error deleting Idea with ID of ${ideaId}`)
            console.log(error)
        }
    }

    createIdea = async (idea, index) => {
        try {
            const newIdeaResponse = await axios.post(`/ideas`, idea)
            const updatedIdeasList = [...this.state.ideas]
            updatedIdeasList.push(newIdeaResponse.data)
            this.setState({ideas: updatedIdeasList})
        } catch(error) {
            console.log('Error creating new User!')
            console.log(error)
        }
    }

    handleIdeaChange = (event, index) => {
        const attributeToChange = event.target.name
        const newValue = event.target.value
        const updatedIdeasList = [...this.state.ideas]
        const ideaToUpdate = updatedIdeasList[index]
        ideaToUpdate[attributeToChange] = newValue        
        this.setState({ideas: updatedIdeasList})
    }

    updateIdea = async (index) => {
        try {
            const ideaToUpdate = this.state.ideas[index]
            await axios.patch(`/ideas/${ideaToUpdate.id}`, ideaToUpdate)
        } catch(error) {
            console.log('Error updating idea!')
            console.log(error)
        }
    }
    
    render() {
        return (
            <div>
                <h1>Idea Board</h1>
                <IdeaNewForm createIdea={this.createIdea}/>
                {
                    this.state.ideas.map((idea, index) => {
                        return (
                            <Idea
                                {...idea}
                                key={index}
                                index={index}
                                deleteIdea={this.deleteIdea} 
                                handleIdeaChange={this.handleIdeaChange}
                                updateIdea={this.updateIdea} />
                        )
                    })
                }
            </div>
        )
    }
}

export default IdeaList