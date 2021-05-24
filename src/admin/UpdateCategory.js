import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { updateCategory, getCategory} from './helper/adminapicall';

const UpdateCategory = ({ match }) => {

    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const {user, token} = isAuthenticated()

    const goBack = () => (
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    )

    const preLoad = (categoryId) => {
        getCategory(categoryId)
        .then(data => {
            if(data.error) {
				setError(data.error)
            } else {
				setName(data.name)
            }
        })
    }

    useEffect(() => {
        preLoad(match.params.categoryId)
    }, [])

    const handleChange = (event) => {
        setError("");
        setName(event.target.value)
    };

    const onSubmit = (event) => {
		event.preventDefault();
		setError('')
		setSuccess(false)
		//backend request
		updateCategory(match.params.categoryId, user._id, token, {name})
		.then(data => {
			if(data.error) {
				setError(true)
				console.log(data.error)
			} else {
				setError('')
				setSuccess(true)
				setName('')
				window.setTimeout(function () {
			        window.location.href = "/admin/dashboard";
			    }, 1000)
			}
		})
	};
  
    const successMessage = () => {
        if(success) {
            return <h4 className="text-success">Category Updated successfully...</h4>
        }
    }
    const errorMessage = () => {
        if(error) {
            return <h4 className="text-warning">Failed to Update Category....</h4>
        }
    }
    
      const myCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Update the category</p>
                <input 
                    type="text" 
                    className="form-control my-3" 
                    onChange={handleChange}
                    value={name}
                    autoFocus 
                    required 
                    placeholder="For Ex. Summer" 
                />
                <button className="btn btn-outline-info" onClick={onSubmit}>Update Category</button>
            </div>
        </form>
    );

    return (
        <Base
            title="Update your category here!"
            description="Welcome to category updation section"
            className="container bg-info p-4"
        >
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
                Admin Home
            </Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {myCategoryForm()}
                </div>
            </div>
    </Base>
    )
}

export default UpdateCategory;