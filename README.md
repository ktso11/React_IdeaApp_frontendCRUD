# API Calls with React

- Use React lifecycle methods to manage the component lifecycle
- Use `axios` to make API calls
- Use `create-react-app` to proxy a development server
- Create data within React
- View data within React
- Update data within React
- Delete data within React

## Start up

We are going to add a React UI to the existing API living in `/ideas-api`. Let's fire up the starter API:

```bash
$ cd ideas-api

$ ./gradlew bootRun
```

All of our API's data will be available at [localhost:8080/ideas](http://localhost:8080/ideas).

## Creating the UI React 

Now that our API is running, we'll use the `create-react-app` tool to bootstrap a fresh React UI:

```bash
$ cd ..

$ create-react-app idea-board-ui

$ cd idea-board-ui

$ code .
```

## React Lifecycle Methods

React provides several default methods to manage the lifestyle of a component. We have already seen `Constructor` methods that allow us to set up a default state, but as components mount and unmount from the page, we'll find ourselves wanting more fine-grained control over the component lifecycle.

### You Do

Take 10 minutes to explore the [React Component Lifecycle](https://reactjs.org/docs/react-component.html#the-component-lifecycle) docs in groups. Be prepared to answer 3 questions:

1. How many "lifecycles" or "phases" exist for a React Component? What are they?
2. In what order are these methods called? Who calls the methods?
3. Which of these methods seem the most useful? Which do you think you will use the most often?

## `componentWillMount()`

Today we are going to integrate our React UI with an existing API. One of the simplest things we'll want to do is load some initial data from the API into our component `state`. 

We'll want this to happen before the component mounts, and the built-in `componentWillMount()` lifecycle method will allow this to happen. Let's try it out.

We are going to create a new Idea Board application to keep track of app ideas. First, we'll need to create our new `components` directory:

```bash
$ mkdir src/components
```

Next, we'll need an `IdeaList` "wrapper" component:

```bash
$ touch src/components/IdeaList.js
```

Let's set up this `IdeaList` wrapper component with an empty list of `ideas` on its state. We'll also drop in a basic `render()` method with some placeholder text:

```jsx
import React, {Component} from 'react'

class IdeaList extends Component {
	state = {
		ideas: []
	}
	
	render() {
	    return (
	        <div>
	            <h1>Idea Board</h1>
	        </div>
	    )
	}
}

export default IdeaList
```

... and then we'll mount our `IdeaList` in `App.js`:m

```jsx
import React, { Component } from 'react'
import IdeaList from './components/IdeaList'

class App extends Component {
  render() {
    return (
      <div>
        <IdeaList />
      </div>
    )
  }
}

export default App
```

### Add the `componentWillMount()` method:

Just like `render()`, `componentWillMount()` will be called by React every time we mount a new component. By default, `componentWillMount()` is an empty method on the `Component` class, but we have the ability to `override` this functionality within each of our components. Let's drop in our own empty `componentWillMount()` and add our own custom functionality. Above the `render()` method, let's add copy this block:

```jsx
...
componentWillMount() {
	
}
...
```

Now any code that we write inside of this block will be triggered before the component mounts!

Let's make our first API call to fetch some data and set up the initial state! To manage our API calls, we will use a new tool called `axios`. `Axios` is a great, modern JavaScript library that simplifies the process of making network calls. It supports Promises out of the box, and includes additional support for great new JavaScript features such as `async / await`. Let's import the `axios` NPM package and take a look!

```bash
$ npm i axios
```

Now we'll need to import `axios` into our `IdeaList` component:


```jsx
import axios from 'axios'
...
```

Now we'll fill in our `componentWillMount()` function body to make a `GET` request to the `/ideas` endpoint on our API. This endpoint will hand us all of the existing ideas, which we will then set up as our initial `state`. 

```jsx
componentWillMount() {

    axios.get('http://localhost:8080/ideas')
        .then((response) => {
            this.setState({ideas: response.data})
        })
        .catch((error) => {
            console.log('Error retrieving ideas!')
            console.log(error)
        })
        
}
```

> Note: `axios.get()` here will return a Promise, which we we can manage with `.then()` and `.catch()` blocks. 

Let's check our work in the React DevTools. Our `state` should now contain a list of `ideas`.

### Oh no!!!

It didn't work. It looks like we weren't able to access our `ideas-api` on port `8080`.

This is actually a good thing! Even though both servers are running on the same `localhost`, they have been assigned separate ports. The concept of [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) dictates that we should not be able to reach across ports without explicitly enabling this functionality.

Fortunately, the `create-react-app` developers are very familiar with this limitation and how it might affect our development environment. They created a very simple way of navigating this problem that will only run in our development environment. Once our app is pushed to production, all of the safety of CORS protection will come right back. 

The very simple solution here is to implement a "proxy" that will trick our React dev server into thinking our API lives on the same origin. All we have to do to enable this proxy is to add one extra line to our `package.json` file:

```json
...
  "proxy": "http://localhost:8080",
...
```

Now if we hard-restart our dev server, we should see everything work!

### Oh no!

It's still not working... 

Remember that we are now "tricking" our dev server into thinking the `/ideas` route is on `localhost:3000`. This means that we will need to update our `http://localhost:8080/ideas` URL to look like a local, relative URL. Let's give this another try with a simpler `/ideas` URL and see what happens:

```jsx
componentWillMount() {
    axios.get('/ideas')
        .then((response) => {
            console.log(response)
            this.setState({ ideas: response.data })
        })
        .catch((error) => {
            console.log('Error retrieving ideas!')
            console.log(error)
        })
}
```

Looks good! Let's check out our React Dev Tools. If everything is wired up, we will now see that our initial state contains an array of `ideas`!

## `async / await`

This code works well and we've accomplished our task, but it requires that we use `.then()` and `.catch()` blocks to handle our `axios Promises`. This syntax is reasonably clean, but the `create-react-app` Webpack set-up gives us immediate, safe access to even better syntax.

Let's use the new `async / await` instead. This syntax allows us to mark asynchronous functions as `async`. Once we have declared that a function is `async`, we can "pause" any line of code that triggers asynchronous functionality using the `await` keyword. Let's refactor our `componentWillMount()` function to use this new, cleaner syntax:

```jsx
async componentWillMount() {
    try {
        const response = await axios.get('/ideas')
        this.setState({ ideas: response.data })
    } catch (error) {
        console.log('Error retrieving ideas!')
        console.log(error)
    }
}
```

## Displaying the Ideas

Now that we have our initial state set up, we can begin displaying our `Ideas`. Our `IdeaList` will want to `map()` through each `idea` from our state and create a "presentational" component for each. 

Let's start by creating our `Idea` presentational component:

```bash
$ touch src/components/Idea.js
```

Next, we'll set up our basic structure. The component will display a `title` and `description` for each `Idea`:

```jsx
import React, {Component} from 'react'

class Idea extends Component {

    render() {
        return (
            <div>
                <div>{this.props.title}</div>
                <div>{this.props.description}</div>
                <hr/>
            </div>
        )
    }

}

export default Idea
```

Now our `IdeaList` should map through the `ideas` on the `state` and mount an `Idea` presentational component for each:

```jsx
import React, { Component } from 'react'
import axios from 'axios'

import Idea from './Idea'

class IdeaList extends Component {

    state = {
        ideas: []
    }

    async componentWillMount() {
        try {
            const response = await axios.get('/ideas')
            this.setState({ ideas: response.data })
        } catch (error) {
            console.log('Error retrieving ideas!')
        }
    }

    render() {
        return (
            <div>
                <h1>Idea Board</h1>
                {
                    this.state.ideas.map((idea) => {
                        return (
                            <Idea
                                {...idea}
                                key={index} />
                        )                    })
                }
            </div>
        )
    }
}

export default IdeaList
```

> The spread operator will pass all attributes of an `Idea` as individual `props`. In other words, each `Idea` will receive `title` and `description` as individual `props`, even though we didn't pass them individually.

## Deleting Ideas

Now that we're displaying some `ideas`, let's add a button to delete each one.

First, we'll need a `deleteIdea()` method in the `IdeaList` component:

```jsx
...
deleteIdea = async (ideaId, index) => {
    try {
        await axios.delete(`/ideas/${ideaId}`)
        
        const updatedIdeasList = [...this.state.ideas]
        updatedIdeasList.splice(index, 1)
        this.setState({ideas: updatedIdeasList})
        
    } catch (error) {
        console.log(`Error deleting Idea with ID of ${ideaId}`)
        console.log(error)
    }
}
...
```

This function will need to do a couple of things in a very specific order: 

1. First, we will need to make an `async` API call to `DELETE` the `idea` from the database.
2. Once we are sure that this `idea` has been successfully deleted, we will want to remove it from the page. We'll use the `spread operator` here to copy our list of `ideas`. We will then `splice()` the deleted `idea` from the array, and replace the list of `ideas` on the state with our updated copy.


Let's pass function as a `prop` to each `Idea`:

```jsx
render() {
    return (
        <div>
            <h1>Idea Board</h1>
            {
                this.state.ideas.map((idea, index) => {
                    return (
                        <Idea
                            {...idea}
                            key={index}
                            index={index}
                            deleteIdea={this.deleteIdea} />
                    )
                })
            }
        </div>
    )
}
```

We'll also need to pass the `index` as a prop so we can use it later to delete the proper `idea` from our `ideas` array.



Now, inside of each `Idea` component we'll add a button that calls this `deleteIdea()` function. We'll need to pass the `id` and `index` of each `idea` into the function to be sure we delete the correct one:

```jsx
render() {
    return (
        <div>
            <div>{this.props.title}</div>
            <div>{this.props.description}</div>
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
```

> Notice that we passed a new arrow function into the `onClick` event handler instead of referencing `this.props.deleteIdea` directly. This allows us to reference our `props` and pass them into this function properly.

Let's load everything up and test it out!

## Creating a New Idea

Now we'll add new `idea` form to the top of page. To keep things clean, we'll creat the form as a new component. 


Let's create `IdeaNewForm.js` with some basic structure:

```bash
$ touch src/components/IdeaNewForm.js
```

```jsx
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

    render() {
        return (
            <div>
                <h2>Create New Idea</h2>

                <form>
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
```

We'll also need to mount the form in our `App.js`:

```jsx
...
import IdeaNewForm from './IdeaNewForm'

...
render() {
    return (
        <div>
            <h1>Idea Board</h1>
            <IdeaNewForm />
            {
                this.state.ideas.map((idea, index) => {
                    return (
                        <Idea
                            {...idea}
                            key={index}
                            index={index}
                            deleteIdea={this.deleteIdea} />
                    )
                })
            }
        </div>
    )
}
...
```

The form is set up to manage its own `state`, but we have not told it what to do `onSubmit`. This will be similar to our delete functionality. In order, we'll want our form to:

1. Create the new `Idea` in the database
2. Add the `Idea` to the parent `IdeaList` `state`, once we're sure it's saved in the database

Let's write a `createIdea()` function in `IdeaList` to handle this:

```jsx
...
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
...
```

... and then we'll pass the function to our `IdeaNewForm`:

```jsx
...
<IdeaNewForm createIdea={this.createIdea}/>
...
```

Now that the function has been passed down, we can call this function with our new `idea` data when the form is submitted:

```jsx
...

handleSubmit = (event) => {
    event.preventDefault()

    this.props.createIdea(this.state.newIdea)
}

...

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
```

> We'll wrap our `this.props.createIdea()` call in a `handleSubmit()` function so that we can `preventDefault()` functionality on the submit event. 

Let's test it out... the new `idea` shows up!

## Update an Idea 

Let's use a similar strategy to update our `ideas`. A common feature of modern webapps is the ability to update text automatically without having to submit a form. React makes this very easy to do thanks to its simple [synthetic events](https://reactjs.org/docs/events.html).

Let's update our `Idea` display component to make our `title` and `description` easily editable. We'll replace the `<div>` tags with `<input>` and `<textarea>` tags:

```jsx
import React, { Component } from 'react'

class Idea extends Component {

    render() {
        return (
            <div>
                <div>
                    <input
                        name="title"
                        value={this.props.title} />
                </div>

                <div>
                    <textarea
                        name="description"                        
						value={this.props.description} />
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
```

Now we'll need to keep track of the updated values. We'll want to find each `idea` in our list as it changes and change the appropriate property. Let's add a `handleIdeaChange()` function to accomplish this:

```jsx
...
handleIdeaChange = (event, index) => {
    const attributeToChange = event.target.name
    const newValue = event.target.value

    const updatedIdeasList = [...this.state.ideas]
    const ideaToUpdate = updatedIdeasList[index]
    ideaToUpdate[attributeToChange] = newValue
    
    this.setState({ideas: updatedIdeasList})
}
...
```

Each `Idea` will need to trigger this functionality, so we'll pass the function down along with our `deleteIdea()` function to each `Idea` component:

```html
...
<Idea
    {...idea}
    key={index}
    index={index}
    deleteIdea={this.deleteIdea} 
    handleIdeaChange={this.handleIdeaChange} />
...
```

The function needs the change `event` (which contains the name of the attribute to change and its new value) and an `index`, so we'll pass both into an `onChange` callback for each input in the `Idea` component:

```jsx
...
onChange={(event) => this.props.handleIdeaChange(event, this.props.index)}
...
```

Now the individual `ideas` in our list will be updated on-the-fly as we type into our `Idea` inputs!

### Saving our Updates

Now we'll want to save these changes to the database. While we could make an API call with each `onChange` event, this wouldn't be very efficient. We'd be making a new API call for every character that the user types, and API calls are expensive. While there are strategies such as [debouncing](https://lodash.com/docs#debounce) that can make this more feasible, we're going to take an even simpler approach. We are going to wait for the user to click out of each input box and then save the input.

React provides a synthetic `onBlur` event for exactly this purpose!

Let's create a function that will find an `idea` with a given `index` on our `state` and save it to the database. This function will live inside of our `IdeaList` component:

```jsx
updateIdea = async (index) => {
    try {
        const ideaToUpdate = this.state.ideas[index]
        await axios.patch(`/ideas/${ideaToUpdate.id}`, ideaToUpdate)
    } catch(error) {
        console.log('Error updating idea!')
        console.log(error)
    }
}
```

Again, we'll need to pass this function to each `Idea`:

```html
...
<Idea
    {...idea}
    key={index}
    index={index}
    deleteIdea={this.deleteIdea} 
    handleIdeaChange={this.handleIdeaChange} 
    updateIdea={this.updateIdea} />
...
```

Finally, we'll tell our `<input>` and `<textarea>` to call this function and pass the `index` `onBlur`:

```jsx
...
onBlur={() => this.props.updateIdea(this.props.index)}
...
```

