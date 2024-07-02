document.addEventListener('DOMContentLoaded', () => {
    const pessoasList = document.querySelector('#person-list tbody');
    const newPersonForm = document.getElementById('new-person-form');
    const updatePersonForm = document.getElementById('update-person-form');

    async function ListPeople() { //listagem de pessoas
        try {
            const response = await fetch('https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/Pessoas');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const pessoas = await response.json();
            const pessoasOrdenadas = ordenarPorId(pessoas);

            pessoasList.innerHTML = '';

            pessoasOrdenadas.forEach(person => {
                const row = document.createElement('tr');

                const CelulaId = document.createElement('td');
                CelulaId.textContent = person.Id;
                row.appendChild(CelulaId);

                const CelulaNome = document.createElement('td');
                CelulaNome.textContent = person.Nome || 'Nome não disponível';
                row.appendChild(CelulaNome);

                const CelulaAcoes = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.addEventListener('click', () => DeletePerson(person.Id));
                CelulaAcoes.appendChild(deleteButton);
                row.appendChild(CelulaAcoes);

                pessoasList.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function ordenarPorId(pessoas) { //ordena em forma crescente por ID
        return pessoas.sort((a, b) => a.Id - b.Id);
    }

    async function DeletePerson(id) { //Deleta pessoa
        try {
            const response = await fetch(`https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/DeletePessoaById?PessoaId=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Pessoa deletada com sucesso!');
                ListPeople();
            } else {
                alert('Erro ao deletar pessoa!');
            }
        } catch (error) {
            console.error('Erro ao deletar pessoa:', error);
        }
    }

    async function AddPerson(newPerson) { // Adiciona pessoa
        try {
            const response = await fetch('https://personal-tp6a9zfc.outsystemscloud.com/Pessoas/rest/Pessoas/CreateOrUpdatePessoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPerson)
            });

            if (response.ok) {
                alert('Pessoa cadastrada/Atualizada com sucesso!');
                ListPeople();
            } else {
                alert('Erro ao cadastrar pessoa!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
        }
    }

    newPersonForm.addEventListener('submit', async (event) => { // Cadastra Pessoa
        event.preventDefault();

        const newPerson = {
            Nome: event.target.name.value,
            DataNascimento: event.target.dob.value,
            CPF: event.target.cpf.value
        };

        await AddPerson(newPerson);
    });

    updatePersonForm.addEventListener('submit', async (event) => { // Atualiza Pessoa
        event.preventDefault();

        const newPerson = {
            ID: event.target.id.value,
            Nome: event.target.name.value,
            DataNascimento: event.target.dob.value,
            CPF: event.target.cpf.value
        };

        await AddPerson(newPerson);
    });

    ListPeople();
});
