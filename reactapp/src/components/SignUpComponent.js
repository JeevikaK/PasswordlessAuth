import React from 'react'
import axios from 'axios'

class SignUpComponent extends React.Component {
  state = {
    details : [],
    username : "",
    biometric_option : "",
    fido_option : "",
    blockchain_auth : "",
  }

  async componentDidMount() {

    let data;
    axios.get('http://127.0.0.1:8000/signup/')
    .then(res => {
      data = res.data;
      this.setState({
        details : data
      })
    })
    .catch(err => {})
  }

  handleInput = (e) => {
    this.setState({
        [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
      axios.post('http://127.0.0.1:8000/signup/',{
        username : this.state.username,
        biometric_option : this.state.biometric_option,
        fido_option : this.state.fido_option,
        blockchain_auth : this.state.blockchain_auth,
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => console.log(err))
  }

  render(){
    return(

      <div>
        <form onSubmit={this.handleSubmit} method="POST">

          <label htmlFor={'username'} name={'username'}>UserName</label><br></br>
          <input type={'text'} value={this.state.username} name={'username'} onChange={this.handleInput}></input><br></br>

          <label htmlFor={'biometric_option'} name={'biometric_option'}>Biometric Option</label><br></br>
          <input type={'text'} value={this.state.biometric_option} name={'biometric_option'} onChange={this.handleInput}></input><br></br>

          <label htmlFor={'fido_option'} name={'fido_option'}>Fido Option</label><br></br>
          <input type={'text'} value={this.state.fido_option} name={'fido_option'} onChange={this.handleInput}></input><br></br>

          <label htmlFor={'blockchain_auth'} name={'blockchain_auth'}>Blockchain Auth</label><br></br>
          <input type={'text'} value={this.state.blockchain_auth} name={'blockchain_auth'} onChange={this.handleInput}></input><br></br>

          <button type="button" className="btn btn-primary mb-5" id='biometric'>
            Biometric Authentication
          </button><br /><br />
              <button type="button" className="btn btn-primary mb-5">
                Facial Authentication
              </button>
              <button type="button" className="btn btn-primary mb-5">
                Voice Authentication
              </button>
              <button type="button" className="btn btn-primary mb-5">
                Fingerprint Authentication
              </button><br></br><br></br>
          <button type="button" className="btn btn-primary mb-5">
            Fido Authentication
          </button><br /><br />
          <button type="button" className="btn btn-primary mb-5">
            Blockchain Authentication
          </button><br /><br />
          <button type="submit" className="btn btn-primary mb-5">
            Submit
          </button><br /><br />
        </form>

      </div>
    )
  }
}

export default SignUpComponent