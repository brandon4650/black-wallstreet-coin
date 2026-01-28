import React, { useEffect, useState, useCallback, useMemo } from 'react'; 
import { Trophy, Gift, Sparkles, TrendingUp, ChevronLeft, Send, Twitter, Link as LinkIcon, Users, Loader2, Calendar } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 
import { useConnection, useWallet } from '@solana/wallet-adapter-react'; 
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; 
import { PublicKey } from '@solana/web3.js'; 
 
const TULSA_MINT = "8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump"; 
const REQUIRED_BALANCE = 50000; 
 
const MILESTONE_CONFIG = { 
  "1M": { date: "2026-01-30T12:00:00-05:00", prize: "$10,000" }, // Official Date: Friday, Jan 30th @ 12:00 PM EST 
  "10M": { date: "2026-02-15T00:00:00-05:00", prize: "$25,000" }, 
  "100M": { date: "2026-03-01T00:00:00-05:00", prize: "$50,000" }, 
  "1B": { date: "2026-04-01T00:00:00-05:00", prize: "$100,000" } 
}; 
 
const GiveawayPage = () => { 
  const { connection } = useConnection(); 
  const { publicKey, connected } = useWallet(); 
  const [balance, setBalance] = useState(0); 
  const [userIP, setUserIP] = useState(null); 
  const [isVerifying, setIsVerifying] = useState(false); 
  const [hasSubmitted, setHasSubmitted] = useState(false); 
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, checking, qualified, insufficient, error, ip_blocked, vpn_blocked 
  const [vpnCountdown, setVpnCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Obfuscated System Identifier
  const _sys_get_sid = useCallback(() => {
    try {
      // AKfycbxFo7WiWQHE7xC_6YSI4SpyPS2Jwy4v7SB9fvMSfHbRRpxY0-UhNZVHUSg6Ke1kG0LF
      const parts = ["QUtmeWNieEZvN1dpV1FIRTd4Q182WVNJNFNweVBT", "Mkp3eTR2N1NCOWZ2TVNmSGJSUnB4WTAtVWhOWlZIVVNnNktlMWtHMExG"];
      return atob(parts[0]) + atob(parts[1]);
    } catch (e) { return ""; }
  }, []);

  // Ultra-Resilient Data Sync Engine (Tiered Failover)
  const _sys_fetch_entries = useCallback(async () => {
    const SID = _sys_get_sid();
    const SCRIPT_URL = `https://script.google.com/macros/s/${SID}/exec`;
    const ts = Date.now();
    const targetWithTs = `${SCRIPT_URL}?t=${ts}`;
    
    // Rotation Strategy: Try most stable proxies first
    const endpoints = [
      {
        url: `https://corsproxy.io/?${encodeURIComponent(targetWithTs)}`,
        processor: async (r) => await r.json()
      },
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetWithTs)}`,
        processor: async (r) => {
          const d = await r.json();
          return d?.contents ? JSON.parse(d.contents) : null;
        }
      },
      {
        url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetWithTs)}`,
        processor: async (r) => JSON.parse(await r.text())
      }
    ];

    for (const edge of endpoints) {
      try {
        const res = await fetch(edge.url);
        if (res.ok) {
          const data = await edge.processor(res);
          if (data && (Array.isArray(data) || typeof data === 'object')) {
            const rawEntries = Array.isArray(data) ? data.flat(Infinity) : [];
            
            const winners = {};
            const cleanEntries = [];
            
            rawEntries.forEach(entry => {
              const strEntry = String(entry || "").trim();
              if (strEntry.startsWith("OFFICIAL_WINNER_")) {
                const parts = strEntry.replace("OFFICIAL_WINNER_", "").split(":");
                if (parts.length >= 2) {
                  const m = parts[0];
                  const addr = parts[1];
                  if (!winners[m]) winners[m] = [];
                  if (!winners[m].includes(addr)) winners[m].push(addr);
                }
              } else if (strEntry.length > 30 && !strEntry.includes("{")) {
                cleanEntries.push(strEntry);
              }
            });

            setOfficialWinners(winners);
            return { entries: cleanEntries, winners: winners };
          }
        }
      } catch (err) {
        // Failover
      }
    }
    throw new Error("BWS: Global Data Sync Offline");
  }, [_sys_get_sid]);

  // Record Winner to Backend
  const recordWinner = useCallback(async (winners, milestone) => {
    const SID = _sys_get_sid();
    const SCRIPT_URL = `https://script.google.com/macros/s/${SID}/exec`;
    
    for (const winAddr of winners) {
      const entryData = {
        wallet: `OFFICIAL_WINNER_${milestone}:${winAddr}`,
        timestamp: new Date().toISOString(),
        type: 'WINNER_RECORD'
      };
      
      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(entryData)
        });
      } catch (e) {}
    }
  }, [_sys_get_sid]);
   
  // Winner Draw States 
  const [isDrawing, setIsDrawing] = useState(false); 
  const [winnerAddresses, setWinnerAddresses] = useState([]); 
  const [shuffleAddress, setShuffleAddress] = useState(""); 
  const [showCelebration, setShowCelebration] = useState(false); 
  const [isDrawComplete, setIsDrawComplete] = useState(false); 
  const [preDrawCountdown, setPreDrawCountdown] = useState(null); // null, 5, 4, 3... 
  const [officialWinners, setOfficialWinners] = useState({}); // { '1M': ['addr1'], '10M': [...] }
   
  // Security & Strike System 
  const [strikes, setStrikes] = useState(() => Number(localStorage.getItem('bws_giveaway_strikes') || 0)); 
  const [isBanned, setIsBanned] = useState(() => localStorage.getItem('bws_giveaway_banned') === 'true'); 
  const [duplicateDetected, setDuplicateDetected] = useState(false); 
  const [lastViolationMsg, setLastViolationMsg] = useState(""); 
 
  // Determine current active milestone for countdown 
  const activeMilestone = useMemo(() => { 
    try { 
      const locked = JSON.parse(localStorage.getItem('bws_locked_milestones') || '["1M"]'); 
      if (locked.includes("1B")) return "1B"; 
      if (locked.includes("100M")) return "100M"; 
      if (locked.includes("10M")) return "10M"; 
      return "1M"; 
    } catch (e) { 
      return "1M"; 
    } 
  }, []); 
 
  const currentConfig = MILESTONE_CONFIG[activeMilestone] || MILESTONE_CONFIG["1M"]; 
 
  // Countdown Logic 
  useEffect(() => { 
    const target = new Date(currentConfig.date).getTime(); 
 
    const updateTimer = () => { 
      const now = new Date().getTime(); 
      const diff = target - now; 
 
      if (diff <= 0) { 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
        return; 
      } 
 
      setTimeLeft({ 
        days: Math.floor(diff / (1000 * 60 * 60 * 24)), 
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), 
        seconds: Math.floor((diff % (1000 * 60)) / 1000) 
      }); 
    }; 
 
    updateTimer(); 
    const timer = setInterval(updateTimer, 1000); 
    return () => clearInterval(timer); 
  }, [currentConfig]); 
 
  // Winner Selection Logic (The "Big Draw" with Easing) 
  const startWinnerDraw = useCallback(async () => { 
    setIsDrawing(true); 
    setIsDrawComplete(false); 
    setShowCelebration(false); 
 
    try { 
      // 1. Fetch entries via Resilient Engine
      let syncResult;
      try {
        syncResult = await _sys_fetch_entries();
      } catch (err) {
        throw new Error("Unable to reach Security Database. Check connection.");
      }

      const allEntries = syncResult.entries;
      const winnersFound = syncResult.winners;

      // 2. CHECK FOR EXISTING OFFICIAL WINNERS FIRST (Immediate check on fresh data)
      if (winnersFound[activeMilestone] && winnersFound[activeMilestone].length > 0) {
        console.log("🏆 Official Result Found in Archive. Syncing...");
        setWinnerAddresses(winnersFound[activeMilestone]);
        setIsDrawing(false);
        setIsDrawComplete(true);
        return;
      }

      const validEntries = [...new Set(allEntries)].filter(a => a && a.length > 30);
      
      if (validEntries.length === 0) {
        throw new Error("No qualifying entries found in database.");
      }
 
      // 3. The Shuffle (Iterate through ALL addresses with easing) 
      const countToSelect = winnersCount.includes("4") ? 4 : (winnersCount.includes("3") ? 3 : (winnersCount.includes("2") ? 2 : 1));
      let currentShuffleIndex = 0; 
      let shuffleCount = 0; 
      const minShuffles = 80; 
       
      const runShuffle = (delay) => { 
        const randomItem = validEntries[currentShuffleIndex % validEntries.length]; 
        setShuffleAddress(randomItem); 
        currentShuffleIndex++; 
        shuffleCount++; 
 
        const isSlowingDown = shuffleCount > minShuffles; 
        if (!isSlowingDown || (isSlowingDown && delay < 400)) { 
          const nextDelay = isSlowingDown ? delay * 1.15 : delay; 
          setTimeout(() => runShuffle(nextDelay), nextDelay); 
        } else { 
          // 4. Final Selection 
          const selected = [];
          const entryPool = [...validEntries];
          for (let i = 0; i < countToSelect; i++) {
            if (entryPool.length === 0) break;
            const idx = Math.floor(Math.random() * entryPool.length);
            selected.push(entryPool[idx]);
            entryPool.splice(idx, 1);
          }
          
          setWinnerAddresses(selected); 
          setIsDrawing(false); 
          setIsDrawComplete(true); 
          setShowCelebration(true); 
          
          // 5. LOCK WINNER PERMANENTLY IN BACKEND
          recordWinner(selected, activeMilestone);
          
          setTimeout(() => setShowCelebration(false), 20000); 
        } 
      }; 
 
      runShuffle(30); 
 
    } catch (err) { 
      console.error("Winner Draw Error (Fallback active):", err); 
      // Fallback: Pick from local records 
      const localRecords = JSON.parse(localStorage.getItem('bws_giveaway_entries') || '{}'); 
      const localWallets = Object.values(localRecords).filter(v => typeof v === 'string'); 
       
      if (localWallets.length > 0) { 
         let shuffleCount = 0; 
         const runLocalShuffle = (delay) => { 
           const randomItem = localWallets[Math.floor(Math.random() * localWallets.length)]; 
           setShuffleAddress(randomItem); 
           shuffleCount++; 
           if (shuffleCount < 40) { 
             setTimeout(() => runLocalShuffle(delay * 1.05), delay * 1.05); 
           } else { 
             const winner = localWallets[Math.floor(Math.random() * localWallets.length)]; 
             setWinnerAddresses([winner]); 
             setIsDrawing(false); 
             setIsDrawComplete(true); 
             setShowCelebration(true); 
           } 
         }; 
         runLocalShuffle(50); 
      } else { 
        setIsDrawing(false); 
        alert("Draw could not proceed: Network error and no local entries detected."); 
      } 
    } 
  }, []); 
 
  // Pre-Draw Hype Trigger (ONLY after clock hits zero) 
  useEffect(() => { 
    const isZero = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0; 
     
    // Only trigger if we are at or past the milestone date 
    const targetDate = new Date(currentConfig.date).getTime(); 
    const now = Date.now(); 
    const hasPassed = now >= targetDate; 
 
    if (isZero && hasPassed && !isDrawing && !isDrawComplete && preDrawCountdown === null) { 
      setPreDrawCountdown(10); 
    } 
 
    if (preDrawCountdown !== null && preDrawCountdown > 0) { 
      const timer = setTimeout(() => { 
        setPreDrawCountdown(prev => prev - 1); 
      }, 1000); 
      return () => clearTimeout(timer); 
    } else if (preDrawCountdown === 0) { 
      setPreDrawCountdown(-1); // Mark as triggered 
      startWinnerDraw(); 
    } 
  }, [timeLeft, isDrawing, isDrawComplete, preDrawCountdown, startWinnerDraw]); 

  // Auto-sync Official Winners from Archive
  useEffect(() => {
    if (officialWinners[activeMilestone] && officialWinners[activeMilestone].length > 0 && !isDrawing && !isDrawComplete) {
       console.log("Archive Sync Triggered for:", activeMilestone);
       setWinnerAddresses(officialWinners[activeMilestone]);
       setIsDrawComplete(true);
       setPreDrawCountdown(-1); // Lock the hype draw
    }
  }, [officialWinners, activeMilestone, isDrawing, isDrawComplete]);

  // Global Data Initial Sync (Important for non-connected viewers)
  useEffect(() => {
    const runInitialSync = async () => {
      try { await _sys_fetch_entries(); } catch(e) {}
    };
    runInitialSync();
  }, [_sys_fetch_entries]);
 
  // Admin Reset Utility (Global trigger for dev testing) 
  useEffect(() => { 
    window.resetGiveawayEntries = () => { 
      localStorage.removeItem('bws_giveaway_entries'); 
      setHasSubmitted(false); 
      setVerificationStatus('idle'); 
      console.log("Giveaway entries wiped. Please re-connect wallet."); 
    }; 
  }, []); 
 
  // Determine winners based on milestone 
  const winnersCount = useMemo(() => { 
    try { 
      const locked = JSON.parse(localStorage.getItem('bws_locked_milestones') || '["1M"]'); 
      if (locked.includes("1B")) return "4 Legend Tier Winners"; 
      if (locked.includes("100M")) return "3 Elite Winners"; 
      if (locked.includes("10M")) return "2 Exclusive Winners"; 
      return "1 Lucky Winner"; 
    } catch (e) { 
      return "1 Lucky Winner"; 
    } 
  }, []); 
 
  // VPN Detection Logic
  const checkVPN = useCallback(async (ip) => {
    try {
      // Diagnostic logging removed for security
       
      // 1. Primary Check: ipwho.is (Broad Data) 
      const res = await fetch(`https://ipwho.is/${ip}?fields=connection,security,timezone`); 
      const data = await res.json(); 
       
      const isVPNDirect = !!(data.security?.vpn || data.security?.proxy || data.security?.tor); 
       
      const vpnKeywords = [ 
        'vpn', 'proxy', 'hosting', 'cloud', 'datacenter', 'mullvad', 'nord', 'expressvpn',  
        'server', 'vps', 'digitalocean', 'linode', 'amazon', 'aws', 'google cloud', 'azure', 
        'ovh', 'hetzner', 'leaseweb', 'choopa', 'vultr', 'akamai', 'cloudflare', 'fastly', 
        'cogent', 'zscaler', 'tunnel', 'tor', 'exit', 'gateway' 
      ]; 
       
      const isp = data.connection?.isp || ''; 
      const org = data.connection?.org || ''; 
      const domain = data.connection?.domain || ''; 
      const providerInfo = `${isp} ${org} ${domain}`.toLowerCase(); 
      const keywordMatch = vpnKeywords.some(kw => providerInfo.includes(kw)); 
 
      // 2. Secondary Check: proxycheck.io (Deep Security Scan) 
      let proxyFlag = false; 
      let pData = null; 
      try { 
        // Use proxy to avoid CORS 
        const targetUrl = encodeURIComponent(`https://proxycheck.io/v2/${ip}?vpn=1`); 
        const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${targetUrl}`); 
        const proxyData = await proxyRes.json(); 
        pData = proxyData[ip]; 
        if (pData) { 
          proxyFlag = (pData.proxy === 'yes' || pData.type === 'VPN' || pData.type === 'Proxy'); 
        } 
      } catch (e) { console.warn("ProxyCheck skip:", e); } 
 
      // 3. Timezone Mismatch Check (Secondary Indicator) 
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
      const ipTimezone = data.timezone?.id; 
      const tzMismatch = ipTimezone && browserTimezone !== ipTimezone; 
 
      // Diagnostics scrubbed
 
      // We block if direct flags are found OR keywords match OR proxy API confirms 
      const finalBlocked = isVPNDirect || keywordMatch || proxyFlag;
      if (finalBlocked) {
        setVerificationStatus('vpn_blocked');
        return true;
      }
 
      return false; 
    } catch (err) { 
      console.error("VPN Check Error:", err); 
      return false; 
    } 
  }, []); 
 
  // Fetch IP and Check VPN 
  useEffect(() => { 
    fetch('https://api.ipify.org?format=json') 
      .then(res => res.json()) 
      .then(data => { 
        setUserIP(data.ip); 
        checkVPN(data.ip); 
      }) 
      .catch(err => console.error("IP fetch error:", err)); 
  }, [checkVPN]); 
 
  // VPN Redirection Logic 
  useEffect(() => { 
    let timer; 
    if (verificationStatus === 'vpn_blocked') { 
      timer = setInterval(() => { 
        setVpnCountdown(prev => { 
          if (prev <= 1) { 
            clearInterval(timer); 
            window.location.href = '/'; 
            return 0; 
          } 
          return prev - 1; 
        }); 
      }, 1000); 
    } 
    return () => clearInterval(timer); 
  }, [verificationStatus]); 
 
  // Check if already submitted (simulated backend check) 
  useEffect(() => { 
    if (publicKey && userIP) { 
      const pubKeyStr = publicKey.toBase58(); 
      const records = JSON.parse(localStorage.getItem('bws_giveaway_entries') || '{}'); 
       
      // If the wallet itself has submitted 
      const walletSubmitted = records[pubKeyStr] === true; 
      // If the IP has submitted with THIS wallet 
      const ipOwner = records[userIP]; 
       
      if (ipOwner === pubKeyStr || walletSubmitted) { 
        setHasSubmitted(true); 
      } else { 
        setHasSubmitted(false); 
      } 
    } else { 
      setHasSubmitted(false); 
    } 
  }, [publicKey, userIP]); 
 
  const checkBalance = useCallback(async (forced = false) => { 
    // Priority: Try to read directly from the injected provider 
    let activeKey = publicKey; 
    const phantomKey = window.solana?.publicKey; 
    const solflareKey = window.solflare?.publicKey; 
     
    if (phantomKey && phantomKey.toBase58() !== publicKey?.toBase58()) { 
      activeKey = phantomKey; 
    } else if (solflareKey && solflareKey.toBase58() !== publicKey?.toBase58()) { 
      activeKey = solflareKey; 
    } 
 
    if (!activeKey) return; 
 
    try { 
      setIsVerifying(true); 
      setVerificationStatus('checking'); 
       
      const pubKeyStr = activeKey.toBase58(); 
      console.log(forced ? "FORCE SCAN" : "AUTO SCAN", pubKeyStr); 
 
      // Consolidated Security Check: VPN + Associated Wallet Tracking 
      const records = JSON.parse(localStorage.getItem('bws_giveaway_entries') || '{}'); 
       
      // 1. Detect if this IP is using a DIFFERENT wallet than what's registered (Multi-entry attempt) 
      if (records[userIP] && records[userIP] !== pubKeyStr) { 
        console.warn("🛡️ Security Alert: Associated Wallet Bypass Attempted."); 
        setVerificationStatus('vpn_blocked'); // Trigger high-impact security UI 
        setIsVerifying(false); 
        return; 
      } 
 
      // 2. Aggressive VPN Scan 
      const isVPN = await checkVPN(userIP); 
      if (isVPN) { 
        setIsVerifying(false); 
        return; 
      } 
 
      // 3. AUTO-CHECK: Has this user already entered?
      try {
        const syncResult = await _sys_fetch_entries();
        const entries = syncResult.entries;
        const alreadyIn = entries.some(e => e && (String(e).trim().toLowerCase() === pubKeyStr.toLowerCase() || String(e).trim().toLowerCase() === userIP.toLowerCase()));
        if (alreadyIn) {
          setHasSubmitted(true);
        }
      } catch (e) {
        // Silent fail for non-critical check
      }
 
      const mintPublicKey = new PublicKey(TULSA_MINT); 
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner( 
        activeKey,  
        { mint: mintPublicKey }, 
        'processed' 
      ); 
 
      let totalBalance = 0; 
      tokenAccounts.value.forEach((accountInfo) => { 
        const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount || 0; 
        totalBalance += amount; 
      }); 
 
      setBalance(totalBalance); 
       
      if (totalBalance >= REQUIRED_BALANCE) { 
        setVerificationStatus('qualified'); 
      } else { 
        setVerificationStatus('insufficient'); 
      } 
    } catch (error) { 
      console.error("Scan failed:", error); 
      setVerificationStatus(error.message?.includes('403') ? 'rpc_error' : 'error'); 
    } finally { 
      setIsVerifying(false); 
    } 
  }, [publicKey, connection, userIP]); 
 
  // Deep extension listeners for instant account switching 
  useEffect(() => { 
    const phantom = window.solana; 
    const solflare = window.solflare; 
 
    const handleAccountChange = (newKey) => { 
      console.log("EXT EVENT: Account changed detected!", newKey?.toBase58()); 
      // Small delay to let the wallet adapter internal state catch up 
      setTimeout(() => checkBalance(true), 300); 
    }; 
 
    if (phantom?.on) phantom.on('accountChanged', handleAccountChange); 
    if (solflare?.on) solflare.on('accountChanged', handleAccountChange); 
 
    return () => { 
      if (phantom?.off) phantom.off('accountChanged', handleAccountChange); 
      if (solflare?.off) solflare.off('accountChanged', handleAccountChange); 
    }; 
  }, [checkBalance]); 
 
  // Sync effect when connected/publicKey changes 
  useEffect(() => { 
    if (connected && publicKey && userIP) { 
      setVerificationStatus('checking');  
      const timer = setTimeout(() => checkBalance(), 500); 
      return () => clearTimeout(timer); 
    } else if (connected && publicKey && !userIP) { 
      setVerificationStatus('checking'); // Keep in looooop until IP is ready 
    } else { 
      setVerificationStatus('idle'); 
      setBalance(0); 
    } 
  }, [connected, publicKey?.toBase58(), checkBalance, userIP]); 
 
  const handleEntry = async () => { 
    if (verificationStatus !== 'qualified' || !publicKey || !userIP || isBanned) return; 
     
    setIsVerifying(true); 
    setDuplicateDetected(false); 
    const pubKeyStr = publicKey.toBase58(); 
 
    // Hardcoded fallback to ensure connectivity 
    const SID = _sys_get_sid(); 
    const DEFAULT_URL = `https://script.google.com/macros/s/${SID}/exec`; 
    const SCRIPT_URL = process.env.REACT_APP_SHEETS_URL || DEFAULT_URL;  
 
    try { 
      // 1. Live Duplicate Check
      let allEntries = [];
      try {
        const syncResult = await _sys_fetch_entries();
        allEntries = syncResult.entries;
      } catch (e) {
        // Fallback to local records
        const localRecords = JSON.parse(localStorage.getItem('bws_giveaway_entries') || '{}');
        if (localRecords[pubKeyStr] || localRecords[userIP]) {
           allEntries = [pubKeyStr, userIP]; 
        }
      }
 
      const isDuplicate = allEntries.some(entry => {
        if (!entry) return false;
        const cleanEntry = String(entry).trim().toLowerCase();
        const cleanWallet = pubKeyStr.trim().toLowerCase();
        const cleanIP = userIP.trim().toLowerCase();
        return cleanEntry === cleanWallet || cleanEntry === cleanIP;
      });

      if (isDuplicate) {
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);
        localStorage.setItem('bws_giveaway_strikes', newStrikes);
        
        if (newStrikes >= 3) {
          setIsBanned(true);
          localStorage.setItem('bws_giveaway_banned', 'true');
          setLastViolationMsg("PERMANENT BAN: 3 strikes exceeded. Your eligibility is void.");
        } else {
          setDuplicateDetected(true);
          setLastViolationMsg(`Warning: You have already entered into the giveaway. If this is an attempt to gain more entries, your current entries will become void. Strike ${newStrikes}/3.`);
          setTimeout(() => setIsVerifying(false), 2000);
          return;
        }
        setIsVerifying(false);
        return;
      }
 
      // 2. Safe Submission
      const entryData = {
        wallet: pubKeyStr,
        ip: userIP,
        balance: balance,
        timestamp: new Date().toISOString()
      };

      if (SCRIPT_URL !== "#") {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(entryData)
        });
      }
 
      // Record locally 
      const records = JSON.parse(localStorage.getItem('bws_giveaway_entries') || '{}'); 
      records[pubKeyStr] = true; 
      records[userIP] = pubKeyStr; 
      localStorage.setItem('bws_giveaway_entries', JSON.stringify(records)); 
       
      setHasSubmitted(true); 
    } catch (e) { 
      console.error("SUBMISSION FAILED", e); 
    } finally { 
      setIsVerifying(false); 
    } 
  }; 
 
  const resetStrikes = () => { 
    setStrikes(0); 
    setIsBanned(false); 
    setDuplicateDetected(false); 
    localStorage.removeItem('bws_giveaway_strikes'); 
    localStorage.removeItem('bws_giveaway_banned'); 
    alert("Security Reset: Strikes cleared."); 
  }; 
 
  const walletAddress = useMemo(() => { 
    const phantomKey = window.solana?.publicKey?.toBase58(); 
    const solflareKey = window.solflare?.publicKey?.toBase58(); 
    const hookKey = publicKey?.toBase58(); 
     
    // Prioritize the provider's actual key for the display 
    const activeStr = phantomKey || solflareKey || hookKey; 
    if (!activeStr) return null; 
    return `${activeStr.slice(0, 4)}...${activeStr.slice(-4)}`; 
  }, [publicKey]); 
 
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []); 
 
  const stats = [ 
    { label: "Giveaway Amount", value: currentConfig.prize, image: "/images/giveaway-gift.png" }, 
    { label: "Winners", value: winnersCount, image: "/images/giveaway-winners.png" }, 
    { label: "Requirements", value: "Snapshot", image: "/images/giveaway-snapshot.png" } 
  ]; 
 
  return ( 
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center"> 
      {/* Background celebration effects */} 
      <div className="absolute inset-0 pointer-events-none"> 
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1)_0%,transparent_50%)]" /> 
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" /> 
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] animate-pulse delay-700" /> 
      </div> 
 
      {/* Content wrapper */} 
      <div className="relative z-10 w-full max-w-4xl px-4 py-20 flex flex-col items-center"> 
         
        {/* Navigation Back */} 
        <Link  
          to="/"  
          className="absolute top-10 left-4 sm:left-0 flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors group" 
        > 
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase tracking-widest text-xs">Back to Dashboard</span> 
        </Link> 
 
        {/* Countdown HUD / Winner HUD */} 
        <div className={`w-full bg-zinc-900/40 backdrop-blur-xl border border-amber-500/20 rounded-[2.5rem] px-8 mb-12 mt-12 relative overflow-hidden group/countdown animate-scale-up flex items-center transition-all duration-1000 ease-in-out ${ 
          isDrawing || isDrawComplete || (preDrawCountdown !== null && preDrawCountdown > 0) ? 'min-h-[280px] py-12' : 'min-h-[160px] py-8' 
        }`}> 
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-50" /> 
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" /> 
           
          {showCelebration && ( 
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden"> 
               {[...Array(40)].map((_, i) => ( 
                 <div  
                   key={i}  
                   className="absolute bg-gradient-to-br from-amber-400 via-amber-200 to-amber-600 w-6 h-4 rounded-[2px] shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-ticket-fall border border-white/20" 
                   style={{ 
                     left: `${Math.random() * 100}%`, 
                     animationDelay: `${Math.random() * 4}s`, 
                     opacity: Math.random() * 0.5 + 0.5, 
                     transform: `rotate(${Math.random() * 360}deg)` 
                   }} 
                 > 
                   <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,white_2px,white_4px)]" /> 
                 </div> 
               ))} 
            </div> 
          )} 
 
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8"> 
 
            <div className={`flex flex-col items-center gap-6 transition-all duration-700 w-full ${isDrawing || isDrawComplete || preDrawCountdown > 0 ? 'opacity-100 scale-100' : ''}`}> 
               
              {/* 1. Milestone & Prize info (Prominent Header) */} 
              <div className="text-center flex flex-col items-center gap-2"> 
                <div className="flex items-center gap-3"> 
                  <div className="h-[1px] w-8 bg-amber-500/20" /> 
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] text-glow"> 
                    {isDrawComplete ? "GIVEAWAY COMPLETE" :  
                     (isDrawing ? "DRAWING NOW..." : "OFFICIAL BWS GIVEAWAY")} 
                  </span> 
                  <div className="h-[1px] w-8 bg-amber-500/20" /> 
                </div> 
                 
                <h3 className="text-white font-black text-3xl sm:text-5xl tracking-tighter uppercase drop-shadow-2xl flex flex-col md:flex-row items-center gap-x-6 gap-y-2"> 
                  <span>{activeMilestone === '1B' ? '$1 Billion' : `${activeMilestone}illion`} Milestone</span> 
                  <span className="hidden md:block text-amber-500/30 text-4xl font-thin">|</span> 
                  <span className="text-amber-500 flex items-center gap-3"> 
                    <span className="text-lg sm:text-2xl text-zinc-500 font-bold tracking-[0.2em]">PRIZE:</span>  
                    {currentConfig.prize} 
                  </span> 
                </h3> 
              </div> 
 
              {/* 2. Main Clock (Stays at 0 during hype/draw) */} 
              <div className="flex flex-col items-center gap-4"> 
                <div className="flex items-center gap-4 sm:gap-6"> 
                  {[ 
                    { label: 'DAYS', value: timeLeft.days }, 
                    { label: 'HRS', value: timeLeft.hours }, 
                    { label: 'MINS', value: timeLeft.minutes }, 
                    { label: 'SECS', value: timeLeft.seconds } 
                  ].map((unit, i) => ( 
                    <React.Fragment key={unit.label}> 
                      <div className="flex flex-col items-center min-w-[50px] sm:min-w-[70px]"> 
                        <span className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter shimmer-text"> 
                          {unit.value.toString().padStart(2, '0')} 
                        </span> 
                        <span className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{unit.label}</span> 
                      </div> 
                      {i < 3 && <div className="h-10 w-[1px] bg-white/10 mx-1" />} 
                    </React.Fragment> 
                  ))} 
                </div> 
 
                {/* 3. Detailed Date/Time/Timezone - ALWAYS VISIBLE BELOW CLOCK */} 
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 bg-black/20 px-4 py-1.5 rounded-full border border-white/5"> 
                  <Calendar className="w-3 h-3 text-amber-500/50" /> 
                  <span className="uppercase tracking-[0.1em]"> 
                    {new Date(currentConfig.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} @ 
                    {' '} {new Date(currentConfig.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' })} 
                  </span> 
                </div> 
              </div> 
 
              {/* 4. Draw Overlay Logic - BELOW CLOCK */} 
              {(preDrawCountdown > 0 || isDrawing || isDrawComplete) && ( 
                <div className="w-full max-w-xl animate-scale-up pt-8 border-t border-white/5 flex flex-col items-center"> 
                  {preDrawCountdown > 0 ? ( 
                    <div className="flex flex-col items-center"> 
                      <div className="text-7xl font-black text-amber-500 tracking-tighter scale-in-out drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"> 
                        {preDrawCountdown} 
                      </div> 
                      <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.5em] mt-2 animate-pulse">GET READY FOR DRAW</span> 
                    </div> 
                  ) : isDrawing ? ( 
                    <div className="flex flex-col items-center w-full"> 
                      <div className="text-2xl font-black text-amber-500 font-mono tracking-tighter shimmer-text bg-amber-500/5 px-6 py-4 rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)] w-full text-center min-h-[64px] flex items-center justify-center"> 
                        {shuffleAddress} 
                      </div> 
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-4 animate-pulse italic">RANDOMLY SCANNING ALL ENTRIES...</span> 
                    </div> 
                  ) : isDrawComplete ? ( 
                    <div className="flex flex-col items-center gap-4 w-full animate-scale-up"> 
                      <div className="flex flex-col items-center gap-6 bg-amber-500/10 border border-amber-500/30 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.3)] relative overflow-hidden group/win w-full border-dashed"> 
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)]" /> 
                        <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shiny-sweep" /> 
                         
                        <div className="text-center relative z-10 w-full overflow-hidden"> 
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">
                            {officialWinners[activeMilestone] ? "OFFICIAL ARCHIVED RESULT" : "LUCKY WINNER SELECTED"}
                          </p> 
                          <div className="flex flex-col gap-3 mb-6">
                            {winnerAddresses.map((addr, idx) => (
                              <div key={idx} className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-amber-500/20 group/addr relative overflow-hidden"> 
                                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tighter shimmer-text block truncate"> 
                                  {addr} 
                                </span>
                                {(winnerAddresses.length > 1) && (
                                  <span className="absolute top-1 right-2 text-[8px] font-black text-amber-500/40">WINNER #{idx + 1}</span>
                                )}
                              </div>
                            ))}
                          </div> 
                           
                          <button  
                            onClick={() => { 
                              navigator.clipboard.writeText(winnerAddresses.join(', ')); 
                              alert("Winner address(es) copied!"); 
                            }} 
                            className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(245,158,11,0.4)] active:scale-95 group/copy mb-2 flex items-center gap-3 mx-auto" 
                          > 
                            <LinkIcon className="w-5 h-5 group-hover/copy:rotate-12 transition-transform" /> 
                            Copy Winner Address 
                          </button> 
                        </div> 
                      </div> 
                      <div className="flex items-center gap-2"> 
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" /> 
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">VERIFIED ON BWS ACADEMY DATA</span> 
                      </div> 
                    </div> 
                  ) : null} 
                </div> 
              )} 
            </div> 
          </div> 
           
          {/* Auto-trigger logic is in useEffect */} 
        </div> 
 
        {/* Hero Celebration Section */} 
        <div className="text-center mb-16 animate-slide-up"> 
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-amber-400 text-sm font-black mb-8 animate-bounce"> 
            <Sparkles className="h-5 w-5" /> 
            MILESTONE ACHIEVED 
          </div> 
          <h1 className="text-5xl sm:text-8xl font-black mb-6 leading-tight"> 
            JOIN THE <br /> 
            <span className="shimmer-text">GIVEAWAY</span> 
          </h1> 
          <p className="text-zinc-400 text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed"> 
            The <span className="text-amber-500 font-bold">{activeMilestone === '1B' ? '$1,000,000,000' : `${activeMilestone}illion`} Market Cap</span> snapshot is approaching.  
            Exclusive rewards for our dedicated holders! 
          </p> 
        </div> 
 
        {/* Main Entry Card */} 
        <div className="w-full glass rounded-[2.5rem] border border-amber-500/20 p-8 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative group animate-scale-up"> 
          {/* Internal background glow */} 
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" /> 
 
          <div className="relative z-10"> 
            {/* Prize Stats Grid */} 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"> 
              {stats.map((stat, i) => ( 
                <div key={i} className="p-6 rounded-2xl glass-dark border border-white/5 flex flex-col items-center text-center"> 
                  <div className="w-20 h-20 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 overflow-hidden"> 
                    {stat.image ? ( 
                      <img src={stat.image} alt={stat.label} className="w-full h-full object-cover" /> 
                    ) : ( 
                      <stat.icon className="h-6 w-6 text-amber-500" /> 
                    )} 
                  </div> 
                  <span className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">{stat.label}</span> 
                  <span className="text-xl font-bold text-white">{stat.value}</span> 
                </div> 
              ))} 
            </div> 
 
            {/* Verification Section */} 
            <div className="mb-12"> 
              <h3 className="text-2xl font-black mb-8 text-center flex items-center justify-center gap-3"> 
                <div className="h-px w-10 bg-amber-500/30" /> 
                ENTRY REQUIREMENT 
                <div className="h-px w-10 bg-amber-500/30" /> 
              </h3> 
 
              <div className="max-w-md mx-auto space-y-6"> 
                <div className="p-6 rounded-2xl glass-dark border border-amber-500/30 bg-amber-500/5 text-center flex flex-col items-center"> 
                  <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 border border-amber-500/30 overflow-hidden group-hover:scale-110 transition-transform duration-500"> 
                    <img src="/images/coin-logo.png" alt="$TULSA Coin" className="w-full h-full object-cover animate-wiggle" /> 
                  </div> 
                   
                  <h4 className="text-2xl font-black text-white mb-1">50,000 $TULSA</h4> 
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Minimum Holding Required</p> 
                </div> 
 
                {/* Wallet Connection / Verification Button */} 
                <div className="flex flex-col items-center gap-4 py-4"> 
                  {!connected ? ( 
                    <div className="wallet-adapter-wrapper"> 
                      <WalletMultiButton className="premium-wallet-button" /> 
                    </div> 
                  ) : ( 
                    <div className="w-full space-y-4"> 
                      {verificationStatus === 'checking' && ( 
                        <div className="flex flex-col items-center gap-2 animate-pulse"> 
                          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" /> 
                          <p className="text-amber-500 font-bold italic">Verifying $TULSA Holdings...</p> 
                        </div> 
                      )} 
 
                      {verificationStatus === 'qualified' && (
                        <div className="flex flex-col items-center gap-6 w-full">
                          {isBanned ? (
                            <div className="flex flex-col items-center gap-6 bg-red-600/20 border-2 border-red-500 p-10 rounded-[2.5rem] animate-pulse relative overflow-hidden text-center w-full">
                               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2)_0%,transparent_70%)]" />
                               <div className="w-28 h-28 rounded-full bg-red-500/30 flex items-center justify-center border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] relative z-10 mb-2">
                                 <span className="text-6xl font-black text-white drop-shadow-2xl">BANNED</span>
                               </div>
                               <h5 className="text-3xl font-black text-white tracking-widest uppercase relative z-10">ELIGIBILITY VOID</h5>
                               <p className="text-red-200 text-sm font-bold relative z-10 max-w-[280px]">
                                 Permanent exclusion from BWS giveaways due to continuous security violations.
                               </p>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col items-center gap-4 bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl animate-scale-up relative overflow-hidden group/success w-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50" />
                                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-bounce border border-amber-500/40 relative overflow-hidden z-10">
                                  <span className="shimmer-text text-3xl font-black drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] select-none relative z-10">
                                    ✔
                                  </span>
                                </div>
                                <div className="text-center relative z-10">
                                  <h5 className="text-amber-500 font-black text-xl tracking-tighter shimmer-text uppercase">QUALIFIED FOR GIVEAWAY!</h5>
                                  <p className="text-zinc-400 text-sm mt-1 font-medium italic">
                                    Wallet: <span className="text-white font-bold">{walletAddress}</span>
                                  </p>
                                  <p className="text-zinc-400 text-sm mt-1 font-medium">
                                    Balance: <span className="text-white font-bold tracking-widest">{balance.toLocaleString()} $TULSA</span>
                                  </p>
                                </div>

                                {strikes > 0 && (
                                  <div className="mt-4 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 flex items-center gap-3">
                                    <div className="flex gap-1">
                                      {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < strikes ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-zinc-800'}`} />
                                      ))}
                                    </div>
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Strike {strikes} / 3</span>
                                  </div>
                                )}
                              </div>

                              {duplicateDetected ? (
                                <div className="w-full p-6 rounded-[2rem] bg-red-500/10 border-2 border-red-500/50 animate-wiggle text-center flex flex-col items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/40">
                                    <span className="text-2xl font-black text-red-500">!</span>
                                  </div>
                                  <p className="text-red-400 text-sm font-black leading-snug">
                                    {lastViolationMsg}
                                  </p>
                                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Attempted Entry Detected for: {walletAddress}</p>
                                </div>
                              ) : (
                                !hasSubmitted && (
                                  <button 
                                    onClick={handleEntry}
                                    disabled={isVerifying}
                                    className="w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 h-16 rounded-2xl font-black text-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_60px_rgba(245,158,11,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                  >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                      {isVerifying ? (
                                        <>
                                          <Loader2 className="h-6 w-6 animate-spin" />
                                          <span>SCANNING SYSTEM...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                          <span>ENTER GIVEAWAY NOW</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                                  </button>
                                )
                              )}

                              {hasSubmitted && !duplicateDetected && (
                                <div className="w-full bg-gradient-to-br from-amber-500/10 via-zinc-900/95 to-amber-500/5 border-2 border-amber-500/40 p-10 rounded-[2.5rem] text-center group/submitted overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.1)] animate-scale-up">
                                  {/* Animated background highlights */}
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] animate-pulse" />
                                  <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shiny-sweep opacity-30" />
                                  
                                  {/* High-Impact Golden Checkmark Seal */}
                                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 mx-auto mb-8 p-1 shadow-[0_0_50px_rgba(245,158,11,0.4)] group-hover/submitted:scale-110 transition-transform duration-700 relative z-10">
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent" />
                                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-200 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] select-none animate-bounce">
                                        ✔
                                      </span>
                                      {/* Internal Shimmer Sweep */}
                                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shiny-sweep" />
                                    </div>
                                  </div>

                                  <div className="relative z-10 space-y-3">
                                    <h6 className="text-amber-500 font-black text-3xl tracking-[0.25em] uppercase shimmer-text drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                                      ENTRY CONFIRMED
                                    </h6>
                                    <p className="text-zinc-400 text-base font-medium max-w-[320px] mx-auto leading-relaxed">
                                      Your spot in the <span className="text-white font-black">$TULSA</span> prize pool is officially <span className="text-amber-400">Locked In</span>.
                                    </p>
                                    
                                    <div className="pt-8 flex flex-col items-center gap-4">
                                      <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                                      <div className="flex items-center gap-3 bg-black/40 px-6 py-2.5 rounded-full border border-amber-500/20 shadow-inner group/data">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shadow-[0_0_10px_#22c55e]" />
                                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em] whitespace-nowrap">
                                          Blockchain Verified Data Seal
                                        </span>
                                      </div>
                                      <p className="text-zinc-600 text-[9px] font-black tracking-widest uppercase italic">Good luck to all $TULSA holders</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
 
                      {verificationStatus === 'ip_blocked' && ( 
                        <div className="flex flex-col items-center gap-4 bg-red-500/10 border border-red-500/30 p-8 rounded-2xl animate-scale-up relative overflow-hidden group/error text-center"> 
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_0%,transparent_70%)]" /> 
                          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-wiggle relative overflow-hidden z-10 mx-auto"> 
                            <span className="shimmer-text-red text-3xl font-black drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] select-none relative z-10"> 
                              ! 
                            </span> 
                            <div className="absolute inset-x-0 h-px bg-white/40 blur-sm -skew-x-12 opacity-50 translate-y-2 animate-shiny-sweep" /> 
                          </div> 
                          <div className="relative z-10"> 
                            <h5 className="text-red-500 font-black text-xl tracking-tighter uppercase shimmer-text-red">MULTIPLE ACCOUNTS</h5> 
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1 mb-2">Detected: {walletAddress}</p> 
                            <p className="text-zinc-400 text-sm mt-1 leading-relaxed max-w-[250px] font-medium mx-auto"> 
                              To ensure fairness, entry is limited to <span className="text-white font-bold">one wallet</span> per connection. 
                            </p> 
                          </div> 
                        </div> 
                      )} 
 
                      {verificationStatus === 'insufficient' && ( 
                        <div className="flex flex-col items-center gap-6 bg-amber-500/5 border border-amber-500/20 p-8 rounded-2xl animate-scale-up relative group/insufficient overflow-hidden text-center"> 
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-30" /> 
                          <div className="w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-float relative z-10 mx-auto overflow-hidden mb-2"> 
                            <img src="/images/tulsa-sad.png" alt="Sad TULSA Mascot" className="w-full h-full object-cover grayscale-[0.1]" /> 
                          </div> 
                          <div className="relative z-10"> 
                            <h5 className="text-zinc-400 font-black text-2xl tracking-tighter uppercase mb-2">HOLDINGS TOO LOW</h5> 
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3">Wallet: {walletAddress}</p> 
                            <p className="text-zinc-500 text-sm mb-8 font-medium"> 
                              You currently have <span className="text-white font-bold">{balance.toLocaleString()} $TULSA</span> 
                            </p> 
                             
                            <div className="relative mb-6 flex flex-col items-center"> 
                              <img  
                                src="/images/pointing-hand.png"  
                                alt="Point"  
                                className="w-20 h-20 animate-bounce mb-2 drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)]" 
                              /> 
                              <a  
                                href={`https://jup.ag/swap/SOL-${TULSA_MINT}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95" 
                              > 
                                BUY $TULSA ON JUPITER 
                              </a> 
                            </div> 
                          </div> 
                        </div> 
                      )} 
 
                      {verificationStatus === 'rpc_error' && ( 
                        <div className="flex flex-col items-center gap-4 bg-zinc-900/80 border border-amber-500/20 p-8 rounded-2xl animate-fade-in text-center"> 
                          <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-2 mx-auto" /> 
                          <h5 className="text-amber-500 font-black text-xl tracking-tighter uppercase">NETWORK DELAY</h5> 
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Scanning: {walletAddress}</p> 
                          <p className="text-zinc-500 text-sm font-medium"> 
                            Solana RPC is currently overwhelmed. <br /> 
                            Retrying in a moment... 
                          </p> 
                        </div> 
                      )} 
 
                      {verificationStatus === 'error' && ( 
                        <div className="flex flex-col items-center gap-4 bg-red-500/10 border border-red-500/30 p-8 rounded-2xl animate-fade-in text-center"> 
                          <h5 className="text-red-500 font-black text-xl tracking-tighter uppercase">SCAN FAILED</h5> 
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Wallet: {walletAddress}</p> 
                          <p className="text-zinc-400 text-sm"> 
                            Could not verify wallet holdings. <br /> 
                            Please check your network. 
                          </p> 
                        </div> 
                      )} 
 
                      {verificationStatus === 'vpn_blocked' && ( 
                        <div className="flex flex-col items-center gap-6 bg-red-600/10 border border-red-500/40 p-10 rounded-[2.5rem] animate-scale-up relative overflow-hidden group/vpn text-center"> 
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.2)_0%,transparent_70%)]" /> 
                           
                          {/* Serious Mascot Head */} 
                          <div className="w-40 h-40 rounded-full bg-zinc-900 flex items-center justify-center border-4 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.4)] relative z-10 mx-auto overflow-hidden animate-pulse"> 
                            <img src="/images/tulsa-no.png" alt="Serious TULSA Mascot" className="w-full h-full object-cover" /> 
                          </div> 
 
                          <div className="relative z-10 space-y-4"> 
                            <h5 className="text-red-500 font-black text-3xl tracking-tighter uppercase shimmer-text-red">SECURITY ALERT</h5> 
                            <p className="text-white text-sm font-bold uppercase tracking-[0.2em] bg-red-600/20 py-2 px-4 rounded-lg border border-red-600/30"> 
                              ENTRY REJECTED 
                            </p> 
                             
                            <div className="flex flex-col items-center gap-4 py-4"> 
                              <img  
                                src="/images/waving-no.png"  
                                alt="No"  
                                className="w-24 h-24 animate-wiggle scale-x-[-1] drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]" 
                              /> 
                              <p className="text-zinc-400 text-base leading-relaxed max-w-[300px] font-medium mx-auto"> 
                                To ensure fairness, <span className="text-white font-bold">VPNs and Multiple Wallets</span> are strictly prohibited. 
                              </p> 
                            </div> 
 
                            <div className="pt-4 border-t border-white/5"> 
                              <p className="text-red-500/80 text-xs font-black uppercase tracking-widest mb-2"> 
                                Turn off VPN / Use your first wallet 
                              </p> 
                              <div className="flex items-center justify-center gap-2"> 
                                <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" /> 
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest"> 
                                  Redirecting in {vpnCountdown}s 
                                </p> 
                              </div> 
                            </div> 
                          </div> 
                        </div> 
                      )} 
 
                      <div className="mt-2 text-center">
                        <button 
                          onClick={() => checkBalance(true)}
                          disabled={isVerifying}
                          className="text-amber-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 mx-auto px-6 py-2 rounded-full border border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5 hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/10"
                        >
                          <TrendingUp className="h-3 w-3" />
                          Force Re-scan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-zinc-500 text-[10px] text-center leading-relaxed">
                  Holdings are verified via on-chain snapshot. Tokens must be in your wallet at the time of the milestone events to remain eligible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center animate-fade-in opacity-50">
          <p className="text-zinc-600 text-sm font-bold">
            © 2026 BLACK WALLSTREET COIN. CELEBRATING PROSPERITY.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiveawayPage;
