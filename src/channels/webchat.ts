/**
 * Web Chat - 带注册/登录/历史记录
 */
import type { Env } from "../index";
import { Agent } from "../core/agent";
import { AuthSystem } from "../core/auth";

export async function handleWebChat(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  const auth = new AuthSystem(env.DB);
  const url = new URL(request.url);
  
  // API 路由
  if (url.pathname === "/chat/api/register") {
    return handleRegister(request, auth);
  }
  if (url.pathname === "/chat/api/login") {
    return handleLogin(request, auth);
  }
  if (url.pathname === "/chat/api/logout") {
    return handleLogout(request, auth);
  }
  if (url.pathname === "/chat/api/me") {
    return handleMe(request, auth);
  }
  if (url.pathname === "/chat/api/history") {
    // 需要认证
    const session = await getSession(request, auth);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const agent = new Agent(env, session.user_id);
    const history = await agent.getHistory();
    return new Response(JSON.stringify({ messages: history }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  if (url.pathname === "/chat/api/send") {
    // 需要认证
    const session = await getSession(request, auth);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const body = await request.json() as { message: string };
    const agent = new Agent(env, session.user_id);
    const reply = await agent.chat(body.message);
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // 页面路由 - 都返回同一个 SPA
  return new Response(CHAT_HTML, {
    headers: { "Content-Type": "text/html;charset=utf-8" },
  });
}

async function getSession(request: Request, auth: AuthSystem) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  if (!match) return null;
  return auth.validateSession(match[1]);
}

async function handleRegister(request: Request, auth: AuthSystem) {
  const body = await request.json() as { username: string; password: string };
  const result = await auth.register(body.username, body.password);
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }
  return new Response(JSON.stringify({ success: true, token: result.token }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": `session_token=${result.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800` },
  });
}

async function handleLogin(request: Request, auth: AuthSystem) {
  const body = await request.json() as { username: string; password: string };
  const result = await auth.login(body.username, body.password);
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }
  return new Response(JSON.stringify({ success: true, token: result.token }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": `session_token=${result.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800` },
  });
}

async function handleLogout(request: Request, auth: AuthSystem) {
  const session = await getSession(request, auth);
  if (session) await auth.logout(session.token);
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": "session_token=; Path=/; Max-Age=0" },
  });
}

async function handleMe(request: Request, auth: AuthSystem) {
  const session = await getSession(request, auth);
  if (!session) return new Response(JSON.stringify({ logged_in: false }), {
    headers: { "Content-Type": "application/json" },
  });
  return new Response(JSON.stringify({ logged_in: true, username: session.username }), {
    headers: { "Content-Type": "application/json" },
  });
}

const CHAT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tazazvesh</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#e0e0e0;height:100vh}
    .page{display:none;height:100vh;flex-direction:column}
    .page.active{display:flex}
    
    /* Auth pages */
    #auth-page{align-items:center;justify-content:center}
    .auth-box{background:#111;border:1px solid #333;border-radius:12px;padding:32px;width:360px}
    .auth-box h2{margin-bottom:24px;font-size:20px;text-align:center}
    .auth-box input{width:100%;padding:10px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#fff;font-size:14px;margin-bottom:12px;outline:none}
    .auth-box input:focus{border-color:#2563eb}
    .auth-box button{width:100%;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;margin-bottom:8px}
    .auth-box button:hover{background:#1d4ed8}
    .auth-box .switch{color:#666;font-size:13px;text-align:center;cursor:pointer}
    .auth-box .switch:hover{color:#fff}
    .auth-box .error{color:#f44;font-size:13px;margin-bottom:8px;text-align:center}
    
    /* Chat page */
    #chat-page{display:none}
    #header{padding:12px 20px;border-bottom:1px solid #222;background:#111;display:flex;justify-content:space-between;align-items:center}
    #header h1{font-size:16px;font-weight:500}
    #header .actions{display:flex;gap:10px;align-items:center}
    #header .info{font-size:11px;color:#555}
    .btn{padding:6px 14px;background:#333;color:#fff;border:1px solid #444;border-radius:6px;cursor:pointer;font-size:12px}
    .btn:hover{background:#444}
    .btn.danger{background:#4a2020;border-color:#633}
    .btn.danger:hover{background:#5a3030}
    #messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px}
    .msg{max-width:80%;padding:10px 14px;border-radius:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
    .msg.user{align-self:flex-end;background:#2563eb;color:#fff;border-bottom-right-radius:4px}
    .msg.bot{align-self:flex-start;background:#1a1a1a;border:1px solid #333;border-bottom-left-radius:4px}
    #empty{flex:1;display:flex;align-items:center;justify-content:center;color:#444;font-size:14px}
    #input-area{padding:16px 20px;border-top:1px solid #222;background:#111;display:flex;gap:10px}
    #input{flex:1;padding:10px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#fff;font-size:14px;outline:none}
    #input:focus{border-color:#2563eb}
    #send{padding:10px 20px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px}
    #send:hover{background:#1d4ed8}
    #send:disabled{opacity:0.5;cursor:not-allowed}
  </style>
</head>
<body>
  <!-- Auth Page -->
  <div id="auth-page" class="page active">
    <div class="auth-box">
      <h2 id="auth-title">登录</h2>
      <div id="auth-error" class="error" style="display:none"></div>
      <input id="auth-user" placeholder="用户名" autocomplete="username">
      <input id="auth-pass" type="password" placeholder="密码" autocomplete="current-password">
      <button id="auth-submit">登录</button>
      <div id="auth-switch" class="switch">没有账号？注册</div>
    </div>
  </div>
  
  <!-- Chat Page -->
  <div id="chat-page" class="page">
    <div id="header">
      <h1>Tazavesh</h1>
      <div class="actions">
        <span id="username-display" class="info"></span>
        <button class="btn" id="new-chat">+ 新对话</button>
        <button class="btn danger" id="logout-btn">登出</button>
      </div>
    </div>
    <div id="messages"><div id="empty">开始新对话...</div></div>
    <div id="input-area">
      <input id="input" placeholder="输入消息..." autofocus>
      <button id="send">发送</button>
    </div>
  </div>

  <script>
    // Elements
    const authPage=document.getElementById("auth-page"),chatPage=document.getElementById("chat-page");
    const authTitle=document.getElementById("auth-title"),authError=document.getElementById("auth-error");
    const authUser=document.getElementById("auth-user"),authPass=document.getElementById("auth-pass");
    const authSubmit=document.getElementById("auth-submit"),authSwitch=document.getElementById("auth-switch");
    const usernameDisplay=document.getElementById("username-display"),logoutBtn=document.getElementById("logout-btn");
    const messages=document.getElementById("messages"),input=document.getElementById("input"),send=document.getElementById("send");
    const newChatBtn=document.getElementById("new-chat"),empty=document.getElementById("empty");
    
    let isLogin=true;
    
    // Auth
    authSwitch.onclick=()=>{isLogin=!isLogin;authTitle.textContent=isLogin?"登录":"注册";authSubmit.textContent=isLogin?"登录":"注册";authSwitch.textContent=isLogin?"没有账号？注册":"已有账号？登录";authError.style.display="none"};
    
    authSubmit.onclick=async()=>{
      const username=authUser.value.trim(),password=authPass.value;
      if(!username||!password){showAuthError("请填写用户名和密码");return;}
      try{
        const r=await fetch("/chat/api/"+(isLogin?"login":"register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
        const d=await r.json();
        if(d.error){showAuthError(d.error);return;}
        startChat(d.username||username);
      }catch(e){showAuthError("网络错误");}
    };
    
    authPass.onkeydown=authUser.onkeydown=e=>{if(e.key==="Enter")authSubmit.click()};
    
    function showAuthError(msg){authError.textContent=msg;authError.style.display="block"}
    
    // Check session
    async function checkSession(){
      try{
        const r=await fetch("/chat/api/me");const d=await r.json();
        if(d.logged_in)startChat(d.username);
      }catch{}
    }
    
    function startChat(username){
      authPage.classList.remove("active");chatPage.style.display="flex";
      usernameDisplay.textContent=username;
      loadHistory();
    }
    
    // Logout
    logoutBtn.onclick=async()=>{
      await fetch("/chat/api/logout",{method:"POST"});
      chatPage.style.display="none";authPage.classList.add("active");
      messages.innerHTML="";messages.appendChild(empty);
    };
    
    // History
    async function loadHistory(){
      try{
        const r=await fetch("/chat/api/history");const d=await r.json();
        if(d.messages&&d.messages.length>0){
          empty.remove();
          d.messages.forEach(m=>addMsg(m.content,m.role==="user"?"user":"bot"));
        }
      }catch{}
    }
    
    function addMsg(text,cls){empty.remove();const d=document.createElement("div");d.className="msg "+cls;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
    
    // Send
    async function sendMsg(){
      const text=input.value.trim();if(!text)return;
      input.value="";addMsg(text,"user");
      send.disabled=true;
      const loading=document.createElement("div");loading.className="msg bot loading";loading.textContent="思考中...";messages.appendChild(loading);messages.scrollTop=messages.scrollHeight;
      try{
        const r=await fetch("/chat/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});
        if(r.status===401){window.location.reload();return;}
        const d=await r.json();loading.remove();addMsg(d.reply||"(no response)","bot");
      }catch(e){loading.remove();addMsg("(error: "+e+")","bot");}
      send.disabled=false;input.focus();
    }
    
    newChatBtn.onclick=()=>{messages.innerHTML="";messages.appendChild(empty)};
    send.onclick=sendMsg;input.onkeydown=e=>{if(e.key==="Enter")sendMsg()};
    
    // Init
    checkSession();
  </script>
</body>
</html>`;

