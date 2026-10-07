// 모든 입력은 로컬 화면 상태에만 사용합니다. 전송·저장 기능은 없습니다.
document.querySelectorAll('[data-cooking]').forEach((browser) => {
  const tablist = browser.querySelector('.cook-tabs');
  const tabs = [...browser.querySelectorAll('[data-menu]')];
  const panels = [...browser.querySelectorAll('[data-panel]')];
  tablist.setAttribute('role', 'tablist');
  const select = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.menu; });
  };
  tabs.forEach((tab, index) => {
    const panel = panels.find((item) => item.dataset.panel === tab.dataset.menu);
    tab.id = `tab-${tab.dataset.menu}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      }
    });
  });
  select(tabs[0]);
});
const hints = {
  first: '고등어를 사용할 메뉴와 원하는 손질 형태를 준비해 주세요.',
  size: '현재 사용하는 어종과 포장 단위, 바꾸고 싶은 크기·손질 형태를 준비해 주세요.',
  expand: '추가하고 싶은 메뉴와 관심 어종, 사용할 조리 장비를 준비해 주세요.',
};
document.querySelectorAll('input[name="purpose"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    document.getElementById('purpose-hint').textContent = hints[radio.value];
  });
});
document.querySelectorAll('.menu').forEach((menu) => {
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.open = false; }));
});
