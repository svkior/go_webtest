import React from "react";
import {ArtGateSetupEditor, ArtGatePasswordEditor} from "../../helpers/forms/editors";
import {ButtonInput} from "react-bootstrap";

import {AuthActions} from "../../actions/auth_actions";
import Reflux from 'reflux';
import AuthStore from "../../store/auth_store";

export default React.createClass({
    mixins: [
        Reflux.connect(AuthStore, 'credintals')
    ],
    fakeChange(){
        console.log("CHange!!!!");
    },
    onSubmit(e){
        e.preventDefault();
    },
    render(){

        let login = "123";
        let password = "123";
        if(this.state.credintals){
            console.log(this.state.credintals);
        }

       return (
           <div className="row">
               <form className="setupForm" onSubmit={this.onSubmit}>
                   <div className="panel-body ag-setup-container">
                       <div className="ag-setup panel panel-default">
                           <h3>Авторизация</h3>
                       </div>
                       <ArtGateSetupEditor name="Имя пользователя" value={login} onChange={AuthActions.updateLogin}/>
                       <ArtGatePasswordEditor name="Пароль" value={password} onChange={this.fakeChange}/>
                       <div className="ag-setup-buttons panel panel-default">
                           <div className="panel-body">
                               <ButtonInput type="submit" value="Обновить"/>
                           </div>
                       </div>
                   </div>
               </form>
           </div>
       );
    }
});

