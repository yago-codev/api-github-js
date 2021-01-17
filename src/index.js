const api = axios.create({
  baseURL: 'https://api.github.com'
});

const initialRepositorys = ['nodejs/node', 'facebook/react', 'facebook/react-native'];
const accordionTitles = document.querySelectorAll('#accordion-header-button');
const accordionBodyContribuitors = document.querySelectorAll('#accordion-body-contribuitors');
const accordionTitlesContribuitors = document.querySelectorAll('#accordion-title-contribuitors');
const listGroups = document.querySelectorAll('#list-group');
let getRepositoryConcluded = false;

window.onload = () => {
  renderAccordions();
};

const renderAccordions = () => {
  initialRepositorys.forEach(async (repo, index) => {
    const getRepository = await api.get(`/repos/${repo}`);
    const repository = getRepository.data
    
    accordionTitles[index].innerHTML = repository.name;
    accordionBodyContribuitors[index].setAttribute('data-contribuitors', repository.contributors_url);
    
    const issuesList = accordionTitles[index].parentNode.nextElementSibling.querySelectorAll('.list-group')[1];
    issuesList.setAttribute('data-issues', repository.issues_url);
    
    const verifyDataRequest = setInterval(() => {
      if (repository !== null) {
        getRepositoryConcluded = true;
        clearInterval(verifyDataRequest);
      }
    }, 500);
  });
  
  verifyRepositoryRequest;
}

const verifyRepositoryRequest = setInterval(() => {
  if (getRepositoryConcluded) {
    getContribuitors();
  }
}, 500);

const getContribuitors = () => {
  if (getRepositoryConcluded) {
    clearInterval(verifyRepositoryRequest);
  }

  accordionBodyContribuitors.forEach(async (accordion_body, index) => {
    const urlContribuitors = accordion_body.getAttribute('data-contribuitors');
    const response = await api.get(`${urlContribuitors}?per_page=20`);
    const contribuitors = response.data;
    listGroups[index].innerHTML = contribuitors.map((contribuitor) => `<li class="list-group-item d-flex align-items-center justify-content-between">${contribuitor.login}<h5 class="d-flex align-items-center mb-0"><span class="badge bg-dark">${contribuitor.contributions}</span></h5></li>`).join('');
  });

  getIssues();
};

const getIssues = () => {
  accordionTitles.forEach(async (title, index) => {
    const subAccordionHeader = title.parentNode;
    const issuesList = subAccordionHeader.nextElementSibling.querySelectorAll('.list-group')[1];
    const urlIssues = issuesList.getAttribute('data-issues');
    const [https, , link, repos, owner, repoName] = urlIssues.split('/');
    const urlIssuesFormated = `${https}//${link}/${repos}/${owner}/${repoName}/issues?per_page=20`
    const response = await api.get(`${urlIssuesFormated}`);
    const issues = response.data;
    issuesList.innerHTML = issues.map((issue) => {
      return `<li class="list-group-item d-flex align-items-center justify-content-between">${issue.title}<h5 class="d-flex align-items-center mb-0"><span class="badge bg-dark">${issue.state}</span></h5></li>`;
    }).join('');
  });
};
