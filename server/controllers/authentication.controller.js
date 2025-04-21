let pendingTask = null; // Scoped to authentication controller

export const startAuthentication = (req, res) => {
  const { fingerprintID } = req.body;
  console.log(`📡 [Auth] startAuthentication called with fingerprintID: ${fingerprintID}`);

  if (!fingerprintID) {
    console.error('📡 [Auth] Error: fingerprintID is missing');
    return res.status(400).json({ message: 'Fingerprint ID required' });
  }

  pendingTask = { task: 'authenticate', fingerprintID };
  console.log(`📡 [Auth] Task queued: ${JSON.stringify(pendingTask)}`);
  res.status(200).json({ message: 'Authentication started' });
};

export const checkTask = (req, res) => {
  console.log(`📡 [Auth] checkTask called, pendingTask: ${JSON.stringify(pendingTask)}`);
  const taskToSend = pendingTask || { task: 'none' };
  res.json(taskToSend);
  if (pendingTask) {
    setTimeout(() => {
      pendingTask = null;
      console.log('📡 [Auth] Task cleared after delay');
    }, 60000); // 2s delay to ensure ESP32 receives task
  } else {
    console.log('📡 [Auth] No task pending, sent "none"');
  }
};

export const authenticationresult = (req, res) => {
  const { success, message } = req.body;
  console.log(`📡 [Auth] authenticationResult received: ${JSON.stringify({ success, message })}`);
  global.authResult = { success, message }; // Temporary storage
  res.status(200).json({ message: 'Result received' });
};

export const getAuthenticationResult = (req, res) => {
  console.log(`📡 [Auth] getAuthenticationResult called, authResult: ${JSON.stringify(global.authResult)}`);
  if (global.authResult) {
    res.json(global.authResult);
    global.authResult = null;
  } else {
    res.json({ message: 'No result available' });
  }
};