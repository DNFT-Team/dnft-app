const compareFunc = require('compare-func')
module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      let discard = true
      const issues = []
      commit.notes.forEach((note) => {
        note.title = 'BREAKING CHANGES'
        discard = false
      })
      if (commit.type === 'feat') {
        commit.type = '✨ Features | Caractéristiques'
      } else if (commit.type === 'fix') {
        commit.type = '🐛 Bug Fixes | Correction de bogues'
      } else if (commit.type === 'perf') {
        commit.type = '⚡ Performance Improvements | Optimisation des performances'
      } else if (commit.type === 'style') {
        commit.type = '💄 Styles | Style'
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = '⏪ Reverts | Revenir à'
      } else if (discard) {
        return
      } else if (commit.type === 'refactor') {
        commit.type = '♻ Code Refactoring | Refonte du code'
      } else if (commit.type === 'docs') {
        commit.type = '📝 Documentation | Documentation'
      } else if (commit.type === 'test') {
        commit.type = '✅ Tests | Essais'
      } else if (commit.type === 'build') {
        commit.type = '👷‍ Build System | Système de construction'
      } else if (commit.type === 'ci') {
        commit.type = '🔧 Continuous Integration | Intégration continue'
      } else if (commit.type === 'chore') {
        commit.type = '🎫 Chores | Corvées'
      }

      if (commit.scope === '*') {
        commit.scope = ''
      }
      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7)
      }
      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          commit.subject = commit.subject.replace(
            /#([0-9]+)/g,
            (_, issue) => {
              issues.push(issue)
              return `[#${issue}](${url}${issue})`
            }
          )
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
            (_, username) => {
              if (username.includes('/')) {
                return `@${username}`
              }

              return `[@${username}](${context.host}/${username})`
            }
          )
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => issues.indexOf(reference.issue) === -1)
      return commit
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
