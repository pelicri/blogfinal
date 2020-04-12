import React, {Component} from 'react'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { createComment } from '../graphql/mutations';

class CreateCommentPost extends Component{
    state = {
        commentOwnerId: "",
        commentOwnerUsername: "",
        content:""
    }

    componentWillMount = async () => {
        await Auth.currentUserInfo()
        .then(user =>{
            this.setState({
                commentOwnerId: user.attributes.sub,
                commentOwnerUsername: user.username
            })
        })
    }

    handleChangeContet = event => this.setState({
        content: event.target.value
    })

    handleAddComment = async event => {
        //evita que a chamada seja feita sem dados ou com dados iniciais
        event.preventDefault()
        const input = {
            //props recebe objeto de outro arquivo JS - neste caso de Display
            //Posts para linkar o Id do comentário com o id do post 
            //olhar o arquivo de mutations
            commentPostId: this.props.postId, 
            //id: this.props.postId,
            commentOwnerId: this.state.commentOwnerId,
            commentOwnerUsername: this.state.commentOwnerUsername,
            //state sáo os dados que são tratados no handle.state ou tela
            content: this.state.content,
            createdAt: new Date().toISOString()
            
        }
        await API.graphql(graphqlOperation(createComment, {input} ))
        this.setState({ content: "" })
    }

    render(){
        return (
            <div>
                <form className="add-comment"
                 onSubmit={this.handleAddComment}>
                    <textarea
                    type="text"
                    name="content"
                    rows="3"
                    cols="40"
                    required
                    placeholder="Comentários"
                    value = {this.state.content}
                    onChange= {this.handleChangeContet} />
                    
                    <br/>
                    <input 
                    type= "submit"
                    className="btn" 
                    style= {{fontSize:'19px'}}
                    value="Adicionar Comentário"/>
                </form>
            </div>
        )
    }
}

export default CreateCommentPost;