(function() {
  'use strict';

  const CONFIG = {
    username: 'Raphasha27',
    cacheDuration: 30 * 60 * 1000
  };

  function getCache(key) {
    const cached = localStorage.getItem('pow_' + key);
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CONFIG.cacheDuration) {
        return parsed.data;
      }
    } catch (_) {}
    return null;
  }

  function setCache(key, data) {
    try {
      localStorage.setItem('pow_' + key, JSON.stringify({ data: data, timestamp: Date.now() }));
    } catch (_) {}
  }

  async function fetchGitHubStats() {
    const cached = getCache('github_stats');
    if (cached) return cached;

    try {
      const res = await fetch('https://api.github.com/users/' + CONFIG.username);
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();

      const stats = {
        followers: data.followers || 0,
        publicRepos: data.public_repos || 0,
        stars: 0,
        avatar: data.avatar_url || '',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || ''
      };

      const reposRes = await fetch('https://api.github.com/users/' + CONFIG.username + '/repos?per_page=100&sort=updated');
      if (reposRes.ok) {
        const repos = await reposRes.json();
        stats.stars = repos.reduce(function(acc, r) { return acc + (r.stargazers_count || 0); }, 0);
        stats.topRepos = repos
          .filter(function(r) { return r.stargazers_count > 0; })
          .sort(function(a, b) { return b.stargazers_count - a.stargazers_count; })
          .slice(0, 6);
      }

      setCache('github_stats', stats);
      return stats;
    } catch (err) {
      console.warn('Proof of Work: Could not fetch GitHub stats', err);
      return null;
    }
  }

  async function fetchContributionGraph() {
    const cached = getCache('contribs');
    if (cached) return cached;

    try {
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/' + CONFIG.username + '?y=last');
      if (!res.ok) throw new Error('Contrib API error');
      const data = await res.json();
      setCache('contribs', data);
      return data;
    } catch (err) {
      console.warn('Proof of Work: Could not fetch contributions', err);
      return null;
    }
  }

  function renderContributionGraph(data) {
    const container = document.getElementById('contributionGraph');
    if (!container || !data || !data.contributions) return;

    const contributions = data.contributions;
    const total = data.totalContributions || contributions.length;
    const weeks = [];
    let currentWeek = [];

    contributions.forEach(function(day, i) {
      currentWeek.push(day);
      if (currentWeek.length === 7 || i === contributions.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    var html = '<div style="overflow-x:auto;padding:8px 0;">';
    html += '<div style="display:flex;gap:3px;">';
    weeks.forEach(function(week) {
      html += '<div style="display:flex;flex-direction:column;gap:3px;">';
      week.forEach(function(day) {
        var count = day.count || 0;
        var intensity = count === 0 ? '#1a1a25' :
          count < 3 ? '#0e4429' :
          count < 6 ? '#006d32' :
          count < 10 ? '#26a641' : '#39d353';
        html += '<div style="width:10px;height:10px;border-radius:2px;background:' + intensity + ';" title="' + count + ' contributions on ' + day.date + '"></div>';
      });
      html += '</div>';
    });
    html += '</div>';
    html += '<p style="color:var(--text2);font-size:0.78rem;margin-top:8px;">' + (data.totalContributions || '—') + ' contributions in the last year</p>';
    html += '</div>';

    container.innerHTML = html;
  }

  function renderStats(stats) {
    if (!stats) return;

    var statsContainer = document.getElementById('liveStats');
    if (statsContainer) {
      statsContainer.innerHTML =
        '<div class="stat-card"><div class="value">' + stats.followers + '+</div><div class="label">GitHub Followers</div></div>' +
        '<div class="stat-card"><div class="value">' + stats.publicRepos + '</div><div class="label">Public Repos</div></div>' +
        '<div class="stat-card"><div class="value">' + (stats.followers > 500 ? '5.8K+' : stats.followers + '+') + '</div><div class="label">Network Connections</div></div>' +
        '<div class="stat-card"><div class="value">' + stats.stars + '</div><div class="label">Project Stars</div></div>' +
        '<div class="stat-card"><div class="value">2025</div><div class="label">BSc IT (Distinction)</div></div>';
    }

    var reposContainer = document.getElementById('reposContainer');
    if (reposContainer && stats.topRepos && stats.topRepos.length > 0) {
      var html = '';
      stats.topRepos.forEach(function(repo) {
        var lang = repo.language ? '<span>' + repo.language + '</span>' : '';
        html +=
          '<div class="project-card">' +
          '<div class="role">' + (repo.fork ? 'Fork' : 'Repository') + '</div>' +
          '<h3><a href="' + repo.html_url + '" target="_blank" rel="noopener">' + repo.name + '</a></h3>' +
          '<p>' + (repo.description || 'No description') + '</p>' +
          '<div class="project-tags">' + lang + '<span>&#x2B50; ' + repo.stargazers_count + '</span></div>' +
          '</div>';
      });
      reposContainer.innerHTML = html;
    }
  }

  async function init() {
    var stats = await fetchGitHubStats();
    renderStats(stats);

    var contribs = await fetchContributionGraph();
    renderContributionGraph(contribs);

    var powBadge = document.getElementById('powBadge');
    if (powBadge && stats) {
      powBadge.textContent = 'Verified: ' + stats.followers + ' followers, ' + stats.publicRepos + ' repos, ' + stats.stars + ' stars';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
})();
