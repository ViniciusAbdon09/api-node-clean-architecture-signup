### Configuração Git
    ## git config --global core.editor code
        - Defini o Visual code como o editor das configurações do git na sua maquina.

    ## git config --global --edit
        - Edição das configurações glabais do git.

## Git Alias
    [alias]
	s = !git status -s
	c = !git add . && git commit -m
	# git amend para concatenar mudanças ao commit anterior
	amend = !git add . && git commit --amend --no-edit
	l = !git log --pretty=format:'%C(blue)%h%C(red)%d %C(white)%s %C(cyan)[%cn] %C(green)%cr'

## Lib git-commitmsg-linter
    - Responsável por realizar o linter das mensagens de commit.

## Lib husky
    - Será responsável pelo linter do codigo em seu pré commit.

## lib lint-staged
    - Será responsável por realizar o lint apenas do código que se encontra na area de steged do git
