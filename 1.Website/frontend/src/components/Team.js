import React from 'react';
import '../css/Team.css'; 
import Select from 'react-select';
import axios from 'axios';
class Team extends React.Component{
    constructor(props){
        super(props) ; 
        this.state = {
            chosen:[],
            list:[]
        }
    }

    saveMemberList = (result) =>{
        console.log('saving members',result) ;
        if (typeof this.props.chooseMember === 'function' ){
            this.props.chooseMember(result) ; 
        }

    }
    componentDidMount(){
        this.getListOfUsers() ;
    }
    getListOfUsers = ()=>{
        axios.get(`http://localhost:9001/user/listOfAllUsersExceptYourself/${this.props.userEmail}`)
        .then((res)=>{
            console.log(res)
            if (res.data !== undefined){
                const users = res.data.data
                console.log('suers',users) ;
                if (users !== undefined && Array.isArray(users)){
                    this.setState({
                        list:users
                    }) ;
                }
                else{
                    alert('Something wrong happened')
                }

            }
            else{
                console.log('suers') ;

                this.setState({
                    list:[]
                })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    sortResults = (results)=>{
        var ch = [] ; 
        results.forEach(element => {
            console.log('inside each ',element)
            ch.push(element.value) ;
        }) ;
        return new Promise((resolve,reject)=>{
            ch.length>0 ? resolve(ch):reject(ch) 
        }) ; 
    }
    handleSearch= (results)=> {
        // var newList = this.state.list ; 
        console.log('Search/Rm',results) ;
        if (results.length > 0){
            this.sortResults(results)
            .then(ans =>{
                this.setState({
                    chosen : ans
                }) ;
                return this.state.chosen
            })
            .then( ans =>{
                this.saveMemberList(this.state.chosen)
            })
            .catch(err=>{
                console.log('Error when updating team')
            })
        
        }
        else{
            this.setState({
                chosen : []
            }) ;
        }
    }
    handleSelect = (item) =>{
        console.log('key change',item) ;
        this.saveMemberList(item)
    }
    render(){
        if (Array.isArray(this.state.list)){
            if (this.state.list.length > 0)
                return (
                    <>
                <Select options={this.state.list} 
                    onChange={this.handleSearch}
                    placeholder={'Search Member'}
                    isSearchable={true}
                    isMulti={true}
                    style={{color:'black'}}
                />
                </>)
            else{
            return (
                <div>Loading...</div>
            )
            }
        }
        return (
            <div></div> 
        )
    
    }
}

export default Team;