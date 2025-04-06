import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Card, Spinner, Alert, Button } from "flowbite-react";
import { HiInformationCircle, HiTrash } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaFilePdf } from "react-icons/fa6";

export default function Affectation() {
  const [excelData, setExcelData] = useState([]);
  const [searched, setSearched] = useState("");
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormateur, setSelectedFormateur] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formateurs, setFormateurs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/showallformateurs")
      .then((res) => res.json())
      .then((data) => setFormateurs(data));

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/AffectationController");

        if (!response.ok) {
          throw new Error("La réponse du réseau n'était pas correcte");
        }

        const data = await response.json();
        console.log(data)
        setExcelData(data);
      } catch (error) {
        setError('Échec de la récupération des données');
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (mle, nomGroup, codeModule) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce formateur ?")) {
        return;
    }

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/formateur/${mle}/${nomGroup}/${codeModule}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Échec de la suppression");
        }

        setFilteredData((prevData) => prevData.filter(item => item.mle_formateur !== mle));

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
  }


  useEffect(() => {
          if (searched) {
              setFilteredData(
                  excelData.filter((d) =>
                      d.nom_module.toLowerCase().includes(searched.toLowerCase())
                  )
              );
          } else {
              setFilteredData(excelData);
          }
      }, [searched, excelData]);

   if (loading) {
      return (
        <div className="flex flex-col items-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4">
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium mb-4">{error}</span>
            </Alert>
            <Button color="blue" onClick={() => navigate('/importData')}>
            Importer des données
          </Button>
        </div>
      );
    }

    const handleEdit = (index) => {
      setEditIndex(index);
    }

    const handleSave = async (formateurid, groupeid, moduleid) => {
      console.log(selectedFormateur)
      try {
          const response = await fetch(
              `http://127.0.0.1:8000/api/updateformateurmodule`,
              {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      new_id: Number(selectedFormateur),
                      old_id: Number(formateurid),
                      module_id: Number(moduleid),
                      groupe_id: Number(groupeid),
                  }),
              }
          );

          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message || "Échec de la mise à jour");
          }


          setExcelData((prevData) =>
              prevData.map((item) =>
                  item.formateurid === formateurid
                      ? { ...item, formateurid: selectedFormateur }
                      : item
              )
          );

          alert("Formateur mis à jour avec succès");
          setEditIndex(null);

      } catch (error) {
          console.error("Erreur lors de la mise à jour :", error);
          alert(`Erreur: ${error.message}`);
      }
    };

    const handleExport = () => {
      window.location.href = 'http://127.0.0.1:8000/export/affectation-modules';
    };

    const handleDownloadPdf= async()=>{
      try{
        const res=await fetch('http://127.0.0.1:8000/api/AffectationModule/pdf',{
          method:'GET',
          headers:{
            'accept':'application/pdf'
          }
        })
        const blob=await res.blob()
        const url=window.URL.createObjectURL(blob)
        const a=document.createElement('a')
        a.href=url
        a.download='Affectation_modules.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.parentNode.removeChild(a);
      }catch(err){
        console.error('erreur de telechargement',err);
      }
    }

  return (
    <div className="mx-auto p-4">
      <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black mb-4">Etat d'affectation des modules</h2>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" onClick={handleDownloadPdf}>
            <FaFilePdf className="h-4 w-4 mr-2" />
            <span className="text-md">PDF</span>
          </button>
          <button  className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" onClick={handleExport}>
            <RiFileExcel2Fill className="h-4 w-4 mr-2" />
            <span className="text-md">Excel</span>
          </button>
        </div>
        </div>
        <form>
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
          </svg>
          </div>
          <input
          type="search"
          value={searched}
          onChange={e=>setSearched(e.target.value)}
          id="search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Recherche Par Module"
          required
          />

          </div>
        </form>
        <div className="overflow-x-auto">
          <Table striped hoverable className="text-black text-xs">
            <Table.Head className="bg-gray-100">
              <Table.HeadCell>Mle Formateur</Table.HeadCell>
              <Table.HeadCell>Nom & Prénom Formateur</Table.HeadCell>
              <Table.HeadCell>Filière</Table.HeadCell>
              <Table.HeadCell>Type de Formation</Table.HeadCell>
              <Table.HeadCell>Groupe</Table.HeadCell>
              <Table.HeadCell>Année de Formation</Table.HeadCell>
              <Table.HeadCell>Mode</Table.HeadCell>
              <Table.HeadCell>Code Module</Table.HeadCell>
              <Table.HeadCell>Module</Table.HeadCell>
              <Table.HeadCell>MHP S1</Table.HeadCell>
              <Table.HeadCell>MHSYN S1</Table.HeadCell>
              <Table.HeadCell>MH Totale S1</Table.HeadCell>
              <Table.HeadCell>MHP S2</Table.HeadCell>
              <Table.HeadCell>MHSYN S2</Table.HeadCell>
              <Table.HeadCell>MH Totale S2</Table.HeadCell>
              <Table.HeadCell>MHP Totale</Table.HeadCell>
              <Table.HeadCell>MHSYN Totale</Table.HeadCell>
              <Table.HeadCell>MH Totale</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y text-center">
              {filteredData.map((data, index) => (
                <Table.Row key={index} className="bg-white">
                  <Table.Cell className=' text-left'>{data.mle_formateur}</Table.Cell>
                  <Table.Cell onClick={()=>handleEdit(index)}>
                    {
                      editIndex===index ? (
                        <select 
                        value={selectedFormateur} 
                        onChange={e=>setSelectedFormateur(e.target.value)}
                        >
                          <option>Selectionner un formateur</option>
                          {
                            formateurs.map(ele=>(
                              <option value={ele.id} key={ele.id}>
                                {ele.nom_formateur}
                              </option>
                            ))
                          }
                        </select>
                      ):(data.nom_formateur)
                    }
                  </Table.Cell>
                  <Table.Cell className=' text-left'>{data.nom_filiere}</Table.Cell>
                  <Table.Cell>{data.type_formation}</Table.Cell>
                  <Table.Cell>{data.nom_groupe}</Table.Cell>
                  <Table.Cell>{data.annee_formation}</Table.Cell>
                  <Table.Cell>{data.mode_formation}</Table.Cell>
                  <Table.Cell>{data.code_module}</Table.Cell>
                  <Table.Cell className=' text-left'>{data.nom_module}</Table.Cell>
                  <Table.Cell>{data.mhp_S1}</Table.Cell>
                  <Table.Cell>{data.mhsyn_S1}</Table.Cell>
                  <Table.Cell className=' font-medium'>{data.mhp_S1 + data.mhsyn_S1}</Table.Cell>
                  <Table.Cell>{data.mhp_S2}</Table.Cell>
                  <Table.Cell>{data.mhsyn_S2}</Table.Cell>
                  <Table.Cell className=' font-medium'>{data.mhp_S2 + data.mhsyn_S2}</Table.Cell>
                  <Table.Cell className=' font-medium'>{data.mhp_S1 + data.mhp_S2}</Table.Cell>
                  <Table.Cell className=' font-medium'>{data.mhsyn_S1 + data.mhsyn_S2}</Table.Cell>
                  <Table.Cell className=' font-medium'>{data.mhp_S1 + data.mhp_S2 + data.mhsyn_S1 + data.mhsyn_S2}</Table.Cell>
                  <Table.Cell style={{ display: "flex" }}>
                    {editIndex === index ? (
                      <button
                        className="mr-2 text-green-500"
                        onClick={() =>
                        handleSave(
                          data.formateur_presentiel_id,
                          data.groupid,
                          data.module_id
                          )
                        }
                        >
                        Enregistrer
                        </button>
                        ) : (
                        ""
                        )}
                        <button
                        color="failure"
                        size="xs"
                        onClick={() =>
                        handleDelete(
                          data.mle_formateur,
                          data.nom_groupe,
                          data.code_module
                          )
                        }
                        >
                        <HiTrash className="w-4 h-4" />
                        </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
}
