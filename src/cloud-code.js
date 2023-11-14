const projectId = `infinite-ctf`;

const compute = require('@google-cloud/compute');

async function listImages(){
    const images = imagesClient.listAsync({
        project: projectId,
        maxResults: 3, 
        filter: 'deprecated.state != DEPRECATED'
    });
}

async function createInstance(){
    const zone = 'europe-central2-b'
    const instanceName = 'problem1'
    const machineType = 'e2-standard-e2';
    const sourceImage = 'projects/debian-cloud/global/images/family/debian-10';
    const networkName = 'global/networks/default';

    const instancesClient = new compute.InstancesClient();

    console.log(`Creating the ${instanceName} instance in ${zone}...`);

    const [response] = await instancesClient.insert({
      instanceResource: {
        name: instanceName,
        disks: [
          {
            // Describe the size and source image of the boot disk to attach to the instance.
            initializeParams: {
              diskSizeGb: '10',
              sourceImage,
            },
            autoDelete: true,
            boot: true,
            type: 'PERSISTENT',
          },
        ],
        machineType: `zones/${zone}/machineTypes/${machineType}`,
        networkInterfaces: [
          {
            // Use the network interface provided in the networkName argument.
            name: networkName,
          },
        ],
      },
      project: projectId,
      zone,
    });
    let operation = response.latestResponse;
    const operationsClient = new compute.ZoneOperationsClient();
  
    // Wait for the create operation to complete.
    while (operation.status !== 'DONE') {
      [operation] = await operationsClient.wait({
        operation: operation.name,
        project: projectId,
        zone: operation.zone.split('/').pop(),
      });
    }
  
    console.log('Instance created.');
  }

  createInstance();