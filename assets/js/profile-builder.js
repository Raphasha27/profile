(function() {
  'use strict';

  function ProfileBuilder(config) {
    this.config = Object.assign({
      containerId: 'profileBuilder',
      defaultUsername: 'Raphasha27',
      defaultName: 'Koketso Raphasha',
      theme: {
        bg: '#0a0a0f',
        surface: '#111118',
        accent: '#6c5ce7',
        accent2: '#00d2ff',
        text: '#e8e8f0',
        text2: '#a0a0b8'
      }
    }, config);

    this.init();
  }

  ProfileBuilder.prototype.init = function() {
    var self = this;
    var container = document.getElementById(this.config.containerId);
    if (!container) {
      console.warn('ProfileBuilder: container #' + this.config.containerId + ' not found');
      return;
    }

    container.innerHTML =
      '<div style="background:' + this.config.theme.surface + ';border:1px solid #2a2a3a;border-radius:12px;padding:32px;max-width:600px;margin:0 auto;">' +
        '<h3 style="margin-bottom:16px;color:' + this.config.theme.text + ';">Generate Your Profile Card</h3>' +
        '<div style="margin-bottom:12px;">' +
          '<label style="font-size:0.82rem;color:' + this.config.theme.text2 + ';display:block;margin-bottom:4px;">GitHub Username</label>' +
          '<input type="text" id="pb-username" value="' + this.config.defaultUsername + '" ' +
            'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:' + this.config.theme.bg + ';color:' + this.config.theme.text + ';font-size:0.9rem;">' +
        '</div>' +
        '<div style="margin-bottom:12px;">' +
          '<label style="font-size:0.82rem;color:' + this.config.theme.text2 + ';display:block;margin-bottom:4px;">Full Name</label>' +
          '<input type="text" id="pb-name" value="' + this.config.defaultName + '" ' +
            'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:' + this.config.theme.bg + ';color:' + this.config.theme.text + ';font-size:0.9rem;">' +
        '</div>' +
        '<div style="margin-bottom:12px;">' +
          '<label style="font-size:0.82rem;color:' + this.config.theme.text2 + ';display:block;margin-bottom:4px;">Title / Tagline</label>' +
          '<input type="text" id="pb-title" value="Systems Architect & AI Engineer" ' +
            'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:' + this.config.theme.bg + ';color:' + this.config.theme.text + ';font-size:0.9rem;">' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<label style="font-size:0.82rem;color:' + this.config.theme.text2 + ';display:block;margin-bottom:4px;">Links (one per line: label|url)</label>' +
          '<textarea id="pb-links" rows="4" ' +
            'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:' + this.config.theme.bg + ';color:' + this.config.theme.text + ';font-size:0.85rem;resize:vertical;">GitHub|https://github.com/Raphasha27' + "\n" +
            'LinkedIn|https://linkedin.com/in/koketso-raphasha' + "\n" +
            'Portfolio|https://portfolio-react-zeta-black-48.vercel.app/' + "\n" +
            'X/Twitter|https://twitter.com/Raphasha27' + "\n" +
            'Dev.to|https://dev.to/Raphasha27' + "\n" +
            'Hashnode|https://hashnode.com/@Raphasha27' + "\n" +
            'Email|mailto:koketso.raphasha@example.com' + "\n" +
            'Freelance|https://www.upwork.com/freelancers/~raphasha27' +
          '</textarea>' +
        '</div>' +
        '<button onclick="window.profileBuilder.generate()" ' +
          'style="width:100%;padding:12px;border-radius:8px;background:' + this.config.theme.accent + ';color:#fff;font-weight:600;border:none;cursor:pointer;font-size:0.9rem;">Generate Profile Card</button>' +
        '<div id="pb-output" style="margin-top:20px;display:none;"></div>' +
        '<div id="pb-embed-code" style="margin-top:12px;display:none;">' +
          '<label style="font-size:0.82rem;color:' + this.config.theme.text2 + ';display:block;margin-bottom:4px;">Embed HTML (copy & paste anywhere)</label>' +
          '<textarea id="pb-embed-textarea" rows="6" readonly ' +
            'style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:' + this.config.theme.bg + ';color:' + this.config.theme.text2 + ';font-size:0.78rem;font-family:monospace;"></textarea>' +
          '<button onclick="window.profileBuilder.copyEmbed()" ' +
            'style="margin-top:8px;padding:8px 16px;border-radius:6px;background:transparent;color:' + this.config.theme.accent + ';border:1px solid ' + this.config.theme.accent + ';cursor:pointer;font-size:0.82rem;">Copy to Clipboard</button>' +
        '</div>' +
      '</div>';

    window.profileBuilder = this;
  };

  ProfileBuilder.prototype.generate = function() {
    var username = document.getElementById('pb-username').value || 'developer';
    var name = document.getElementById('pb-name').value || username;
    var title = document.getElementById('pb-title').value || 'Software Developer';
    var linksText = document.getElementById('pb-links').value;
    var links = [];

    if (linksText) {
      linksText.split('\n').forEach(function(line) {
        line = line.trim();
        if (!line) return;
        var parts = line.split('|');
        if (parts.length >= 2) {
          links.push({ label: parts[0].trim(), url: parts[1].trim() });
        }
      });
    }

    var preview = this.renderPreview(username, name, title, links);
    var embedCode = this.generateEmbedHTML(username, name, title, links);

    var output = document.getElementById('pb-output');
    output.style.display = 'block';
    output.innerHTML = preview;

    var embedDiv = document.getElementById('pb-embed-code');
    embedDiv.style.display = 'block';
    document.getElementById('pb-embed-textarea').value = embedCode;
  };

  ProfileBuilder.prototype.renderPreview = function(username, name, title, links) {
    var t = this.config.theme;
    var linksHtml = '';
    if (links.length > 0) {
      linksHtml = '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
      links.slice(0, 5).forEach(function(link) {
        linksHtml += '<a href="' + link.url + '" target="_blank" rel="noopener" ' +
          'style="font-size:0.72rem;padding:4px 10px;border-radius:6px;background:' + t.bg + ';color:' + t.text2 + ';text-decoration:none;border:1px solid #2a2a3a;">' +
          link.label + '</a>';
      });
      if (links.length > 5) {
        linksHtml += '<span style="font-size:0.72rem;color:' + t.text2 + ';">+' + (links.length - 5) + ' more</span>';
      }
      linksHtml += '</div>';
    }
    if (links.length > 5) {
      linksHtml += '<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
      links.slice(5).forEach(function(link) {
        linksHtml += '<a href="' + link.url + '" target="_blank" rel="noopener" ' +
          'style="font-size:0.72rem;padding:4px 10px;border-radius:6px;background:' + t.bg + ';color:' + t.text2 + ';text-decoration:none;border:1px solid #2a2a3a;">' +
          link.label + '</a>';
      });
      linksHtml += '</div>';
    }

    return '<h4 style="color:' + t.text + ';margin-bottom:12px;">Preview</h4>' +
      '<div style="background:linear-gradient(135deg,' + t.bg + ',' + t.surface + ');border-radius:16px;padding:32px;text-align:center;max-width:400px;margin:0 auto;">' +
        '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,' + t.accent + ',' + t.accent2 + ');margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;">' +
          name.charAt(0).toUpperCase() +
        '</div>' +
        '<h3 style="color:' + t.text + ';margin:0 0 4px;font-size:1.2rem;">' + this.escapeHtml(name) + '</h3>' +
        '<div style="color:' + t.text2 + ';font-size:0.85rem;margin-bottom:4px;">@' + this.escapeHtml(username) + '</div>' +
        '<div style="color:' + t.accent2 + ';font-size:0.82rem;margin-bottom:12px;">' + this.escapeHtml(title) + '</div>' +
        linksHtml +
      '</div>';
  };

  ProfileBuilder.prototype.generateEmbedHTML = function(username, name, title, links) {
    var t = this.config.theme;
    var linksHtml = '';
    if (links.length > 0) {
      var displayLinks = links.slice(0, 5);
      linksHtml = '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
      displayLinks.forEach(function(link) {
        linksHtml += '<a href="' + link.url + '" style="font-size:0.72rem;padding:4px 10px;border-radius:6px;background:' + t.bg + ';color:' + t.text2 + ';text-decoration:none;border:1px solid #2a2a3a;">' + link.label + '</a>';
      });
      linksHtml += '</div>';
    }

    return '<div style="background:linear-gradient(135deg,' + t.bg + ',' + t.surface + ');border-radius:16px;padding:32px;text-align:center;max-width:400px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,' + t.accent + ',' + t.accent2 + ');margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;">' +
        name.charAt(0).toUpperCase() +
      '</div>' +
      '<h3 style="color:' + t.text + ';margin:0 0 4px;font-size:1.2rem;">' + this.escapeHtml(name) + '</h3>' +
      '<div style="color:' + t.text2 + ';font-size:0.85rem;margin-bottom:4px;">@' + this.escapeHtml(username) + '</div>' +
      '<div style="color:' + t.accent2 + ';font-size:0.82rem;margin-bottom:12px;">' + this.escapeHtml(title) + '</div>' +
      linksHtml +
    '</div>';
  };

  ProfileBuilder.prototype.escapeHtml = function(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  };

  ProfileBuilder.prototype.copyEmbed = function() {
    var textarea = document.getElementById('pb-embed-textarea');
    if (!textarea) return;
    textarea.select();
    try {
      document.execCommand('copy');
      var btn = event && event.target ? event.target : null;
      if (btn) {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = original; }, 2000);
      }
    } catch (_) {}
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileBuilder;
  } else {
    window.ProfileBuilder = ProfileBuilder;
  }
})();
