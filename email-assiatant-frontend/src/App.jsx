
import { Box, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button,CircularProgress } from '@mui/material'; 
import './App.css';
import { useState } from "react";
import axios from 'axios';

function App() {

const [emailContent, setEmailContent] = useState('');
const [tone, setTone] = useState('');
const [generatedReply, setGeneratedReply] = useState('');
const [loading,setLoading] = useState(false);
const handleSubmit=async () => {
  setLoading(true);
  try{
    const response=await axios.post("http://localhost:9090/api/email/generate",{
      emailContent,
      tone
  });
  setGeneratedReply(typeof response.data === 'string'?
    response.data :JSON.stringify(response.data)
  );
  }catch
  {    
    alert("Someting Error");
  }finally{
    setLoading(false);
  }
}
  return (
    <>
      <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant='h4' component="h2" gutterBottom>
        Email Reply Assistant
      </Typography>
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth  
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)} 
          sx={{mb:2}}
        />
        <FormControl fullWidth>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
             value={tone || ''}
             label="Tone (Optional)"
            onChange={(e)=>setTone(e.target.value)}
            sx={{mb:2}}
        >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="professional">Professional</MenuItem>
        <MenuItem value="casual">Casual</MenuItem>
        <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

      <Button variant="contained"
        onClick={handleSubmit}
        disabled={!emailContent || loading} sx={{mb:2}}>
        {loading ? <CircularProgress  size={24} /> : "Generate Reply"}
        
      </Button>
      </Box> 

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth  
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply || ''}
          inputProps={{readonly:true}}
          sx={{mb:2}}
        />
        <Button variant="outlined"
        onClick={()=>navigator.clipboard.writeText(generatedReply)}>
        Copy to Clipboard        
        </Button>
      </Box>

    </Container>
    </>
  )
}

export default App
