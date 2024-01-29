import React, { useState } from 'react';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.name.length < 4) {
      newErrors.name = 'Name must be at least 4 characters';
      valid = false;
    } else {
      newErrors.name = '';
    }

    // Need to add email validation
    // ...

    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one number and one special character';
      valid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Display data in the table
      setSubmittedData({ ...formData });
    } else {
      console.log('Form has errors');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
    
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center mb-4">
                  {isLogin ? 'Login' : 'Create an Account'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {errors.name && (
                          <p className="text-danger">{errors.name}</p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="dob" className="form-label">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-between">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {isLogin ? 'Login' : 'Create Account'}
                    </button>

                    <button
                      type="button"
                      onClick={toggleAuthForm}
                      className="btn btn-link"
                    >
                      {isLogin
                        ? 'Create an account'
                        : 'Already have an account?'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
};

export default LoginPage;