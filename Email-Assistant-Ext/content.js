console.log("Email Extension Loaded");

function getEmailContent () {
    const selectors=[
        '.h7',
        '.a3s.aiL', 
        '.gmail_quote',
        '[role="presentation]'
    ];
    for(const selector of selectors){
        const content=document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
        return '';
    }

    
}

function findComposeToolbar () {
    const selectors=['.btC','.aDh' , '[role="dialog"]','.gU.Up'];
    for(const selector of selectors){
        const toolbar=document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
    
}

function injectButton(){
    const existingButton=document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();        
    }
    const toolbar=findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar Not Found!");
        return;
    }
    console.log("Toolbar Found!");
    const button=createAIButton();
    button.classList.add('.ai-reply-button');
    
    button.addEventListener('click',async () => {
        try {
            button.innerHTML="Generating...";
            button.disabled=true;
            const emailContent=getEmailContent();
            const response=await fetch('http://localhost:9090/api/email/generate',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    emailContent:emailContent,
                    tone:"professional"
                })
            });

            if(!response.ok){
                throw new Error("API Request Failed");
                
            }

            const generatedReply=await response.text();
            const composeBox=document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
            }
        } catch (error) {
            
        }        
    })

    toolbar.insertBefore(button,toolbar.firstChild)
    
}

function createAIButton () {
    const button=document.createElement('div');
    button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight='10px';
    button.style.borderRadius='50px';
    button.style.backgroundColor='#0B57D0';
    button.innerHTML="Ai Reply";
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate Ai Reply');
    return button;
    
}

const observer=new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes=Array.from(mutation.addedNodes);
        const hasComposeElements=addedNodes.some(node=>
             node.nodeType === Node.ELEMENT_NODE && 
             (node.matches('.aDh , .btC , [role="dialog"]')
             ||node.querySelector('.aDh , .btC , [role="dialog"]'))

        );
        if(hasComposeElements){
            console.log("Compose window Detected!!")
            setTimeout(injectButton, 50);
        }
    }

});
observer.observe(document.body,{
    childList:true,
    subtree:true
})