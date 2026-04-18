'use client';

import { useState } from 'react';
import axios from 'axios';
import { FaTiktok, FaSpotify, FaFacebook, FaInstagram, FaSoundcloud, FaYoutube } from 'react-icons/fa';
import { FaXTwitter, FaThreads } from 'react-icons/fa6';
import { IoMdMusicalNotes } from 'react-icons/io';
import { FiDownload, FiSearch } from 'react-icons/fi';

const platforms = [
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: FaYoutube,
    color: '#FF0000',
    pattern: /youtube\.com|youtu\.be/i,
    endpoint: '/api/youtube'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: FaInstagram,
    color: '#E4405F',
    pattern: /instagram\.com\//i,
    endpoint: '/api/instagram'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: FaFacebook,
    color: '#1877F2',
    pattern: /facebook\.com|fb\.watch/i,
    endpoint: '/api/facebook'
  },
  { 
    id: 'x', 
    name: 'X', 
    icon: FaXTwitter,
    color: '#000000',
    pattern: /x\.com|twitter\.com/i,
    endpoint: '/api/x'
  },
  { 
    id: 'threads', 
    name: 'Threads', 
    icon: FaThreads,
    color: '#000000',
    pattern: /threads\.net/i,
    endpoint: '/api/threads'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: FaTiktok,
    color: '#000000',
    pattern: /tiktok\.com/i,
    endpoint: '/api/tiktok'
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    icon: FaSpotify,
    color: '#1DB954',
    pattern: /spotify\.com|open\.spotify\.com/i,
    endpoint: '/api/spotify'
  },
  { 
    id: 'soundcloud', 
    name: 'SoundCloud', 
    icon: FaSoundcloud,
    color: '#FF5500',
    pattern: /soundcloud\.com/i,
    endpoint: '/api/soundcloud/download',
    searchEndpoint: '/api/soundcloud/search'
  },
];

export default function Home() {
  const [selected, setSelected] = useState('instagram');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (urlStr, platformId) => {
    if (!urlStr) return '';
    const platformData = platforms.find(p => p.id === platformId);
    if (!platformData || !platformData.pattern) return '';
    if (!platformData.pattern.test(urlStr)) {
      return `Invalid URL for ${platformData.name}`;
    }
    return '';
  };

  const getMediaUrl = () => {
    if (!result) return null;
    
    if (selected === 'youtube') return result.result?.thumbnail;
    if (selected === 'instagram') return result.result?.media?.[0]?.image?.url || result.result?.media?.[0]?.video?.url;
    if (selected === 'facebook') return result.thumbnail;
    if (selected === 'x') return result.result?.thumbnail;
    if (selected === 'threads') return result.result?.thumbnail;
    if (selected === 'tiktok') return result[0]?.image?.url;
    if (selected === 'spotify') return result.cover;
    if (selected === 'soundcloud') {
      if (result.result?.[0]?.artwork) return result.result[0].artwork;
      return null;
    }
    
    return null;
  };

  const getDownloadUrl = () => {
    if (!result) return null;
    
    if (selected === 'youtube') return result.result?.download || result.result?.audio;
    if (selected === 'instagram') return result.result?.media?.[0]?.video?.url || result.result?.media?.[0]?.image?.url;
    if (selected === 'facebook') return result.video;
    if (selected === 'x') return result.result?.downloadUrls?.[0]?.url;
    if (selected === 'threads') return result.result?.video;
    if (selected === 'tiktok') return result[0]?.video?.url;
    if (selected === 'spotify') return result.url;
    if (selected === 'soundcloud') {
      if (result.link) return result.link;
      if (result.result?.[0]?.url) return result.result[0].url;
      return null;
    }
    
    return null;
  };

  const handlePlatformClick = (platformId) => {
    setSelected(platformId);
    setResult(null);
    setError('');
    setUrlError('');
    setUrl(''); // reset input
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    const err = validateUrl(value, selected);
    setUrlError(err);
  };

  const handleDownload = async () => {
    const validationError = validateUrl(url, selected);
    if (validationError) {
      setUrlError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const platform = platforms.find(p => p.id === selected);
      let response;

      if (selected === 'soundcloud') {
        // hanya download dari URL resmi soundcloud.com
        response = await axios.get(`${platform.endpoint}?url=${encodeURIComponent(url)}`);
      } else {
        // semua platform lain pakai POST
        response = await axios.post(platform.endpoint, { url });
      }

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const mediaUrl = getMediaUrl();
  const downloadUrl = getDownloadUrl();
  const currentPlatform = platforms.find(p => p.id === selected);
  const IconComponent = currentPlatform?.icon;

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">
            <FiDownload size={24} color="#fff" />
          </div>
          <h1>Downify</h1>
        </div>
        <p className="subtitle">Download media from YouTube, Instagram, Facebook, X, Threads, TikTok, Spotify, SoundCloud</p>
      </div>
      
      <div className="platform-grid">
        {platforms.map(p => {
          const PlatformIcon = p.icon;
          return (
            <button
              key={p.id}
              className={`platform-btn ${selected === p.id ? 'active' : ''}`}
              onClick={() => handlePlatformClick(p.id)}
              style={{ '--platform-color': p.color }}
            >
              <PlatformIcon size={22} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder={`Paste ${selected === 'soundcloud' ? 'SoundCloud' : selected} URL here...`}
            value={url}
            onChange={handleUrlChange}
            onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
            style={urlError ? { borderColor: '#ef4444' } : {}}
          />
          <button 
            className="download-btn" 
            onClick={handleDownload} 
            disabled={loading || !url || urlError}
          >
            {loading ? 'Processing...' : <><FiDownload size={18} /> Download</>}
          </button>
        </div>

        {urlError && (
          <div className="url-error">
            <span>⚠️</span> {urlError}
          </div>
        )}

        {error && (
          <div className="error">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Fetching your content...</span>
          </div>
        )}
        
        {result && (
          <div className="result">
            <div className="result-header">
              <span className="result-title">Result</span>
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>✓ Success</span>
            </div>
            
            {mediaUrl && (
              <div className="media-preview">
                <img src={mediaUrl} alt="Preview" />
              </div>
            )}
            
            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                <FiDownload size={18} />
                <span>Open Download Link</span>
              </a>
            )}
            
            <div className="json-view">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="author">
        Developed by <a href="https://t.me/krniwnstria" target="_blank" rel="noopener">@krniwnstria</a>
      </div>
    </div>
  );
}