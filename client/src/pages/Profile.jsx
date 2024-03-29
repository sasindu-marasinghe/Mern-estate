import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef ,useState} from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../redux/user/firebase";
import { updateUserStart,updateUserSuccess,updateUserFailure,
deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserStart,signOutUserFailure,signOutUserSuccess} from "../redux/user/userSlice";
import { Link } from "react-router-dom";


export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] =useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();



  
  //firebase storage
  // allow read;
  // allow write:if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
},[file]);

const handleFileUpload = (file) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',(snapshot) => {
    const progress = (snapshot.bytesTransferred /
    snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));

  },
  (error)=>{
    setFileUploadError(true);
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then
    ((downloadURL) =>
    setFormData({ ...formData, avatar: downloadURL})
    );
  }
  );
};
const handleChange = (e) =>{
  setFormData({...form, [e.target.id]: e.target.value});
};
const handleSubmit = async(e) => {
  e.preventDefault();
  try{
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser.
    _id}`, {
      method: 'POST',
      headers: {
        'Content_Type': 'application/json',
      },
      body: JSON.stringify(fromData),
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  };

};
const handleDeleteUser = async (e) => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message));

  }
};
const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false) {
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(data.message));
  }
}
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
        <input onChange={(e) => setFile(e.target.files[0])} 
        type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()}
         src={currentUser.avatar} alt="profile"
        className='rounded-full h-24 w-24 object-cover
        cursor-pointer self-center mt-2' />

        <input type="text"
         placeholder='username'
        defaultValue={currentUser.username} 
        id='username'
        className='border p-3 rounded-lg'
        onChange={handleChange} />
          <input type="email"
           placeholder='email'
           defaultValue={currentUser.email}
           id='username'
           className='border p-3 rounded-lg'
           onChange={handleChange} />
          <input type="text"
           placeholder='password'
            id='username'
        className='border p-3 rounded-lg' />
        <button  className='bg-slate-700 text-white rounded-lg
        p-3 uppercase hover:opacity-95
        disabled:opacity-80'>Update</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg
        uppercase text-center'to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete
        Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};
