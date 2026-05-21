(function () {
  'use strict';

  /* ========== Mock 数据 ========== */
  const MOCK_DATA = (function () {
    function r(base, range) {
      return Math.round((base + (Math.random() - 0.5) * range) * 100) / 100;
    }
    function rInt(base, range) {
      return Math.round(base + (Math.random() - 0.5) * range);
    }

    const today = new Date().toISOString().slice(0, 10);
    const channels = [
      {
        name: '微博信息流', cost: r(3800, 600), imp: rInt(380000, 80000),
        click: rInt(12000, 3000), conv: rInt(320, 80),
      },
      {
        name: '抖音开屏', cost: r(3200, 500), imp: rInt(320000, 70000),
        click: rInt(9800, 2500), conv: rInt(260, 60),
      },
      {
        name: '微信朋友圈', cost: r(2800, 400), imp: rInt(260000, 60000),
        click: rInt(8200, 2000), conv: rInt(210, 50),
      },
      {
        name: 'B站信息流', cost: r(1800, 300), imp: rInt(180000, 40000),
        click: rInt(4800, 1200), conv: rInt(130, 30),
      },
      {
        name: '小红书笔记', cost: r(1200, 200), imp: rInt(120000, 30000),
        click: rInt(3200, 800), conv: rInt(95, 20),
      },
    ];

    return {
      date: today,
      kpis: [
        { key: 'cost', label: '总花费', value: '¥12,580', change: '+5.2%', up: true },
        { key: 'impressions', label: '总展示', value: '1,284,560', change: '+12.8%', up: true },
        { key: 'clicks', label: '总点击', value: '38,215', change: '-2.1%', up: false },
        { key: 'roi', label: 'ROI', value: '3.42x', change: '+0.6%', up: true },
      ],
      channels: channels,
      tips: (function (channels) {
        const lowCTR = channels.filter(c => (c.click / c.imp) < 0.028);
        const highCost = channels.filter(c => (c.cost / c.conv) > 11);
        const bestROI = channels.slice().sort((a, b) => (b.conv / b.cost) - (a.conv / a.cost))[0];
        const tips = [];
        if (lowCTR.length) {
          tips.push({
            icon: '🔍', priority: 'high',
            title: `${lowCTR.map(c => c.name).join('、')} 点击率偏低`,
            desc: `平均 CTR ${(lowCTR.reduce((s, c) => s + c.click / c.imp, 0) / lowCTR.length * 100).toFixed(1)}%，建议优化素材及文案标题。`,
          });
        }
        if (highCost.length) {
          tips.push({
            icon: '💰', priority: 'high',
            title: `${highCost.map(c => c.name).join('、')} 转化成本偏高`,
            desc: `平均转化成本 ¥${(highCost.reduce((s, c) => s + c.cost / c.conv, 0) / highCost.length).toFixed(1)}，建议调整出价策略或细分受众。`,
          });
        }
        if (bestROI) {
          const roi = (bestROI.conv / bestROI.cost * 100).toFixed(1);
          tips.push({
            icon: '🚀', priority: 'low',
            title: `${bestROI.name} ROI 表现最佳`,
            desc: `每元 ROI 达 ${roi}%，建议适当增加该渠道预算分配。`,
          });
        }
        tips.push({
          icon: '📊', priority: 'medium',
          title: '整体投放结构建议',
          desc: '信息流渠道占比过高，建议测试视频前贴片广告位以拓展流量来源。',
        });
        return tips;
      }(channels)),
    };
  }());

  /* ========== 渲染函数 ========== */
  function renderKpis(kpis) {
    const grid = document.getElementById('kpiGrid');
    grid.innerHTML = kpis.map(k => `
      <div class="kpi-card">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-change ${k.up ? 'up' : 'down'}">${k.change} ${k.up ? '↑' : '↓'}</div>
      </div>
    `).join('');
  }

  function renderChannels(channels) {
    const body = document.getElementById('channelBody');
    body.innerHTML = channels.map(c => {
      const ctr = (c.click / c.imp * 100).toFixed(2);
      const convCost = (c.cost / c.conv).toFixed(1);
      const roi = (c.conv / c.cost * 100).toFixed(2);
      return `<tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.cost.toFixed(0)}</td>
        <td>${c.imp.toLocaleString()}</td>
        <td>${c.click.toLocaleString()}</td>
        <td>${c.conv}</td>
        <td>${ctr}%</td>
        <td>${convCost}</td>
        <td>${roi}%</td>
      </tr>`;
    }).join('');
  }

  function renderTips(tips) {
    const list = document.getElementById('tipsList');
    list.innerHTML = tips.map(t => `
      <div class="tip-card">
        <span class="tip-icon">${t.icon}</span>
        <div class="tip-content">
          <div class="tip-title">${t.title}</div>
          <div class="tip-desc">${t.desc}</div>
        </div>
        <span class="tip-tag ${t.priority}">${t.priority === 'high' ? '高优先级' : t.priority === 'medium' ? '中优先级' : '参考建议'}</span>
      </div>
    `).join('');
  }

  /* ========== 日期 & 更新时间 ========== */
  function initDate() {
    const input = document.getElementById('reportDate');
    input.value = MOCK_DATA.date;
    input.addEventListener('change', function () {
      // 实际可触发数据刷新，此处提示示意
    });
  }

  function setUpdateTime() {
    const now = new Date();
    document.getElementById('updateTime').textContent =
      now.toLocaleString('zh-CN', { hour12: false });
  }

  /* ========== 初始化 ========== */
  function init() {
    renderKpis(MOCK_DATA.kpis);
    renderChannels(MOCK_DATA.channels);
    renderTips(MOCK_DATA.tips);
    initDate();
    setUpdateTime();
  }

  document.addEventListener('DOMContentLoaded', init);
}());
