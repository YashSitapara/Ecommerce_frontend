import React, { useState } from 'react';
import Base from '../core/Base';
import {Redirect} from 'react-router-dom';

import { signin, authenticate, isAuthenticated } from '../auth/helper'

const Signin = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        didRedirect: false
      });
    const { email, password, error, loading, didRedirect } = values;

    const { user } = isAuthenticated();    

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: false, loading: true });
        signin({email,password})
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setValues({
                        ...values,
                        didRedirect: true
                    })
                })
            }
        })
        .catch(console.log("Signin request Failed.."))
    }

    const performRedirect = () => {
        if(didRedirect){
            if(user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        
        if(isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const LoadingMessage = () => {
        return (
            loading && (
                <div className="alert alert-info">
                    <h2>Loading...</h2>
                </div>
            )
        );
    };
  
    const errorMessage = () => {
      return (
          <div className="row">
              <div className="col-md-6 offset-sm-3 text-left">
                  <div className="alert alert-danger" style={{display: error ? "": "none"}}>
                      {error}
                  </div>
              </div>
          </div>
      )
    }

    const signinForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="form-light">Email</label>
                            <input className="form-control" type="email" value={email} onChange={handleChange("email")} />
                        </div>
                        <div className="form-group">
                            <label className="form-light">Password</label>
                            <input className="form-control" type="password" value={password} onChange={handleChange("password")} />
                        </div>
                        <button className="btn btn-success btn-block" onClick={onSubmit} >Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    return(
        <Base title="Sign In" description="A page for user to sign in!">
            {LoadingMessage()}
            {errorMessage()}
            {signinForm()}
            {performRedirect()}
            
        </Base>
    )
}

export default Signin;